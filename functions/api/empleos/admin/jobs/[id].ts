import type { Env, JobPayload, JobStatus } from '../../../../types'
import { requireAdmin } from '../../../../lib/auth'
import { nowIso } from '../../../../lib/crypto'
import {
  getJobById,
  logDecision,
  requireDb,
  rowToJob,
  updateJobStatus,
} from '../../../../lib/db'
import {
  sendNeedsCorrectionEmail,
  sendPublishedEmail,
  sendRejectedEmail,
} from '../../../../lib/email'
import { error, json, readJson, siteUrl } from '../../../../lib/http'

type ActionBody = {
  action?: 'approve' | 'reject' | 'unpublish' | 'request_corrections' | 'update'
  notes?: string
  reasons?: string[]
  job?: Partial<JobPayload> & { deadline?: string; status?: JobStatus }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  const db = requireDb(context.env)
  const id = context.params.id as string
  const row = await getJobById(db, id)
  if (!row) return error('No encontrada', 404)
  const decisions = await db
    .prepare(`SELECT * FROM decision_log WHERE job_id = ? ORDER BY created_at DESC LIMIT 50`)
    .bind(id)
    .all()
  return json({ job: rowToJob(row), decisions: decisions.results || [] })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  const db = requireDb(context.env)
  const id = context.params.id as string
  const row = await getJobById(db, id)
  if (!row) return error('No encontrada', 404)

  const body = (await readJson<ActionBody>(context.request)) || {}
  const actor = `admin:${auth.subject}`
  const base = siteUrl(context.env, context.request)

  if (body.action === 'update' && body.job) {
    const j = body.job
    await db
      .prepare(
        `UPDATE jobs SET
          title = COALESCE(?, title),
          company = COALESCE(?, company),
          company_website = COALESCE(?, company_website),
          org_type = COALESCE(?, org_type),
          description = COALESCE(?, description),
          responsibilities = COALESCE(?, responsibilities),
          requirements = COALESCE(?, requirements),
          type = COALESCE(?, type),
          areas_json = COALESCE(?, areas_json),
          careers_json = COALESCE(?, careers_json),
          open_to_all_careers = COALESCE(?, open_to_all_careers),
          experience_level = COALESCE(?, experience_level),
          modality = COALESCE(?, modality),
          location = COALESCE(?, location),
          schedule = COALESCE(?, schedule),
          compensation = COALESCE(?, compensation),
          application_url = COALESCE(?, application_url),
          deadline = COALESCE(?, deadline),
          contact_name = COALESCE(?, contact_name),
          contact_email = COALESCE(?, contact_email),
          contact_phone = COALESCE(?, contact_phone),
          updated_at = ?
        WHERE id = ?`,
      )
      .bind(
        j.title ?? null,
        j.company ?? null,
        j.companyWebsite ?? null,
        j.orgType ?? null,
        j.description ?? null,
        j.responsibilities ?? null,
        j.requirements ?? null,
        j.type ?? null,
        j.areas ? JSON.stringify(j.areas) : null,
        j.careers ? JSON.stringify(j.careers) : null,
        j.openToAllCareers === undefined ? null : j.openToAllCareers ? 1 : 0,
        j.experienceLevel ?? null,
        j.modality ?? null,
        j.location ?? null,
        j.schedule ?? null,
        j.compensation ?? null,
        j.applicationUrl ?? null,
        j.deadline ?? null,
        j.contactName ?? null,
        j.contactEmail ?? null,
        j.contactPhone ?? null,
        nowIso(),
        id,
      )
      .run()
    await logDecision(db, id, actor, 'edited', body.notes || '')
    const updated = await getJobById(db, id)
    return json({ job: updated ? rowToJob(updated) : null })
  }

  if (body.action === 'approve') {
    await updateJobStatus(db, id, 'published', {
      approvalMethod: 'admin',
      actor,
      notes: body.notes || 'Aprobada por FEUC',
    })
    await sendPublishedEmail(context.env, row.contact_email, row.title, `${base}/empleos/${row.slug}`)
  } else if (body.action === 'reject') {
    await updateJobStatus(db, id, 'rejected', { actor, notes: body.notes || 'Rechazada' })
    await sendRejectedEmail(context.env, row.contact_email, row.title, body.reasons || [body.notes || 'Rechazada'])
  } else if (body.action === 'unpublish') {
    await updateJobStatus(db, id, 'unpublished', { actor, notes: body.notes || 'Despublicada' })
  } else if (body.action === 'request_corrections') {
    const reasons = body.reasons || [body.notes || 'Se requieren correcciones']
    await updateJobStatus(db, id, 'needs_correction', { actor, notes: reasons.join(' · ') })
    await db
      .prepare(`UPDATE jobs SET review_reasons_json = ?, updated_at = ? WHERE id = ?`)
      .bind(JSON.stringify(reasons), nowIso(), id)
      .run()
    await sendNeedsCorrectionEmail(context.env, row.contact_email, row.title, reasons)
  } else {
    return error('Acción no válida')
  }

  const updated = await getJobById(db, id)
  return json({ job: updated ? rowToJob(updated) : null })
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  const db = requireDb(context.env)
  const id = context.params.id as string
  await logDecision(db, id, `admin:${auth.subject}`, 'deleted', 'Eliminación solicitada')
  await db.prepare('DELETE FROM decision_log WHERE job_id = ?').bind(id).run()
  await db.prepare('DELETE FROM verification_tokens WHERE job_id = ?').bind(id).run()
  await db.prepare('DELETE FROM distribution_events WHERE job_id = ?').bind(id).run()
  await db.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
