import type { Env } from '../../../types'
import { requireAdmin } from '../../../lib/auth'
import { getStats, listJobs, requireDb } from '../../../lib/db'
import { error, json } from '../../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  try {
    const db = requireDb(context.env)
    const url = new URL(context.request.url)
    const status = url.searchParams.get('status') || 'all'
    const jobs = await listJobs(db, status)
    const stats = await getStats(db)
    return json({ jobs, stats })
  } catch (err) {
    return error(err instanceof Error ? err.message : 'Error admin', 500)
  }
}
