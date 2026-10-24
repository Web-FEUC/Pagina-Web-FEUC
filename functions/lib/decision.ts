import type { AiEvaluation, JobStatus, OrganizationRow } from '../types'

export interface DecisionInput {
  contactVerified: boolean
  organization: OrganizationRow | null
  autoPublishEnabled: boolean
  ai: AiEvaluation | null
  aiFailed: boolean
  hardBlockReasons: string[]
  softCorrectionReasons: string[]
}

export interface DecisionResult {
  status: JobStatus
  approvalMethod: '' | 'ai' | 'admin'
  reasons: string[]
}

export function decidePublication(input: DecisionInput): DecisionResult {
  const reasons: string[] = [...input.hardBlockReasons]

  if (input.hardBlockReasons.length > 0) {
    return { status: 'rejected', approvalMethod: '', reasons }
  }

  if (!input.contactVerified) {
    return {
      status: 'pending_verification',
      approvalMethod: '',
      reasons: ['Correo de contacto pendiente de verificación.'],
    }
  }

  if (input.softCorrectionReasons.length > 0) {
    return {
      status: 'needs_correction',
      approvalMethod: '',
      reasons: input.softCorrectionReasons,
    }
  }

  if (input.aiFailed || !input.ai) {
    return {
      status: 'under_review',
      approvalMethod: '',
      reasons: ['La evaluación automática no está disponible; requiere revisión FEUC.'],
    }
  }

  const ai = input.ai
  reasons.push(...ai.reviewReasons)
  reasons.push(...ai.riskSignals.map((s) => `Señal de riesgo: ${s}`))

  if (!ai.isJobOpportunity || ai.recommendation === 'reject') {
    return {
      status: 'rejected',
      approvalMethod: '',
      reasons: reasons.length ? reasons : ['La publicación no parece una oportunidad laboral válida.'],
    }
  }

  if (!ai.hasSufficientContent) {
    return {
      status: 'needs_correction',
      approvalMethod: '',
      reasons: reasons.length ? reasons : ['La descripción es insuficiente.'],
    }
  }

  if (ai.recommendation === 'review' || ai.confidence < 0.7 || ai.riskSignals.length > 0) {
    return {
      status: 'under_review',
      approvalMethod: '',
      reasons: reasons.length ? reasons : ['La IA recomienda revisión manual.'],
    }
  }

  const orgVerified = input.organization?.status === 'verified'
  const orgAuto = Boolean(input.organization?.auto_publish)
  const canAuto =
    input.autoPublishEnabled &&
    orgVerified &&
    orgAuto &&
    ai.recommendation === 'auto_approve' &&
    ai.isJobOpportunity &&
    ai.hasSufficientContent &&
    ai.relevantForStudents &&
    ai.riskSignals.length === 0 &&
    ai.confidence >= 0.8

  if (canAuto) {
    return {
      status: 'published',
      approvalMethod: 'ai',
      reasons: ['Publicación automática: organización verificada, correo verificado y evaluación limpia.'],
    }
  }

  if (!orgVerified) reasons.push('Organización sin verificación previa.')
  if (!input.autoPublishEnabled) reasons.push('La publicación automática está desactivada.')
  if (orgVerified && !orgAuto) reasons.push('La organización no tiene publicación automática habilitada.')

  return {
    status: 'under_review',
    approvalMethod: '',
    reasons: reasons.length ? reasons : ['Requiere revisión FEUC.'],
  }
}
