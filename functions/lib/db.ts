import type { AiEvaluation, Env, JobPayload, JobRow, JobStatus, OrganizationRow, OrgStatus } from '../types'
import { normalizeOrgName, nowIso, randomId, sha256, slugify } from './crypto'
import { contentFingerprint } from './validate'

export async function getSetting(db: D1Database, key: string, fallback = '') {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>()
  return row?.value ?? fallback
}

export async function setSetting(db: D1Database, key: string, value: string) {
  await db
    .prepare(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .bind(key, value)
    .run()
}

export async function bumpSettingCounter(db: D1Database, key: string) {
  const current = Number(await getSetting(db, key, '0')) || 0
  await setSetting(db, key, String(current + 1))
  return current + 1
}

export async function checkRateLimit(db: D1Database, key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const row = await db
    .prepare('SELECT count, window_start FROM rate_limits WHERE key = ?')
    .bind(key)
    .first<{ count: number; window_start: string }>()

  if (!row) {
    await db
      .prepare('INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?)')
      .bind(key, new Date(now).toISOString())
      .run()
    return { allowed: true, remaining: limit - 1 }
  }

  const start = new Date(row.window_start).getTime()
  if (now - start > windowMs) {
    await db
      .prepare('UPDATE rate_limits SET count = 1, window_start = ? WHERE key = ?')
      .bind(new Date(now).toISOString(), key)
      .run()
    return { allowed: true, remaining: limit - 1 }
  }

  if (row.count >= limit) return { allowed: false, remaining: 0 }

  await db.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run()
  return { allowed: true, remaining: limit - row.count - 1 }
}

export function rowToJob(row: JobRow) {
  let aiResult: AiEvaluation | null = null
  if (row.ai_result_json) {
    try {
      aiResult = JSON.parse(row.ai_result_json) as AiEvaluation
    } catch {
      aiResult = null
    }
  }
  let reviewReasons: string[] = []
  try {
    reviewReasons = JSON.parse(row.review_reasons_json || '[]') as string[]
  } catch {
    reviewReasons = []
  }

  const status = effectiveStatus(row)
  return {
    id: row.id,
    slug: row.slug,
    organizationId: row.organization_id,
    title: row.title,
    company: row.company,
    companyLogo: row.company_logo || '',
    companyWebsite: row.company_website || '',
    orgType: row.org_type || '',
    description: row.description,
    responsibilities: row.responsibilities || '',
    requirements: row.requirements || '',
    type: row.type,
    areas: JSON.parse(row.areas_json || '[]') as string[],
    careers: JSON.parse(row.careers_json || '[]') as string[],
    openToAllCareers: Boolean(row.open_to_all_careers),
    experienceLevel: row.experience_level,
    modality: row.modality,
    location: row.location,
    schedule: row.schedule,
    compensation: row.compensation || '',
    applicationUrl: row.application_url,
    deadline: row.deadline || '',
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone || '',
    contactVerified: Boolean(row.contact_verified),
    status,
    statusRaw: row.status,
    approvalMethod: row.approval_method || '',
    aiResult,
    reviewReasons,
    isDemo: Boolean(row.is_demo),
    publishedAt: row.published_at || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function effectiveStatus(row: Pick<JobRow, 'status' | 'deadline'>) {
  if (row.status === 'published' && row.deadline) {
    const end = new Date(`${row.deadline}T23:59:59`)
    if (!Number.isNaN(end.getTime()) && end.getTime() < Date.now()) return 'expired' as const
  }
  return row.status
}

export async function uniqueSlug(db: D1Database, base: string, ignoreId?: string) {
  const root = slugify(base) || 'oportunidad'
  let slug = root
  let index = 2
  while (true) {
    const existing = await db
      .prepare('SELECT id FROM jobs WHERE slug = ?')
      .bind(slug)
      .first<{ id: string }>()
    if (!existing || existing.id === ignoreId) return slug
    slug = `${root}-${index}`
    index += 1
  }
}

export async function findOrCreateOrganization(
  db: D1Database,
  name: string,
  website: string,
  orgType: string,
) {
  const normalized = normalizeOrgName(name)
  const existing = await db
    .prepare('SELECT * FROM organizations WHERE normalized_name = ?')
    .bind(normalized)
    .first<OrganizationRow>()
  if (existing) return existing

  const now = nowIso()
  const org: OrganizationRow = {
    id: randomId(),
    name: name.trim(),
    website: website.trim(),
    org_type: orgType.trim(),
    normalized_name: normalized,
    status: 'pending',
    auto_publish: 0,
    created_at: now,
    updated_at: now,
  }
  await db
    .prepare(
      `INSERT INTO organizations
      (id, name, website, org_type, normalized_name, status, auto_publish, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      org.id,
      org.name,
      org.website,
      org.org_type,
      org.normalized_name,
      org.status,
      org.auto_publish,
      org.created_at,
      org.updated_at,
    )
    .run()
  return org
}

export async function logDecision(
  db: D1Database,
  jobId: string,
  actor: string,
  action: string,
  notes = '',
  payload: unknown = null,
) {
  await db
    .prepare(
      `INSERT INTO decision_log (id, job_id, actor, action, notes, payload_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(randomId(), jobId, actor, action, notes, payload ? JSON.stringify(payload) : '', nowIso())
    .run()
}

export async function enqueueDistributionEvent(db: D1Database, jobId: string, eventType: string, payload: unknown) {
  await db
    .prepare(
      `INSERT INTO distribution_events (id, job_id, event_type, payload_json, processed, created_at)
       VALUES (?, ?, ?, ?, 0, ?)`,
    )
    .bind(randomId(), jobId, eventType, JSON.stringify(payload), nowIso())
    .run()
}

export async function insertJob(
  db: D1Database,
  payload: JobPayload,
  extras: {
    organizationId: string
    status: JobStatus
    ipHash: string
    contactVerified?: boolean
  },
) {
  const now = nowIso()
  const id = randomId()
  const slug = await uniqueSlug(db, `${payload.company} ${payload.title}`)
  const hash = await sha256(contentFingerprint(payload))

  await db
    .prepare(
      `INSERT INTO jobs (
        id, slug, organization_id, title, company, company_logo, company_website, org_type,
        description, responsibilities, requirements, type, areas_json, careers_json,
        open_to_all_careers, experience_level, modality, location, schedule, compensation,
        application_url, deadline, contact_name, contact_email, contact_phone, contact_verified,
        status, approval_method, ai_result_json, review_reasons_json, content_hash,
        submitter_ip_hash, is_demo, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '[]', ?, ?, 0, '', ?, ?)`,
    )
    .bind(
      id,
      slug,
      extras.organizationId,
      payload.title,
      payload.company,
      payload.companyLogo || '',
      payload.companyWebsite || '',
      payload.orgType || '',
      payload.description,
      payload.responsibilities || '',
      payload.requirements || '',
      payload.type,
      JSON.stringify(payload.areas),
      JSON.stringify(payload.openToAllCareers ? [] : payload.careers),
      payload.openToAllCareers ? 1 : 0,
      payload.experienceLevel,
      payload.modality,
      payload.location,
      payload.schedule,
      payload.compensation || '',
      payload.applicationUrl,
      payload.deadline || '',
      payload.contactName,
      payload.contactEmail,
      payload.contactPhone || '',
      extras.contactVerified ? 1 : 0,
      extras.status,
      hash,
      extras.ipHash,
      now,
      now,
    )
    .run()

  return (await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first<JobRow>())!
}

export async function findDuplicate(db: D1Database, payload: JobPayload) {
  const hash = await sha256(contentFingerprint(payload))
  return db
    .prepare(
      `SELECT * FROM jobs
       WHERE content_hash = ?
         AND status NOT IN ('rejected', 'unpublished')
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .bind(hash)
    .first<JobRow>()
}

export async function getJobById(db: D1Database, id: string) {
  return db.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first<JobRow>()
}

export async function getJobBySlug(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM jobs WHERE slug = ?').bind(slug).first<JobRow>()
}

export async function listPublicJobs(db: D1Database) {
  const { results } = await db
    .prepare(
      `SELECT * FROM jobs
       WHERE status = 'published' AND is_demo = 0
       ORDER BY published_at DESC, created_at DESC`,
    )
    .all<JobRow>()
  return (results || []).map(rowToJob).filter((job) => job.status === 'published')
}

export async function listJobs(db: D1Database, status?: string) {
  if (status && status !== 'all') {
    if (status === 'expired') {
      const { results } = await db
        .prepare(`SELECT * FROM jobs WHERE status = 'published' ORDER BY updated_at DESC`)
        .all<JobRow>()
      return (results || []).map(rowToJob).filter((job) => job.status === 'expired')
    }
    if (status === 'pending') {
      const { results } = await db
        .prepare(
          `SELECT * FROM jobs
           WHERE status IN ('pending_verification', 'under_review', 'needs_correction')
           ORDER BY created_at DESC`,
        )
        .all<JobRow>()
      return (results || []).map(rowToJob)
    }
    const { results } = await db
      .prepare(`SELECT * FROM jobs WHERE status = ? ORDER BY updated_at DESC`)
      .bind(status)
      .all<JobRow>()
    return (results || []).map(rowToJob)
  }
  const { results } = await db.prepare(`SELECT * FROM jobs ORDER BY updated_at DESC`).all<JobRow>()
  return (results || []).map(rowToJob)
}

export async function updateJobStatus(
  db: D1Database,
  id: string,
  status: JobStatus,
  extras: { approvalMethod?: string; actor: string; notes?: string },
) {
  const now = nowIso()
  const publishedAt = status === 'published' ? now : null
  if (publishedAt) {
    await db
      .prepare(
        `UPDATE jobs
         SET status = ?, approval_method = COALESCE(?, approval_method),
             published_at = CASE WHEN published_at = '' OR published_at IS NULL THEN ? ELSE published_at END,
             updated_at = ?
         WHERE id = ?`,
      )
      .bind(status, extras.approvalMethod || null, publishedAt, now, id)
      .run()
  } else {
    await db
      .prepare(`UPDATE jobs SET status = ?, updated_at = ? WHERE id = ?`)
      .bind(status, now, id)
      .run()
  }
  await logDecision(db, id, extras.actor, `status:${status}`, extras.notes || '')
  if (status === 'published') {
    const job = await getJobById(db, id)
    if (job) {
      await enqueueDistributionEvent(db, id, 'job.published', {
        slug: job.slug,
        title: job.title,
        company: job.company,
      })
    }
  }
}

export async function saveAiResult(db: D1Database, id: string, evaluation: AiEvaluation, reasons: string[]) {
  await db
    .prepare(
      `UPDATE jobs
       SET ai_result_json = ?, review_reasons_json = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(JSON.stringify(evaluation), JSON.stringify(reasons), nowIso(), id)
    .run()
}

export async function markContactVerified(db: D1Database, id: string) {
  await db
    .prepare(`UPDATE jobs SET contact_verified = 1, updated_at = ? WHERE id = ?`)
    .bind(nowIso(), id)
    .run()
}

export async function listOrganizations(db: D1Database) {
  const { results } = await db
    .prepare(`SELECT * FROM organizations ORDER BY updated_at DESC`)
    .all<OrganizationRow>()
  return results || []
}

export async function updateOrganization(
  db: D1Database,
  id: string,
  patch: { status?: OrgStatus; autoPublish?: boolean },
) {
  const org = await db.prepare('SELECT * FROM organizations WHERE id = ?').bind(id).first<OrganizationRow>()
  if (!org) return null
  const status = patch.status ?? org.status
  const autoPublish =
    patch.autoPublish === undefined ? org.auto_publish : patch.autoPublish ? 1 : 0
  await db
    .prepare(`UPDATE organizations SET status = ?, auto_publish = ?, updated_at = ? WHERE id = ?`)
    .bind(status, autoPublish, nowIso(), id)
    .run()
  return db.prepare('SELECT * FROM organizations WHERE id = ?').bind(id).first<OrganizationRow>()
}

export async function getStats(db: D1Database) {
  const jobs = await listJobs(db, 'all')
  const orgs = await listOrganizations(db)
  const aiCount = Number(await getSetting(db, 'ai_evaluations_count', '0')) || 0
  return {
    published: jobs.filter((j) => j.status === 'published').length,
    pending: jobs.filter((j) =>
      ['pending_verification', 'under_review', 'needs_correction'].includes(j.statusRaw || j.status),
    ).length,
    autoApproved: jobs.filter((j) => j.approvalMethod === 'ai' && j.status === 'published').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
    verifiedOrgs: orgs.filter((o) => o.status === 'verified').length,
    aiEvaluations: aiCount,
    autoPublishEnabled: (await getSetting(db, 'auto_publish_enabled', '0')) === '1',
  }
}

export function requireDb(env: Env) {
  if (!env.DB) throw new Error('D1 binding DB is missing')
  return env.DB
}
