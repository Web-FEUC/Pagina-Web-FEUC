import type { Env, JobPayload } from '../../types'
import { sha256 } from '../../lib/crypto'
import {
  checkRateLimit,
  findDuplicate,
  findOrCreateOrganization,
  insertJob,
  listPublicJobs,
  logDecision,
  requireDb,
} from '../../lib/db'
import { sendReceivedEmail } from '../../lib/email'
import { error, getClientIp, json, readJson, siteUrl } from '../../lib/http'
import { createVerificationToken } from '../../lib/pipeline'
import { validateJobPayload } from '../../lib/validate'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = requireDb(context.env)
    const jobs = await listPublicJobs(db)
    return json({ jobs })
  } catch (err) {
    return error(err instanceof Error ? err.message : 'Error al listar empleos', 500)
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = requireDb(context.env)
    const ip = getClientIp(context.request)
    const ipHash = await sha256(ip)

    const ipLimit = await checkRateLimit(db, `submit:ip:${ipHash}`, 8, 60 * 60 * 1000)
    if (!ipLimit.allowed) return error('Demasiados envíos desde esta red. Intenta más tarde.', 429)

    const body = await readJson<Partial<JobPayload>>(context.request)
    if (!body) return error('JSON inválido')

    const validated = validateJobPayload(body)
    if (!validated.ok) return error('Validación fallida', 400, { details: validated.errors })

    const emailLimit = await checkRateLimit(
      db,
      `submit:email:${validated.payload.contactEmail}`,
      5,
      24 * 60 * 60 * 1000,
    )
    if (!emailLimit.allowed) return error('Demasiados envíos con este correo. Intenta mañana.', 429)

    const duplicate = await findDuplicate(db, validated.payload)
    if (duplicate) {
      return error('Ya existe una publicación muy similar. No se creó un duplicado.', 409, {
        existingId: duplicate.id,
        existingStatus: duplicate.status,
      })
    }

    const organization = await findOrCreateOrganization(
      db,
      validated.payload.company,
      validated.payload.companyWebsite || '',
      validated.payload.orgType || '',
    )

    if (organization.status === 'suspended') {
      return error('Esta organización está suspendida y no puede publicar por ahora.', 403)
    }

    const job = await insertJob(db, validated.payload, {
      organizationId: organization.id,
      status: 'pending_verification',
      ipHash,
    })

    await logDecision(db, job.id, 'system', 'submitted', 'Publicación recibida')

    const token = await createVerificationToken(db, job.id, job.contact_email)
    const base = siteUrl(context.env, context.request)
    const verifyUrl = `${base}/api/empleos/verify?token=${token}`

    await sendReceivedEmail(context.env, job.contact_email, job.title, verifyUrl)

    return json(
      {
        ok: true,
        id: job.id,
        slug: job.slug,
        status: job.status,
        message:
          'Recibimos tu oportunidad. Revisa tu correo para verificar el contacto antes de continuar el proceso.',
      },
      201,
    )
  } catch (err) {
    return error(err instanceof Error ? err.message : 'Error al publicar', 500)
  }
}
