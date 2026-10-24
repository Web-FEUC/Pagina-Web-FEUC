import type { JobDraft, JobOpportunity, JobStatus } from '../data/empleos'

const API_BASE = (import.meta.env.VITE_EMPLEOS_API_BASE as string | undefined) || ''

export type AdminStats = {
  published: number
  pending: number
  autoApproved: number
  rejected: number
  verifiedOrgs: number
  aiEvaluations: number
  autoPublishEnabled: boolean
}

export type Organization = {
  id: string
  name: string
  website: string
  orgType: string
  status: 'pending' | 'verified' | 'suspended'
  autoPublish: boolean
  createdAt: string
  updatedAt: string
}

export type AiResult = {
  isJobOpportunity: boolean
  hasSufficientContent: boolean
  relevantForStudents: boolean
  riskSignals: string[]
  reviewReasons: string[]
  suggestedAreas: string[]
  suggestedCareers: string[]
  suggestedType: string | null
  suggestedExperience: string | null
  recommendation: 'auto_approve' | 'review' | 'reject'
  confidence: number
  summary: string
}

export type ApiJob = JobOpportunity & {
  organizationId?: string | null
  orgType?: string
  compensation?: string
  contactVerified?: boolean
  statusRaw?: JobStatus | string
  approvalMethod?: string
  aiResult?: AiResult | null
  reviewReasons?: string[]
}

function authHeaders(token?: string): HeadersInit {
  return token ? { authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: string }).error)
        : `Error HTTP ${response.status}`
    const details =
      typeof data === 'object' && data && 'details' in data
        ? (data as { details?: string[] }).details
        : undefined
    throw new Error(details?.length ? `${message}: ${details.join(' ')}` : message)
  }
  return data as T
}

export function mapApiJob(job: ApiJob): JobOpportunity & ApiJob {
  return {
    ...job,
    companyLogo: job.companyLogo || '',
    companyWebsite: job.companyWebsite || '',
    responsibilities: job.responsibilities || '',
    requirements: job.requirements || '',
    contactPhone: job.contactPhone || '',
    compensation: job.compensation || '',
    orgType: job.orgType || '',
    isDemo: Boolean(job.isDemo),
    publishedAt: job.publishedAt || '',
    reviewReasons: job.reviewReasons || [],
  }
}

export async function fetchPublicJobs() {
  const data = await request<{ jobs: ApiJob[] }>('/api/empleos')
  return data.jobs.map(mapApiJob)
}

export async function fetchPublicJob(slug: string) {
  const data = await request<{ job: ApiJob }>(`/api/empleos/${encodeURIComponent(slug)}`)
  return mapApiJob(data.job)
}

export async function submitJob(draft: JobDraft) {
  return request<{ ok: boolean; id: string; slug: string; status: string; message: string }>(
    '/api/empleos',
    {
      method: 'POST',
      body: JSON.stringify({
        title: draft.title,
        company: draft.company,
        companyLogo: draft.companyLogo,
        companyWebsite: draft.companyWebsite,
        orgType: draft.orgType,
        description: draft.description,
        responsibilities: draft.responsibilities,
        requirements: draft.requirements,
        type: draft.type,
        areas: draft.areas,
        careers: draft.careers,
        openToAllCareers: draft.openToAllCareers,
        experienceLevel: draft.experienceLevel,
        modality: draft.modality,
        location: draft.location,
        schedule: draft.schedule,
        compensation: draft.compensation,
        applicationUrl: draft.applicationUrl,
        deadline: draft.deadline,
        contactName: draft.contactName,
        contactEmail: draft.contactEmail,
        contactPhone: draft.contactPhone,
      }),
    },
  )
}

export async function adminLogin(password: string) {
  return request<{ token: string }>('/api/empleos/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export async function adminList(token: string, status = 'all') {
  return request<{ jobs: ApiJob[]; stats: AdminStats }>(
    `/api/empleos/admin?status=${encodeURIComponent(status)}`,
    { headers: authHeaders(token) },
  )
}

export async function adminJobAction(
  token: string,
  id: string,
  action: 'approve' | 'reject' | 'unpublish' | 'request_corrections' | 'update',
  extras: { notes?: string; reasons?: string[]; job?: Partial<JobDraft> } = {},
) {
  return request<{ job: ApiJob }>(`/api/empleos/admin/jobs/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ action, ...extras }),
  })
}

export async function adminDeleteJob(token: string, id: string) {
  return request<{ ok: boolean }>(`/api/empleos/admin/jobs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export async function adminOrganizations(token: string) {
  return request<{ organizations: Organization[] }>('/api/empleos/admin/organizations', {
    headers: authHeaders(token),
  })
}

export async function adminUpdateOrganization(
  token: string,
  id: string,
  patch: { status?: Organization['status']; autoPublish?: boolean },
) {
  return request<{ organization: Organization }>('/api/empleos/admin/organizations', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ id, ...patch }),
  })
}

export async function adminSettings(token: string) {
  return request<{
    autoPublishEnabled: boolean
    aiEvaluationsCount: number
    adminNotifyEmail: string
  }>('/api/empleos/admin/settings', { headers: authHeaders(token) })
}

export async function adminUpdateSettings(
  token: string,
  patch: { autoPublishEnabled?: boolean; adminNotifyEmail?: string },
) {
  return request<{
    autoPublishEnabled: boolean
    aiEvaluationsCount: number
    adminNotifyEmail: string
  }>('/api/empleos/admin/settings', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(patch),
  })
}

export function isApiUnavailableError(err: unknown) {
  if (!(err instanceof Error)) return false
  return (
    err.message.includes('Failed to fetch') ||
    err.message.includes('NetworkError') ||
    err.message.includes('Load failed')
  )
}
