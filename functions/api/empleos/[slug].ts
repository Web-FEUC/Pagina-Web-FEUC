import type { Env } from '../../types'
import { getJobBySlug, requireDb, rowToJob } from '../../lib/db'
import { error, json } from '../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = requireDb(context.env)
    const slug = context.params.slug as string
    const row = await getJobBySlug(db, slug)
    if (!row || row.is_demo) return error('Oportunidad no encontrada', 404)
    const job = rowToJob(row)
    if (job.status !== 'published') return error('Oportunidad no publicada', 404)
    return json({ job })
  } catch (err) {
    return error(err instanceof Error ? err.message : 'Error', 500)
  }
}
