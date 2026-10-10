import { effectiveStatus, slugify, type JobDraft, type JobOpportunity, type JobStatus } from '../data/empleos'
import { DEMO_JOBS } from '../data/empleosSeed'

const STORAGE_KEY = 'feuc-empleos-v1'

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
    return parsed
  } catch {
    return DEMO_JOBS
  }
}

function writeJobs(jobs: JobOpportunity[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  return jobs
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

export function saveJob(draft: JobDraft, options?: { publish?: boolean }) {
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
    applicationUrl: draft.applicationUrl.trim(),
    deadline: draft.deadline,
    contactName: draft.contactName.trim(),
    contactEmail: draft.contactEmail.trim(),
    contactPhone: draft.contactPhone.trim(),
    status,
    isDemo: existing?.isDemo ?? false,
    publishedAt:
      status === 'published'
        ? existing?.publishedAt || timestamp
        : existing?.publishedAt ?? '',
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }

  const nextJobs = existing
    ? jobs.map((job) => (job.id === existing.id ? next : job))
    : [next, ...jobs]
  writeJobs(nextJobs)
  return next
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
