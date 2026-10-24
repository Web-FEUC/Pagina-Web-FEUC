import type { Env } from '../../../types'
import { requireAdmin } from '../../../lib/auth'
import { getSetting, requireDb, setSetting } from '../../../lib/db'
import { error, json, readJson } from '../../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  const db = requireDb(context.env)
  return json({
    autoPublishEnabled: (await getSetting(db, 'auto_publish_enabled', '0')) === '1',
    aiEvaluationsCount: Number(await getSetting(db, 'ai_evaluations_count', '0')) || 0,
    adminNotifyEmail: await getSetting(db, 'admin_notify_email', context.env.ADMIN_NOTIFY_EMAIL || ''),
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  const body = await readJson<{ autoPublishEnabled?: boolean; adminNotifyEmail?: string }>(context.request)
  if (!body) return error('JSON inválido')
  const db = requireDb(context.env)
  if (typeof body.autoPublishEnabled === 'boolean') {
    await setSetting(db, 'auto_publish_enabled', body.autoPublishEnabled ? '1' : '0')
  }
  if (typeof body.adminNotifyEmail === 'string') {
    await setSetting(db, 'admin_notify_email', body.adminNotifyEmail.trim())
  }
  return json({
    autoPublishEnabled: (await getSetting(db, 'auto_publish_enabled', '0')) === '1',
    aiEvaluationsCount: Number(await getSetting(db, 'ai_evaluations_count', '0')) || 0,
    adminNotifyEmail: await getSetting(db, 'admin_notify_email', ''),
  })
}
