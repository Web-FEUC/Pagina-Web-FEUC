import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import JobForm from '../components/empleos/JobForm'
import {
  JOB_STATUSES,
  effectiveStatus,
  labelOf,
  type JobDraft,
  type JobOpportunity,
} from '../data/empleos'
import { deleteJob, getJobs, restoreDemoJobs, saveJob, setJobStatus } from '../lib/empleosStore'
import { usePageMeta } from '../lib/usePageMeta'

const ADMIN_PASSWORD = import.meta.env.VITE_EMPLEOS_ADMIN_PASSWORD || 'feuc-empleos'
const SESSION_KEY = 'feuc-empleos-admin'

type AdminTab = 'pending' | 'published' | 'draft' | 'rejected' | 'expired' | 'all'

function loadSession() {
  return typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY) === '1'
}

export default function AdminEmpleos() {
  const [authed, setAuthed] = useState(loadSession)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<AdminTab>('pending')
  const [editing, setEditing] = useState<JobOpportunity | null>(null)
  const [creating, setCreating] = useState(false)
  const [tick, setTick] = useState(0)

  usePageMeta('Administración Empleos FEUC', 'Panel interno para revisar y publicar oportunidades.')

  const jobs = useMemo(() => getJobs(), [tick])
  const refresh = () => setTick((value) => value + 1)

  const visible = jobs.filter((job) => {
    const status = effectiveStatus(job)
    if (tab === 'all') return true
    return status === tab
  })

  if (!authed) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Uso interno FEUC</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Administrar empleos</h1>
          <p className="mt-2 text-sm text-slate-600">Ingresa la clave del equipo para revisar oportunidades pendientes.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (password === ADMIN_PASSWORD) {
                window.sessionStorage.setItem(SESSION_KEY, '1')
                setAuthed(true)
              } else {
                window.alert('Clave incorrecta.')
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
            <button type="submit" className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-white">
              Entrar
            </button>
          </form>
        </div>
      </section>
    )
  }

  const saveDraft = (draft: JobDraft, publish: boolean) => {
    saveJob({ ...draft, status: publish ? 'published' : draft.status || 'draft' }, { publish })
    setEditing(null)
    setCreating(false)
    refresh()
  }

  return (
    <section className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel FEUC</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Oportunidades</h1>
          <p className="mt-2 text-sm text-slate-600">Aprueba, edita o retira publicaciones. Las vencidas no se eliminan.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setCreating(true)
              setEditing(null)
            }}
            className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white"
          >
            Crear oportunidad
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Esto reemplaza el listado local por los datos de prueba.')) {
                restoreDemoJobs()
                refresh()
              }
            }}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink"
          >
            Restaurar ejemplos
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['pending', 'published', 'draft', 'rejected', 'expired', 'all'] as AdminTab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              tab === item ? 'bg-secondary text-white' : 'bg-white text-slate-700'
            }`}
          >
            {item === 'all' ? 'Todas' : labelOf(JOB_STATUSES, item)}
          </button>
        ))}
      </div>

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
            onSubmit={(draft) => saveDraft({ ...draft, id: editing?.id, status: editing?.status ?? 'published' }, !editing)}
          />
        </div>
      )}

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
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{job.title}</h3>
                  <p className="text-sm text-slate-600">
                    {job.company} · {job.contactEmail}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {status === 'pending' && (
                    <>
                      <button type="button" className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-white" onClick={() => { setJobStatus(job.id, 'published'); refresh() }}>
                        Aprobar
                      </button>
                      <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => { setJobStatus(job.id, 'rejected'); refresh() }}>
                        Rechazar
                      </button>
                    </>
                  )}
                  {status === 'published' && (
                    <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => { setJobStatus(job.id, 'draft'); refresh() }}>
                      Despublicar
                    </button>
                  )}
                  {(status === 'draft' || status === 'rejected' || status === 'expired') && (
                    <button type="button" className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-white" onClick={() => { setJobStatus(job.id, 'published'); refresh() }}>
                      Publicar
                    </button>
                  )}
                  <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => { setEditing(job); setCreating(false) }}>
                    Editar
                  </button>
                  <Link to={`/empleos/${job.slug}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold">
                    Ver
                  </Link>
                  <button
                    type="button"
                    className="rounded-full border border-coral/30 px-3 py-1.5 text-xs font-semibold text-coral"
                    onClick={() => {
                      if (window.confirm('¿Eliminar esta oportunidad?')) {
                        deleteJob(job.id)
                        refresh()
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
      </div>
    </section>
  )
}
