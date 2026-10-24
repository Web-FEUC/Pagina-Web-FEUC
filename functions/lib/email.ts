import type { Env } from '../types'

async function sendEmail(env: Env, to: string, subject: string, html: string) {
  if (!env.RESEND_API_KEY) {
    console.log('[email:skipped]', { to, subject })
    return { ok: false as const, skipped: true, error: 'RESEND_API_KEY no configurada' }
  }
  const from = env.EMAIL_FROM || 'Empleos FEUC <onboarding@resend.dev>'
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  })
  if (!response.ok) {
    const body = await response.text()
    return { ok: false as const, skipped: false, error: body.slice(0, 300) }
  }
  return { ok: true as const, skipped: false }
}

export async function sendReceivedEmail(env: Env, to: string, title: string, verifyUrl: string) {
  return sendEmail(
    env,
    to,
    'Recibimos tu oportunidad en Empleos FEUC',
    `<p>Recibimos tu oportunidad laboral <strong>${escapeHtml(title)}</strong> en Empleos FEUC.</p>
     <p>Estamos verificando la información entregada.</p>
     <p>Confirma tu correo para continuar el proceso:</p>
     <p><a href="${verifyUrl}">Verificar correo</a></p>
     <p>Si no enviaste esta publicación, ignora este mensaje.</p>`,
  )
}

export async function sendPublishedEmail(env: Env, to: string, title: string, publicUrl: string) {
  return sendEmail(
    env,
    to,
    'Tu oportunidad ya está publicada en Empleos FEUC',
    `<p>Tu oportunidad <strong>${escapeHtml(title)}</strong> ya está publicada en Empleos FEUC.</p>
     <p><a href="${publicUrl}">Ver publicación</a></p>`,
  )
}

export async function sendNeedsCorrectionEmail(env: Env, to: string, title: string, reasons: string[]) {
  const list = reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('')
  return sendEmail(
    env,
    to,
    'Necesitamos que revises tu oportunidad en Empleos FEUC',
    `<p>Necesitamos que revises algunos datos antes de publicar <strong>${escapeHtml(title)}</strong>.</p>
     <ul>${list}</ul>
     <p>Puedes escribir a FEUC si tienes dudas.</p>`,
  )
}

export async function sendRejectedEmail(env: Env, to: string, title: string, reasons: string[]) {
  const list = reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('')
  return sendEmail(
    env,
    to,
    'No pudimos publicar tu oportunidad en Empleos FEUC',
    `<p>Tras revisar <strong>${escapeHtml(title)}</strong>, no pudimos publicarla.</p>
     <ul>${list}</ul>
     <p>Si crees que hubo un error, contacta a FEUC.</p>`,
  )
}

export async function sendAdminReviewEmail(env: Env, title: string, company: string, adminUrl: string) {
  const to = env.ADMIN_NOTIFY_EMAIL
  if (!to) return { ok: false as const, skipped: true, error: 'ADMIN_NOTIFY_EMAIL no configurada' }
  return sendEmail(
    env,
    to,
    `Revisión pendiente: ${title}`,
    `<p>Hay una nueva publicación que requiere revisión manual.</p>
     <p><strong>${escapeHtml(title)}</strong> — ${escapeHtml(company)}</p>
     <p><a href="${adminUrl}">Abrir panel</a></p>`,
  )
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
