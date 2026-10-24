import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import JobForm from '../components/empleos/JobForm'
import {
  JOB_STATUSES,
  effectiveStatus,
  isPendingReviewStatus,
  labelOf,
  type JobDraft,
  type JobOpportunity,
} from '../data/empleos'
import {
  adminDeleteJob,
  adminJobAction,
  adminList,
  adminLogin,
  adminOrganizations,
  adminSettings,
  adminUpdateOrganization,
  adminUpdateSettings,
  isApiUnavailableError,
  type AdminStats,
  type Organization,
} from '../lib/empleosApi'
import { deleteJob, getJobs, restoreDemoJobs, saveJobLocal, setJobStatus } from '../lib/empleosStore'
import { usePageMeta } from '../lib/usePageMeta'

const SESSION_KEY = 'feuc-empleos-admin-token'
const LEGACY_SESSION_KEY = 'feuc-empleos-admin'

type AdminTab = 'pending' | 'published' | 'draft' | 'rejected' | 'expired' | 'unpublished' | 'all' | 'orgs' | 'settings'

function loadToken() {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem(SESSION_KEY) || ''
}

export default function AdminEmpleos() {
  const [token, setToken] = useState(loadToken)
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'api' | 'local'>('api')
  const [tab, setTab] = useState<AdminTab>('pending')
  const [jobs, setJobs] = useState<JobOpportunity[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(false)
  const [aiCount, setAiCount] = useState(0)
  const [editing, setEditing] = useState<JobOpportunity | null>(null)
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState<JobOpportunity | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  usePageMeta('Administración Empleos FEUC', 'Panel interno para revisar y publicar oportunidades.')

  const refresh = useCallback(async () => {
    setError('')
    if (!token) return
    try {
      const data = await adminList(token, 'all')
      setJobs(data.jobs)
      setStats(data.stats)
      setAutoPublishEnabled(data.stats.autoPublishEnabled)
      setAiCount(data.stats.aiEvaluations)
      setMode('api')
      if (tab === 'orgs') {
        const orgData = await adminOrganizations(token)
        setOrgs(orgData.organizations)
      }
      if (tab === 'settings') {
        const settings = await adminSettings(token)
        setAutoPublishEnabled(settings.autoPublishEnabled)
        setAiCount(settings.aiEvaluationsCount)
      }
    } catch (err) {
      if (isApiUnavailableError(err)) {
        setMode('local')
        setJobs(getJobs())
        setStats(null)
        return
      }
      setError(err instanceof Error ? err.message : 'Error al cargar el panel')
      if (err instanceof Error && err.message.toLowerCase().includes('sesión')) {
        window.sessionStorage.removeItem(SESSION_KEY)
        setToken('')
      }
    }
  }, [token, tab])

  useEffect(() => {
    if (token) void refresh()
  }, [token, refresh])

  const visible = useMemo(() => {
    return jobs.filter((job) => {
      const status = effectiveStatus(job)
      if (tab === 'all' || tab === 'orgs' || tab === 'settings') return true
      if (tab === 'pending') return isPendingReviewStatus(job.status) || isPendingReviewStatus(status)
      return status === tab
    })
  }, [jobs, tab])

  if (!token) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Uso interno FEUC</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Administrar empleos</h1>
          <p className="mt-2 text-sm text-slate-600">
            Ingresa la clave del servidor (`EMPLEOS_ADMIN_PASSWORD`). Ya no se usa la clave embebida en el cliente.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault()
              setBusy(true)
              setError('')
              try {
                const result = await adminLogin(password)
                window.sessionStorage.setItem(SESSION_KEY, result.token)
                window.sessionStorage.removeItem(LEGACY_SESSION_KEY)
                setToken(result.token)
              } catch (err) {
                if (isApiUnavailableError(err) && import.meta.env.DEV) {
                  window.sessionStorage.setItem(SESSION_KEY, 'local-dev')
                  setToken('local-dev')
                  setMode('local')
                  setJobs(getJobs())
                } else {
                  setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
                }
              } finally {
                setBusy(false)
              }
            }}
          >
            <label className="block text-sm font-semibold text-ink">
              Clave
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && <p className="text-sm text-coral">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </section>
    )
  }

  const runAction = async (
    job: JobOpportunity,
    action: 'approve' | 'reject' | 'unpublish' | 'request_corrections',
  ) => {
    setBusy(true)
    setError('')
    try {
      if (mode === 'local' || token === 'local-dev') {
        if (action === 'approve') setJobStatus(job.id, 'published')
        if (action === 'reject') setJobStatus(job.id, 'rejected')
        if (action === 'unpublish') setJobStatus(job.id, 'unpublished')
        if (action === 'request_corrections') setJobStatus(job.id, 'needs_correction')
        setJobs(getJobs())
      } else {
        const notes =
          action === 'request_corrections'
            ? window.prompt('¿Qué correcciones necesitas?') || 'Se requieren correcciones'
            : action === 'reject'
              ? window.prompt('Motivo del rechazo (opcional)') || 'Rechazada por FEUC'
              : undefined
        await adminJobAction(token, job.id, action, {
          notes: notes || undefined,
          reasons: notes ? [notes] : undefined,
        })
        await refresh()
      }
      setSelected(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la acción')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel FEUC</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Oportunidades</h1>
          <p className="mt-2 text-sm text-slate-600">
            Revisa evaluaciones de IA, aprueba o rechaza, y gestiona organizaciones verificadas.
            {mode === 'local' ? ' (modo local sin API)' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setCreating(true)
              setEditing(null)
              setSelected(null)
            }}
            className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white"
          >
            Crear oportunidad
          </button>
          <button
            type="button"
            onClick={() => {
              window.sessionStorage.removeItem(SESSION_KEY)
              setToken('')
            }}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink"
          >
            Salir
          </button>
        </div>
      </div>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ['Publicadas', stats.published],
            ['Pendientes', stats.pending],
            ['Auto-aprobadas', stats.autoApproved],
            ['Rechazadas', stats.rejected],
            ['Orgs verificadas', stats.verifiedOrgs],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-4 shadow-card">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{value}</p>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 rounded-2xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            'pending',
            'published',
            'draft',
            'rejected',
            'expired',
            'unpublished',
            'all',
            'orgs',
            'settings',
          ] as AdminTab[]
        ).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              tab === item ? 'bg-secondary text-white' : 'bg-white text-slate-700'
            }`}
          >
            {item === 'all'
              ? 'Todas'
              : item === 'orgs'
                ? 'Organizaciones'
                : item === 'settings'
                  ? 'Automatización'
                  : labelOf(JOB_STATUSES, item)}
          </button>
        ))}
      </div>

      {tab === 'settings' && mode === 'api' && (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-ink">Configuración de automatización</h2>
          <p className="mt-2 text-sm text-slate-600">
            La publicación automática empieza desactivada. Actívala solo cuando hayas probado el flujo.
          </p>
          <p className="mt-3 text-sm text-slate-600">Evaluaciones de IA acumuladas: {aiCount}</p>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              className="h-4 w-4 accent-secondary"
              checked={autoPublishEnabled}
              onChange={async (event) => {
                const value = event.target.checked
                setAutoPublishEnabled(value)
                try {
                  await adminUpdateSettings(token, { autoPublishEnabled: value })
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'No se pudo guardar')
                  setAutoPublishEnabled(!value)
                }
              }}
            />
            Activar publicación automática (solo orgs verificadas con auto-publish)
          </label>
        </div>
      )}

      {tab === 'orgs' && mode === 'api' && (
        <div className="mt-8 space-y-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
            onClick={async () => {
              const data = await adminOrganizations(token)
              setOrgs(data.organizations)
            }}
          >
            Actualizar organizaciones
          </button>
          {orgs.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-card">
              Aún no hay organizaciones registradas.
            </p>
          )}
          {orgs.map((org) => (
            <article key={org.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{org.name}</h3>
                  <p className="text-sm text-slate-600">
                    {org.status} · auto-publish {org.autoPublish ? 'sí' : 'no'}
                    {org.website ? ` · ${org.website}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-white"
                    onClick={async () => {
                      await adminUpdateOrganization(token, org.id, { status: 'verified', autoPublish: true })
                      const data = await adminOrganizations(token)
                      setOrgs(data.organizations)
                    }}
                  >
                    Verificar + auto
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                    onClick={async () => {
                      await adminUpdateOrganization(token, org.id, { status: 'verified', autoPublish: false })
                      const data = await adminOrganizations(token)
                      setOrgs(data.organizations)
                    }}
                  >
                    Verificar
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                    onClick={async () => {
                      await adminUpdateOrganization(token, org.id, { status: 'suspended', autoPublish: false })
                      const data = await adminOrganizations(token)
                      setOrgs(data.organizations)
                    }}
                  >
                    Suspender
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">{editing ? 'Editar oportunidad' : 'Nueva oportunidad'}</h2>
            <button
              type="button"
              className="text-sm font-semibold text-slate-600 hover:underline"
              onClick={() => {
                setCreating(false)
                setEditing(null)
              }}
            >
              Cerrar
            </button>
          </div>
          <JobForm
            initial={editing ?? undefined}
            submitLabel={editing ? 'Guardar cambios' : 'Guardar y publicar'}
            onSubmit={async (draft: JobDraft) => {
              if (mode === 'local' || token === 'local-dev') {
                saveJobLocal(
                  { ...draft, id: editing?.id, status: editing?.status ?? 'published' },
                  { publish: !editing },
                )
                setJobs(getJobs())
              } else if (editing) {
                await adminJobAction(token, editing.id, 'update', { job: draft })
                await refresh()
              } else {
                // Admin-created offers: submit via public endpoint is wrong; save as update path after local create isn't available.
                // Use local publish path only for API: post as approve after manual insert isn't implemented —
                // fallback: create via public API would need verification. For admin create, use local save then remind.
                saveJobLocal({ ...draft, status: 'published' }, { publish: true })
                window.alert(
                  'Creación directa por admin vía API completa llegará en un siguiente paso. Por ahora se guardó en modo compatible; en producción aprueba desde pendientes o publica tras envío verificado.',
                )
                await refresh().catch(() => setJobs(getJobs()))
              }
              setEditing(null)
              setCreating(false)
            }}
          />
        </div>
      )}

      {selected && tab !== 'orgs' && tab !== 'settings' && (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {labelOf(JOB_STATUSES, effectiveStatus(selected))}
                {selected.approvalMethod ? ` · ${selected.approvalMethod}` : ''}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-ink">{selected.title}</h2>
              <p className="text-sm text-slate-600">
                {selected.company} · {selected.contactEmail}
                {selected.contactVerified ? ' · correo verificado' : ' · correo sin verificar'}
              </p>
            </div>
            <button type="button" className="text-sm font-semibold text-slate-600" onClick={() => setSelected(null)}>
              Cerrar
            </button>
          </div>
          {selected.aiResult && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-ink">
                IA: {selected.aiResult.recommendation || 'sin recomendación'}
                {typeof selected.aiResult.confidence === 'number'
                  ? ` (${Math.round(selected.aiResult.confidence * 100)}%)`
                  : ''}
              </p>
              {selected.aiResult.summary && <p className="mt-2">{selected.aiResult.summary}</p>}
              {(selected.reviewReasons?.length || selected.aiResult.reviewReasons?.length) ? (
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {(selected.reviewReasons || selected.aiResult.reviewReasons || []).map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : null}
              {selected.aiResult.riskSignals?.length ? (
                <p className="mt-3 text-coral">Riesgos: {selected.aiResult.riskSignals.join(' · ')}</p>
              ) : null}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-white" onClick={() => runAction(selected, 'approve')}>
              Aprobar y publicar
            </button>
            <button type="button" disabled={busy} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => runAction(selected, 'request_corrections')}>
              Solicitar correcciones
            </button>
            <button type="button" disabled={busy} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => runAction(selected, 'reject')}>
              Rechazar
            </button>
            <button type="button" disabled={busy} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => runAction(selected, 'unpublish')}>
              Despublicar
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold"
              onClick={() => {
                setEditing(selected)
                setCreating(false)
                setSelected(null)
              }}
            >
              Editar
            </button>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p className="whitespace-pre-wrap">{selected.description}</p>
          </div>
        </div>
      )}

      {tab !== 'orgs' && tab !== 'settings' && (
        <div className="mt-6 space-y-4">
          {visible.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-card">No hay oportunidades en esta vista.</p>
          )}
          {visible.map((job) => {
            const status = effectiveStatus(job)
            return (
              <article key={job.id} className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {labelOf(JOB_STATUSES, status)}
                      {job.isDemo ? ' · ejemplo' : ''}
                      {job.approvalMethod ? ` · ${job.approvalMethod}` : ''}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-ink">{job.title}</h3>
                    <p className="text-sm text-slate-600">
                      {job.company} · {job.contactEmail}
                    </p>
                    {job.aiResult?.summary ? (
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2">IA: {job.aiResult.summary}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => setSelected(job)}>
                      Revisar
                    </button>
                    {isPendingReviewStatus(status) && (
                      <>
                        <button type="button" className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-white" onClick={() => runAction(job, 'approve')}>
                          Aprobar
                        </button>
                        <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => runAction(job, 'reject')}>
                          Rechazar
                        </button>
                      </>
                    )}
                    {status === 'published' && (
                      <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => runAction(job, 'unpublish')}>
                        Despublicar
                      </button>
                    )}
                    <Link to={`/empleos/${job.slug}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold">
                      Ver
                    </Link>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-coral"
                      onClick={async () => {
                        if (!window.confirm('¿Eliminar esta oportunidad?')) return
                        if (mode === 'local' || token === 'local-dev') {
                          deleteJob(job.id)
                          setJobs(getJobs())
                        } else {
                          await adminDeleteJob(token, job.id)
                          await refresh()
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
          {mode === 'local' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Esto reemplaza el listado local por los datos de prueba.')) {
                  restoreDemoJobs()
                  setJobs(getJobs())
                }
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink"
            >
              Restaurar ejemplos locales
            </button>
          )}
        </div>
      )}
    </section>
  )
}
