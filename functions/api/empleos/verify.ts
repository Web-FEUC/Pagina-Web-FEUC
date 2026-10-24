import type { Env, JobPayload } from '../../types'
import { nowIso } from '../../lib/crypto'
import { getJobById, requireDb } from '../../lib/db'
import { error, json } from '../../lib/http'
import { runPostVerificationPipeline } from '../../lib/pipeline'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = requireDb(context.env)
    const url = new URL(context.request.url)
    const token = url.searchParams.get('token') || ''
    if (!token) return error('Token faltante', 400)

    const row = await db
      .prepare('SELECT * FROM verification_tokens WHERE token = ?')
      .bind(token)
      .first<{
        token: string
        job_id: string
        email: string
        expires_at: string
        used_at: string
      }>()

    if (!row) return htmlPage('Enlace inválido', 'Este enlace de verificación no existe.', 404)
    if (row.used_at) {
      return htmlPage('Ya verificado', 'Este correo ya fue confirmado. FEUC continúa con la revisión.', 200)
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return htmlPage('Enlace expirado', 'El enlace venció. Solicita una nueva publicación o escribe a FEUC.', 410)
    }

    const job = await getJobById(db, row.job_id)
    if (!job) return htmlPage('No encontrada', 'La oportunidad ya no existe.', 404)

    await db
      .prepare(`UPDATE verification_tokens SET used_at = ? WHERE token = ?`)
      .bind(nowIso(), token)
      .run()

    const payload: JobPayload = {
      title: job.title,
      company: job.company,
      companyLogo: job.company_logo,
      companyWebsite: job.company_website,
      orgType: job.org_type,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      type: job.type,
      areas: JSON.parse(job.areas_json || '[]'),
      careers: JSON.parse(job.careers_json || '[]'),
      openToAllCareers: Boolean(job.open_to_all_careers),
      experienceLevel: job.experience_level,
      modality: job.modality,
      location: job.location,
      schedule: job.schedule,
      compensation: job.compensation,
      applicationUrl: job.application_url,
      deadline: job.deadline,
      contactName: job.contact_name,
      contactEmail: job.contact_email,
      contactPhone: job.contact_phone,
    }

    const org = job.organization_id
      ? await db
          .prepare('SELECT id, status, auto_publish FROM organizations WHERE id = ?')
          .bind(job.organization_id)
          .first<{ id: string; status: 'pending' | 'verified' | 'suspended'; auto_publish: number }>()
      : null

    const result = await runPostVerificationPipeline(context.env, context.request, job, payload, org)

    const status = result.decision.status
    if (status === 'published') {
      return htmlPage(
        'Correo verificado y publicado',
        `Tu oportunidad ya está publicada. <a href="/empleos/${job.slug}">Ver publicación</a>`,
        200,
      )
    }
    if (status === 'needs_correction') {
      return htmlPage(
        'Correo verificado',
        'Necesitamos que corrijas algunos datos. Te enviamos un correo con el detalle.',
        200,
      )
    }
    if (status === 'rejected') {
      return htmlPage(
        'Correo verificado',
        'Revisamos la publicación y no pudo aprobarse. Te enviamos un correo con más información.',
        200,
      )
    }
    return htmlPage(
      'Correo verificado',
      'Gracias. Tu oportunidad quedó en revisión por el equipo FEUC.',
      200,
    )
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Error' }, 500)
  }
}

function htmlPage(title: string, body: string, status: number) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title} | Empleos FEUC</title>
    <style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;color:#123;line-height:1.5}a{color:#0a6}</style>
    </head><body><h1>${title}</h1><p>${body}</p><p><a href="/empleos">Volver a Empleos FEUC</a></p></body></html>`,
    {
      status,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    },
  )
}
