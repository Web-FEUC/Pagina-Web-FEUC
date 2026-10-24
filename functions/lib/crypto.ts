export function nowIso() {
  return new Date().toISOString()
}

export function randomId() {
  return crypto.randomUUID()
}

export async function sha256(text: string) {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
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

export function normalizeOrgName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export async function hmacSign(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken(secret: string, subject: string, ttlSeconds = 60 * 60 * 12) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = `${subject}.${exp}`
  const sig = await hmacSign(secret, payload)
  return `${payload}.${sig}`
}

export async function verifySessionToken(secret: string, token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [subject, expRaw, sig] = parts
  const exp = Number(expRaw)
  if (!subject || !Number.isFinite(exp) || exp * 1000 < Date.now()) return null
  const expected = await hmacSign(secret, `${subject}.${expRaw}`)
  if (expected !== sig) return null
  return subject
}
