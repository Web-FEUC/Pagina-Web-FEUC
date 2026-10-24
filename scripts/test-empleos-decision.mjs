/**
 * Pruebas unitarias del motor de decisión (sin red ni D1).
 * Ejecutar: npm run test:empleos
 */

function decidePublication(input) {
  const reasons = [...input.hardBlockReasons]
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
    return { status: 'needs_correction', approvalMethod: '', reasons: input.softCorrectionReasons }
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
    return { status: 'rejected', approvalMethod: '', reasons }
  }
  if (!ai.hasSufficientContent) {
    return { status: 'needs_correction', approvalMethod: '', reasons }
  }
  if (ai.recommendation === 'review' || ai.confidence < 0.7 || ai.riskSignals.length > 0) {
    return { status: 'under_review', approvalMethod: '', reasons }
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
    return { status: 'published', approvalMethod: 'ai', reasons: ['auto'] }
  }
  return { status: 'under_review', approvalMethod: '', reasons }
}

const cleanAi = {
  isJobOpportunity: true,
  hasSufficientContent: true,
  relevantForStudents: true,
  riskSignals: [],
  reviewReasons: [],
  recommendation: 'auto_approve',
  confidence: 0.92,
}

const cases = [
  {
    name: 'empresa verificada + auto → published',
    input: {
      contactVerified: true,
      organization: { status: 'verified', auto_publish: 1 },
      autoPublishEnabled: true,
      ai: cleanAi,
      aiFailed: false,
      hardBlockReasons: [],
      softCorrectionReasons: [],
    },
    expect: 'published',
  },
  {
    name: 'org nueva → under_review',
    input: {
      contactVerified: true,
      organization: { status: 'pending', auto_publish: 0 },
      autoPublishEnabled: true,
      ai: cleanAi,
      aiFailed: false,
      hardBlockReasons: [],
      softCorrectionReasons: [],
    },
    expect: 'under_review',
  },
  {
    name: 'broma/reject IA → rejected',
    input: {
      contactVerified: true,
      organization: { status: 'verified', auto_publish: 1 },
      autoPublishEnabled: true,
      ai: { ...cleanAi, isJobOpportunity: false, recommendation: 'reject' },
      aiFailed: false,
      hardBlockReasons: [],
      softCorrectionReasons: [],
    },
    expect: 'rejected',
  },
  {
    name: 'sospechosa → under_review',
    input: {
      contactVerified: true,
      organization: { status: 'verified', auto_publish: 1 },
      autoPublishEnabled: true,
      ai: { ...cleanAi, riskSignals: ['pide pago'], recommendation: 'review', confidence: 0.5 },
      aiFailed: false,
      hardBlockReasons: [],
      softCorrectionReasons: [],
    },
    expect: 'under_review',
  },
  {
    name: 'sin verificar correo → pending_verification',
    input: {
      contactVerified: false,
      organization: { status: 'verified', auto_publish: 1 },
      autoPublishEnabled: true,
      ai: cleanAi,
      aiFailed: false,
      hardBlockReasons: [],
      softCorrectionReasons: [],
    },
    expect: 'pending_verification',
  },
  {
    name: 'IA caída → under_review',
    input: {
      contactVerified: true,
      organization: { status: 'verified', auto_publish: 1 },
      autoPublishEnabled: true,
      ai: null,
      aiFailed: true,
      hardBlockReasons: [],
      softCorrectionReasons: [],
    },
    expect: 'under_review',
  },
  {
    name: 'auto-publish desactivado → under_review',
    input: {
      contactVerified: true,
      organization: { status: 'verified', auto_publish: 1 },
      autoPublishEnabled: false,
      ai: cleanAi,
      aiFailed: false,
      hardBlockReasons: [],
      softCorrectionReasons: [],
    },
    expect: 'under_review',
  },
]

let failed = 0
for (const test of cases) {
  const result = decidePublication(test.input)
  const ok = result.status === test.expect
  console.log(`${ok ? 'OK' : 'FAIL'} ${test.name} → ${result.status}`)
  if (!ok) failed += 1
}
if (failed) {
  console.error(`\n${failed} prueba(s) fallaron`)
  process.exit(1)
}
console.log(`\n${cases.length} pruebas OK`)
