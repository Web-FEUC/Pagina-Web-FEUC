/** Enlaces de los canales de difusión de Empleos FEUC. */
export const EMPLEOS_TELEGRAM_URL =
  import.meta.env.VITE_EMPLEOS_TELEGRAM_URL || 'https://t.me/empleosfeuc'
export const EMPLEOS_WHATSAPP_URL =
  import.meta.env.VITE_EMPLEOS_WHATSAPP_URL || 'https://chat.whatsapp.com/KVnPXT9DuOjBxZPCXc98o7'

export const JOB_TYPES = [
  { value: 'practica', label: 'Práctica' },
  { value: 'primer-empleo', label: 'Primer empleo' },
  { value: 'part-time', label: 'Trabajo part-time' },
  { value: 'full-time', label: 'Trabajo full-time' },
  { value: 'freelance', label: 'Proyecto / freelance' },
  { value: 'investigacion', label: 'Investigación' },
  { value: 'voluntariado', label: 'Voluntariado profesional' },
  { value: 'graduados', label: 'Programa de graduados' },
] as const

export const JOB_AREAS = [
  { value: 'estrategia', label: 'Estrategia y Negocios' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'comunicaciones', label: 'Comunicaciones' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'datos', label: 'Datos' },
  { value: 'diseno', label: 'Diseño' },
  { value: 'educacion', label: 'Educación' },
  { value: 'psicologia', label: 'Psicología y Personas' },
  { value: 'derecho', label: 'Derecho' },
  { value: 'politicas', label: 'Políticas Públicas' },
  { value: 'sustentabilidad', label: 'Sustentabilidad' },
  { value: 'investigacion', label: 'Investigación' },
  { value: 'cultura', label: 'Cultura y Artes' },
  { value: 'salud', label: 'Salud' },
] as const

export const JOB_CAREERS = [
  { value: 'ingenieria', label: 'Ingeniería' },
  { value: 'comercial', label: 'Ingeniería Comercial' },
  { value: 'diseno', label: 'Diseño' },
  { value: 'arquitectura', label: 'Arquitectura' },
  { value: 'psicologia', label: 'Psicología' },
  { value: 'sociologia', label: 'Sociología' },
  { value: 'ciencia-politica', label: 'Ciencia Política' },
  { value: 'derecho', label: 'Derecho' },
  { value: 'periodismo', label: 'Periodismo' },
  { value: 'letras', label: 'Letras' },
  { value: 'artes', label: 'Artes' },
  { value: 'musica', label: 'Música' },
  { value: 'educacion', label: 'Educación' },
  { value: 'ciencias', label: 'Ciencias' },
  { value: 'salud', label: 'Salud' },
] as const

export const JOB_MODALITIES = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'hibrido', label: 'Híbrido' },
  { value: 'remoto', label: 'Remoto' },
] as const

export const JOB_EXPERIENCE = [
  { value: 'sin-experiencia', label: 'Sin experiencia' },
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'ultimos-semestres', label: 'Últimos semestres' },
  { value: 'recien-egresado', label: 'Recién egresado' },
  { value: '0-2', label: '0–2 años de experiencia' },
] as const

export const JOB_SCHEDULES = [
  { value: 'part-time', label: 'Part-time' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'por-horas', label: 'Por horas' },
] as const

export const JOB_STATUSES = [
  { value: 'draft', label: 'Borrador' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'published', label: 'Publicada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'expired', label: 'Vencida' },
] as const

export type JobType = (typeof JOB_TYPES)[number]['value']
export type JobArea = (typeof JOB_AREAS)[number]['value']
export type JobCareer = (typeof JOB_CAREERS)[number]['value']
export type JobModality = (typeof JOB_MODALITIES)[number]['value']
export type JobExperience = (typeof JOB_EXPERIENCE)[number]['value']
export type JobSchedule = (typeof JOB_SCHEDULES)[number]['value']
export type JobStatus = (typeof JOB_STATUSES)[number]['value']

export interface JobOpportunity {
  id: string
  slug: string
  title: string
  company: string
  companyLogo: string
  companyWebsite: string
  description: string
  responsibilities: string
  requirements: string
  type: JobType
  areas: JobArea[]
  careers: JobCareer[]
  openToAllCareers: boolean
  experienceLevel: JobExperience
  modality: JobModality
  location: string
  schedule: JobSchedule
  applicationUrl: string
  deadline: string
  contactName: string
  contactEmail: string
  contactPhone: string
  status: JobStatus
  isDemo: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export type JobDraft = Omit<JobOpportunity, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'isDemo'> & {
  id?: string
  slug?: string
  isDemo?: boolean
  publishedAt?: string
}

export function labelOf<T extends { value: string; label: string }>(list: readonly T[], value: string) {
  return list.find((item) => item.value === value)?.label ?? value
}

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72)
}

export function companyInitials(company: string) {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function formatDate(iso: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function isDeadlinePassed(deadline: string, now = new Date()) {
  if (!deadline) return false
  const end = new Date(`${deadline}T23:59:59`)
  return end.getTime() < now.getTime()
}

export function effectiveStatus(job: JobOpportunity, now = new Date()): JobStatus {
  if (job.status === 'published' && isDeadlinePassed(job.deadline, now)) return 'expired'
  return job.status
}

export function careerSummary(job: JobOpportunity) {
  if (job.openToAllCareers) return 'Abierto a todas las carreras'
  return job.careers.map((career) => labelOf(JOB_CAREERS, career)).join(' · ')
}

export function areaSummary(job: JobOpportunity) {
  return job.areas.map((area) => labelOf(JOB_AREAS, area)).join(' · ')
}

export function opportunityPath(slug: string) {
  return `/empleos/${slug}`
}

export function opportunityUrl(slug: string) {
  if (typeof window === 'undefined') return opportunityPath(slug)
  return `${window.location.origin}${opportunityPath(slug)}`
}

export function whatsappShareUrl(job: JobOpportunity) {
  const text = [
    '📢 Nueva oportunidad',
    '',
    `${job.title} — ${job.company}`,
    '',
    `${labelOf(JOB_TYPES, job.type)} · ${areaSummary(job)}`,
    '',
    `📍 ${job.location}`,
    `🏠 ${labelOf(JOB_MODALITIES, job.modality)}`,
    '',
    `🎓 ${careerSummary(job)}`,
    '',
    'Postula aquí:',
    opportunityUrl(job.slug),
  ].join('\n')
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export const emptyJobDraft: JobDraft = {
  title: '',
  company: '',
  companyLogo: '',
  companyWebsite: '',
  description: '',
  responsibilities: '',
  requirements: '',
  type: 'practica',
  areas: [],
  careers: [],
  openToAllCareers: false,
  experienceLevel: 'estudiante',
  modality: 'hibrido',
  location: '',
  schedule: 'part-time',
  applicationUrl: '',
  deadline: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  status: 'pending',
}
