import type { Env } from '../../../types'
import { loginAdmin } from '../../../lib/auth'
import { error, json, readJson } from '../../../lib/http'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await readJson<{ password?: string }>(context.request)
  if (!body?.password) return error('Clave requerida')
  const result = await loginAdmin(context.env, body.password)
  if (!result.ok) return error(result.error, 401)
  return json({ token: result.token })
}
