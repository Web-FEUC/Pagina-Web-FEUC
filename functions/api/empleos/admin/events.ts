import type { Env } from '../../../types'
import { requireAdmin } from '../../../lib/auth'
import { requireDb } from '../../../lib/db'
import { error, json } from '../../../lib/http'

/** Stub for future WhatsApp/Telegram distribution. Events are enqueued on publish. */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  try {
    const db = requireDb(context.env)
    const { results } = await db
      .prepare(
        `SELECT * FROM distribution_events ORDER BY created_at DESC LIMIT 100`,
      )
      .all()
    return json({
      events: results || [],
      note: 'Los eventos job.published quedan listos para un worker de WhatsApp/Telegram futuro.',
    })
  } catch (err) {
    return error(err instanceof Error ? err.message : 'Error', 500)
  }
}
