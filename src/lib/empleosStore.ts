import { effectiveStatus, slugify, type JobDraft, type JobOpportunity, type JobStatus } from '../data/empleos'
import { DEMO_JOBS } from '../data/empleosSeed'
import { fetchPublicJob, fetchPublicJobs, isApiUnavailableError, submitJob } from './empleosApi'

const STORAGE_KEY = 'feuc-empleos-v1'
const USE_LOCAL_FALLBACK = import.meta.env.VITE_EMPLEOS_LOCAL_FALLBACK === 'true' || import.meta.env.DEV

function nowIso() {
  return new Date().toISOString()
}

function uniqueSlug(base: string, jobs: JobOpportunity[], ignoreId?: string) {
  const root = slugify(base) || 'oportunidad'
  let slug = root
  let index = 2
  const taken = (value: string) => jobs.some((job) => job.slug === value && job.id !== ignoreId)
  while (taken(slug)) {
    slug = `${root}-${index}`
    index += 1
  }
  return slug
}

function readJobs(): JobOpportunity[] {
  if (typeof window === 'undefined') return DEMO_JOBS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_JOBS))
      return DEMO_JOBS
    }
    const parsed = JSON.parse(raw) as JobOpportunity[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_JOBS))
      return DEMO_JOBS
    }
    return parsed.map((job) => ({
      ...job,
      orgType: job.orgType || 'empresa',
      compensation: job.compensation || '',
    }))
  } catch {
    return DEMO_JOBS
  }
}

function writeJobs(jobs: JobOpportunity[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  return jobs
}

/** Public jobs: API first; local demos only as DEV fallback. */
export async function loadPublicJobs(): Promise<{ jobs: JobOpportunity[]; source: 'api' | 'local' }> {
  try {
    const jobs = await fetchPublicJobs()
    return { jobs, source: 'api' }
  } catch (err) {
    if (USE_LOCAL_FALLBACK && isApiUnavailableError(err)) {
      return {
        jobs: readJobs().filter((job) => effectiveStatus(job) === 'published'),
        source: 'local',
      }
    }
    throw err
  }
}

export async function loadPublicJob(slug: string): Promise<JobOpportunity | null> {
  try {
    return await fetchPublicJob(slug)
  } catch (err) {
    if (USE_LOCAL_FALLBACK) {
      const job = readJobs().find((item) => item.slug === slug)
      if (job && effectiveStatus(job) === 'published') return job
      if (isApiUnavailableError(err)) return null
    }
    return null
  }
}

export async function submitOpportunity(draft: JobDraft) {
  try {
    return await submitJob(draft)
  } catch (err) {
    if (USE_LOCAL_FALLBACK && isApiUnavailableError(err)) {
      const saved = saveJobLocal({ ...draft, status: 'pending_verification' })
      return {
        ok: true,
        id: saved.id,
        slug: saved.slug,
        status: saved.status,
        message:
          'Modo local: la API no está disponible. La oferta quedó guardada solo en este navegador (sin verificación ni IA).',
        local: true as const,
      }
    }
    throw err
  }
}

export function getJobs() {
  return readJobs()
}

export function getJobBySlug(slug: string) {
  return readJobs().find((job) => job.slug === slug)
}

export function getPublicJobs() {
  return readJobs().filter((job) => effectiveStatus(job) === 'published')
}

export function saveJobLocal(draft: JobDraft, options?: { publish?: boolean }) {
  const jobs = readJobs()
  const timestamp = nowIso()
  const existing = draft.id ? jobs.find((job) => job.id === draft.id) : undefined
  const status: JobStatus = options?.publish ? 'published' : draft.status
  const next: JobOpportunity = {
    id: existing?.id ?? crypto.randomUUID(),
    slug: uniqueSlug(`${draft.company} ${draft.title}`, jobs, existing?.id),
    title: draft.title.trim(),
    company: draft.company.trim(),
    companyLogo: draft.companyLogo.trim(),
    companyWebsite: draft.companyWebsite.trim(),
    orgType: (draft.orgType || 'empresa').trim(),
    description: draft.description.trim(),
    responsibilities: draft.responsibilities.trim(),
    requirements: draft.requirements.trim(),
    type: draft.type,
    areas: draft.areas,
    careers: draft.openToAllCareers ? [] : draft.careers,
    openToAllCareers: draft.openToAllCareers,
    experienceLevel: draft.experienceLevel,
    modality: draft.modality,
    location: draft.location.trim(),
    schedule: draft.schedule,
    compensation: (draft.compensation || '').trim(),
    applicationUrl: draft.applicationUrl.trim(),
    deadline: draft.deadline,
    contactName: draft.contactName.trim(),
    contactEmail: draft.contactEmail.trim(),
    contactPhone: draft.contactPhone.trim(),
    status,
    isDemo: existing?.isDemo ?? false,
    publishedAt: status === 'published' ? existing?.publishedAt || timestamp : existing?.publishedAt ?? '',
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }

  const nextJobs = existing ? jobs.map((job) => (job.id === existing.id ? next : job)) : [next, ...jobs]
  writeJobs(nextJobs)
  return next
}

/** @deprecated prefer saveJobLocal or API admin actions */
export function saveJob(draft: JobDraft, options?: { publish?: boolean }) {
  return saveJobLocal(draft, options)
}

export function setJobStatus(id: string, status: JobStatus) {
  const jobs = readJobs()
  const timestamp = nowIso()
  writeJobs(
    jobs.map((job) =>
      job.id === id
        ? {
            ...job,
            status,
            updatedAt: timestamp,
            publishedAt: status === 'published' ? job.publishedAt || timestamp : job.publishedAt,
          }
        : job,
    ),
  )
}

export function deleteJob(id: string) {
  writeJobs(readJobs().filter((job) => job.id !== id))
}

export function restoreDemoJobs() {
  writeJobs(DEMO_JOBS)
  return DEMO_JOBS
}
