import type { Env, JobPayload, JobRow } from '../types'
import { evaluateJobWithAi } from './ai'
import { nowIso, randomId } from './crypto'
import {
  bumpSettingCounter,
  enqueueDistributionEvent,
  getSetting,
  logDecision,
  markContactVerified,
  rowToJob,
  saveAiResult,
  updateJobStatus,
} from './db'
import { decidePublication } from './decision'
import {
  sendAdminReviewEmail,
  sendNeedsCorrectionEmail,
  sendPublishedEmail,
  sendRejectedEmail,
} from './email'
import { siteUrl } from './http'

export async function runPostVerificationPipeline(
  env: Env,
  request: Request,
  job: JobRow,
  payload: JobPayload,
  organization: {
    id: string
    status: 'pending' | 'verified' | 'suspended'
    auto_publish: number
  } | null,
) {
  const db = env.DB
  await markContactVerified(db, job.id)
  await logDecision(db, job.id, 'system', 'contact_verified')

  const aiResult = await evaluateJobWithAi(env, payload)
  let ai = null
  let aiFailed = false
  if (aiResult.ok) {
    ai = aiResult.evaluation
    await bumpSettingCounter(db, 'ai_evaluations_count')
    await logDecision(db, job.id, 'ai', 'evaluated', ai.summary, ai)
  } else {
    aiFailed = true
    await logDecision(db, job.id, 'system', 'ai_failed', aiResult.error)
  }

  const autoPublishEnabled = (await getSetting(db, 'auto_publish_enabled', '0')) === '1'
  const decision = decidePublication({
    contactVerified: true,
    organization: organization
      ? {
          id: organization.id,
          name: '',
          website: '',
          org_type: '',
          normalized_name: '',
          status: organization.status,
          auto_publish: organization.auto_publish,
          created_at: '',
          updated_at: '',
        }
      : null,
    autoPublishEnabled,
    ai,
    aiFailed,
    hardBlockReasons: [],
    softCorrectionReasons: [],
  })

  if (ai) await saveAiResult(db, job.id, ai, decision.reasons)

  await updateJobStatus(db, job.id, decision.status, {
    approvalMethod: decision.approvalMethod || undefined,
    actor: decision.approvalMethod === 'ai' ? 'ai' : 'system',
    notes: decision.reasons.join(' · '),
  })

  const base = siteUrl(env, request)
  const publicUrl = `${base}/empleos/${job.slug}`
  const adminUrl = `${base}/empleos/admin`

  if (decision.status === 'published') {
    await sendPublishedEmail(env, job.contact_email, job.title, publicUrl)
  } else if (decision.status === 'needs_correction') {
    await sendNeedsCorrectionEmail(env, job.contact_email, job.title, decision.reasons)
  } else if (decision.status === 'rejected') {
    await sendRejectedEmail(env, job.contact_email, job.title, decision.reasons)
  } else if (decision.status === 'under_review') {
    await sendAdminReviewEmail(env, job.title, job.company, adminUrl)
  }

  const refreshed = await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(job.id).first<JobRow>()
  return {
    job: refreshed ? rowToJob(refreshed) : null,
    decision,
    ai,
  }
}

export async function createVerificationToken(db: D1Database, jobId: string, email: string) {
  const token = randomId().replace(/-/g, '') + randomId().replace(/-/g, '')
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  await db
    .prepare(
      `INSERT INTO verification_tokens (token, job_id, email, expires_at, used_at, created_at)
       VALUES (?, ?, ?, ?, '', ?)`,
    )
    .bind(token, jobId, email, expires, nowIso())
    .run()
  return token
}

export { enqueueDistributionEvent }
