import type { Env, OrgStatus } from '../../../types'
import { requireAdmin } from '../../../lib/auth'
import { listOrganizations, requireDb, updateOrganization } from '../../../lib/db'
import { error, json, readJson } from '../../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  const orgs = await listOrganizations(requireDb(context.env))
  return json({
    organizations: orgs.map((o) => ({
      id: o.id,
      name: o.name,
      website: o.website,
      orgType: o.org_type,
      status: o.status,
      autoPublish: Boolean(o.auto_publish),
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    })),
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env)
  if (!auth.ok) return auth.response
  const body = await readJson<{ id?: string; status?: OrgStatus; autoPublish?: boolean }>(context.request)
  if (!body?.id) return error('id requerido')
  const org = await updateOrganization(requireDb(context.env), body.id, {
    status: body.status,
    autoPublish: body.autoPublish,
  })
  if (!org) return error('Organización no encontrada', 404)
  return json({
    organization: {
      id: org.id,
      name: org.name,
      website: org.website,
      orgType: org.org_type,
      status: org.status,
      autoPublish: Boolean(org.auto_publish),
      createdAt: org.created_at,
      updatedAt: org.updated_at,
    },
  })
}
