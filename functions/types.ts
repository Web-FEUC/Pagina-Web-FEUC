export type Env = {
  DB: D1Database
  GEMINI_API_KEY?: string
  RESEND_API_KEY?: string
  EMAIL_FROM?: string
  EMPLEOS_ADMIN_PASSWORD?: string
  EMPLEOS_SESSION_SECRET?: string
  PUBLIC_SITE_URL?: string
  ADMIN_NOTIFY_EMAIL?: string
}

export type JobStatus =
  | 'draft'
  | 'pending_verification'
  | 'under_review'
  | 'published'
  | 'rejected'
  | 'expired'
  | 'unpublished'
  | 'needs_correction'

export type OrgStatus = 'pending' | 'verified' | 'suspended'

export type AiRecommendation = 'auto_approve' | 'review' | 'reject'

export interface AiEvaluation {
  isJobOpportunity: boolean
  hasSufficientContent: boolean
  relevantForStudents: boolean
  riskSignals: string[]
  reviewReasons: string[]
  suggestedAreas: string[]
  suggestedCareers: string[]
  suggestedType: string | null
  suggestedExperience: string | null
  recommendation: AiRecommendation
  confidence: number
  summary: string
}

export interface JobRow {
  id: string
  slug: string
  organization_id: string | null
  title: string
  company: string
  company_logo: string
  company_website: string
  org_type: string
  description: string
  responsibilities: string
  requirements: string
  type: string
  areas_json: string
  careers_json: string
  open_to_all_careers: number
  experience_level: string
  modality: string
  location: string
  schedule: string
  compensation: string
  application_url: string
  deadline: string
  contact_name: string
  contact_email: string
  contact_phone: string
  contact_verified: number
  status: JobStatus
  approval_method: string
  ai_result_json: string
  review_reasons_json: string
  content_hash: string
  submitter_ip_hash: string
  is_demo: number
  published_at: string
  created_at: string
  updated_at: string
}

export interface OrganizationRow {
  id: string
  name: string
  website: string
  org_type: string
  normalized_name: string
  status: OrgStatus
  auto_publish: number
  created_at: string
  updated_at: string
}

export interface JobPayload {
  title: string
  company: string
  companyLogo?: string
  companyWebsite?: string
  orgType?: string
  description: string
  responsibilities?: string
  requirements?: string
  type: string
  areas: string[]
  careers: string[]
  openToAllCareers: boolean
  experienceLevel: string
  modality: string
  location: string
  schedule: string
  compensation?: string
  applicationUrl: string
  deadline?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
}
