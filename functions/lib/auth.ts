import type { Env } from '../types'
import { createSessionToken, verifySessionToken } from './crypto'
import { error } from './http'

export function adminPassword(env: Env) {
  return env.EMPLEOS_ADMIN_PASSWORD || ''
}

export function sessionSecret(env: Env) {
  return env.EMPLEOS_SESSION_SECRET || env.EMPLEOS_ADMIN_PASSWORD || 'dev-only-change-me'
}

export async function loginAdmin(env: Env, password: string) {
  const expected = adminPassword(env)
  if (!expected) return { ok: false as const, error: 'EMPLEOS_ADMIN_PASSWORD no configurada en el servidor' }
  if (password !== expected) return { ok: false as const, error: 'Clave incorrecta' }
  const token = await createSessionToken(sessionSecret(env), 'feuc-admin')
  return { ok: true as const, token }
}

export async function requireAdmin(request: Request, env: Env) {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return { ok: false as const, response: error('No autorizado', 401) }
  const subject = await verifySessionToken(sessionSecret(env), token)
  if (!subject) return { ok: false as const, response: error('Sesión inválida o expirada', 401) }
  return { ok: true as const, subject }
}
