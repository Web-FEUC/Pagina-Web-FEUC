import type { JobPayload } from '../types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
const JOB_TYPES = new Set([
  'practica',
  'primer-empleo',
  'part-time',
  'full-time',
  'freelance',
  'investigacion',
  'voluntariado',
  'graduados',
])
const AREAS = new Set([
  'estrategia',
  'finanzas',
  'marketing',
  'comunicaciones',
  'tecnologia',
  'datos',
  'diseno',
  'educacion',
  'psicologia',
  'derecho',
  'politicas',
  'sustentabilidad',
  'investigacion',
  'cultura',
  'salud',
])
const CAREERS = new Set([
  'ingenieria',
  'comercial',
  'diseno',
  'arquitectura',
  'psicologia',
  'sociologia',
  'ciencia-politica',
  'derecho',
  'periodismo',
  'letras',
  'artes',
  'musica',
  'educacion',
  'ciencias',
  'salud',
])

const SUSPICIOUS_HOST_FRAGMENTS = [
  'bit.ly',
  'tinyurl',
  't.me/',
  'discord.gg',
  'grabify',
  'iplogger',
]

function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    if (url.username || url.password) return false
    const host = url.hostname.toLowerCase()
    if (host === 'localhost' || host.endsWith('.local')) return false
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false
    if (host === '127.0.0.1' || host === '0.0.0.0' || host.startsWith('10.') || host.startsWith('192.168.')) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function validateJobPayload(raw: Partial<JobPayload>) {
  const errors: string[] = []
  const payload: JobPayload = {
    title: String(raw.title ?? '').trim(),
    company: String(raw.company ?? '').trim(),
    companyLogo: String(raw.companyLogo ?? '').trim(),
    companyWebsite: String(raw.companyWebsite ?? '').trim(),
    orgType: String(raw.orgType ?? '').trim(),
    description: String(raw.description ?? '').trim(),
    responsibilities: String(raw.responsibilities ?? '').trim(),
    requirements: String(raw.requirements ?? '').trim(),
    type: String(raw.type ?? '').trim(),
    areas: Array.isArray(raw.areas) ? raw.areas.map(String) : [],
    careers: Array.isArray(raw.careers) ? raw.careers.map(String) : [],
    openToAllCareers: Boolean(raw.openToAllCareers),
    experienceLevel: String(raw.experienceLevel ?? 'estudiante').trim(),
    modality: String(raw.modality ?? 'hibrido').trim(),
    location: String(raw.location ?? '').trim(),
    schedule: String(raw.schedule ?? 'part-time').trim(),
    compensation: String(raw.compensation ?? '').trim(),
    applicationUrl: String(raw.applicationUrl ?? '').trim(),
    deadline: String(raw.deadline ?? '').trim(),
    contactName: String(raw.contactName ?? '').trim(),
    contactEmail: String(raw.contactEmail ?? '').trim().toLowerCase(),
    contactPhone: String(raw.contactPhone ?? '').trim(),
  }

  if (payload.title.length < 3) errors.push('El cargo es obligatorio.')
  if (payload.company.length < 2) errors.push('El nombre de la organización es obligatorio.')
  if (payload.contactName.length < 2) errors.push('El nombre de contacto es obligatorio.')
  if (!EMAIL_RE.test(payload.contactEmail)) errors.push('El correo de contacto no es válido.')
  if (payload.description.length < 80) {
    errors.push('La descripción debe tener al menos 80 caracteres con información útil.')
  }
  if (!JOB_TYPES.has(payload.type)) errors.push('Tipo de oportunidad no válido.')
  if (payload.areas.length === 0) errors.push('Selecciona al menos un área laboral.')
  if (payload.areas.some((area) => !AREAS.has(area))) errors.push('Hay áreas laborales no válidas.')
  if (!payload.openToAllCareers) {
    if (payload.careers.length === 0) errors.push('Selecciona carreras o marca “todas las carreras”.')
    if (payload.careers.some((career) => !CAREERS.has(career))) errors.push('Hay carreras no válidas.')
  }
  if (!payload.location) errors.push('La ubicación es obligatoria.')
  if (!isSafeHttpUrl(payload.applicationUrl) && !EMAIL_RE.test(payload.applicationUrl)) {
    errors.push('El enlace o correo de postulación no es válido.')
  }
  if (payload.companyWebsite && !isSafeHttpUrl(payload.companyWebsite)) {
    errors.push('El sitio web de la organización no es válido.')
  }
  if (payload.companyLogo && !isSafeHttpUrl(payload.companyLogo)) {
    errors.push('La URL del logo no es válida.')
  }
  if (payload.deadline) {
    const end = new Date(`${payload.deadline}T23:59:59`)
    if (Number.isNaN(end.getTime())) errors.push('La fecha de cierre no es válida.')
    else if (end.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      errors.push('La fecha de cierre no puede estar en el pasado.')
    }
  }

  const blob = `${payload.description} ${payload.responsibilities} ${payload.requirements} ${payload.applicationUrl}`.toLowerCase()
  for (const fragment of SUSPICIOUS_HOST_FRAGMENTS) {
    if (blob.includes(fragment)) {
      errors.push(`Se detectó un enlace o dominio potencialmente sospechoso (${fragment}).`)
      break
    }
  }

  const paymentHints = ['paga para postular', 'costo de postulación', 'transferencia para aplicar', 'deposito para postular']
  if (paymentHints.some((hint) => blob.includes(hint))) {
    errors.push('La publicación menciona un pago para postular, lo que no está permitido.')
  }

  return { ok: errors.length === 0, errors, payload }
}

export function contentFingerprint(payload: JobPayload) {
  return [
    payload.company.toLowerCase(),
    payload.title.toLowerCase(),
    payload.description.slice(0, 280).toLowerCase(),
    payload.applicationUrl.toLowerCase(),
  ].join('|')
}
