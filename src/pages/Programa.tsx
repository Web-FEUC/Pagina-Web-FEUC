import { useMemo, useState } from 'react'
import {
  PROGRAMA_PROJECTS,
  PROGRAMA_STATUSES,
  programaStats,
  statusMeta,
  type ProgramaStatus,
} from '../data/programa'
import { usePageMeta } from '../lib/usePageMeta'

type Filter = 'all' | ProgramaStatus

function Donut({
  segments,
}: {
  segments: Array<{ value: number; color: string; label: string }>
}) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1
  const radius = 54
  const stroke = 16
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <svg viewBox="0 0 140 140" className="h-52 w-52" role="img" aria-label="Distribución del programa por estado">
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#e8eee9" strokeWidth={stroke} />
      {segments.map((segment) => {
        const length = (segment.value / total) * circumference
        const circle = (
          <circle
            key={segment.label}
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={stroke}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform="rotate(-90 70 70)"
          />
        )
        offset += length
        return circle
      })}
    </svg>
  )
}

export default function Programa() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)
  const stats = useMemo(() => programaStats(), [])

  usePageMeta(
    'Programa FEUC 2026 | Cumplimiento',
    'Revisa el porcentaje de cumplimiento del programa de la Federación de Estudiantes UC.',
  )

  const visible = PROGRAMA_PROJECTS.filter((project) => {
    if (filter !== 'all' && project.status !== filter) return false
    const haystack = `${project.name} ${project.description}`.toLowerCase()
    return !query.trim() || haystack.includes(query.trim().toLowerCase())
  })

  const ringPct = stats.amplioPct
  const ringRadius = 58
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringFilled = (ringPct / 100) * ringCircumference

  return (
    <section className="py-10">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Programa FEUC 2026</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Así vamos con el programa</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          Seguimiento público de {stats.total} compromisos. El porcentaje principal suma lo ya logrado
          y lo que está en avance.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="rounded-3xl bg-gradient-to-br from-white via-white to-primary/25 p-6 shadow-card md:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <svg viewBox="0 0 140 140" className="h-48 w-48" aria-hidden>
                <circle cx="70" cy="70" r={ringRadius} fill="none" stroke="#e8eee9" strokeWidth="12" />
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  fill="none"
                  stroke="#8DE09C"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${ringFilled} ${ringCircumference - ringFilled}`}
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-semibold tracking-tight text-ink">{stats.amplioPct}%</p>
                <p className="mt-1 max-w-[7.5rem] text-center text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  logrado o en avance
                </p>
              </div>
            </div>
            <div className="w-full space-y-4 sm:max-w-sm">
              <div>
                <p className="text-sm font-semibold text-ink">{stats.logradoPct}% ya está logrado</p>
                <p className="mt-1 text-sm text-slate-600">
                  {stats.logrado} de {stats.total} proyectos cumplidos, con o sin adaptaciones.
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="flex h-full">
                  <span className="bg-secondary" style={{ width: `${stats.logradoPct}%` }} />
                  <span className="bg-accent" style={{ width: `${stats.avancePct}%` }} />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {stats.counts.avances} compromisos siguen en avance · {stats.counts['no-logrado']} aún no se logran
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Desglose</h2>
          <div className="mt-4 flex items-center gap-5">
            <Donut
              segments={PROGRAMA_STATUSES.map((item) => ({
                value: stats.counts[item.value],
                color: item.color,
                label: item.label,
              }))}
            />
            <ul className="space-y-2 text-sm">
              {PROGRAMA_STATUSES.map((item) => (
                <li key={item.value} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.label}</span>
                  <span className="ml-auto font-semibold text-ink">{stats.counts[item.value]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Logrado</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{stats.logrado}</p>
          <p className="text-sm text-slate-600">{stats.logradoPct}% del programa</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">En avance</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{stats.counts.avances}</p>
          <p className="text-sm text-slate-600">{stats.avancePct}% del programa</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">No logrado</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{stats.counts['no-logrado']}</p>
          <p className="text-sm text-slate-600">{stats.noLogradoPct}% del programa</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Compromisos</h2>
            <p className="text-sm text-slate-600">Filtra por estado o busca por nombre.</p>
          </div>
          <label className="block w-full md:max-w-xs">
            <span className="sr-only">Buscar compromiso</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar un proyecto"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
            />
          </label>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              filter === 'all' ? 'bg-secondary text-white' : 'bg-white text-slate-700'
            }`}
          >
            Todos ({stats.total})
          </button>
          {PROGRAMA_STATUSES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                filter === item.value ? 'bg-secondary text-white' : 'bg-white text-slate-700'
              }`}
            >
              {item.label} ({stats.counts[item.value]})
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visible.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-card">No hay compromisos con esa búsqueda.</p>
          )}
          {visible.map((project) => {
            const meta = statusMeta(project.status)
            const open = openId === project.id
            return (
              <article key={project.id} className="rounded-2xl bg-white shadow-card">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenId(open ? null : project.id)}
                  aria-expanded={open}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: meta.color }}>
                      {meta.label}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-ink">{project.name}</h3>
                  </div>
                  <span className="mt-1 text-slate-400" aria-hidden>
                    {open ? '–' : '+'}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">
                    {project.description || 'Sin descripción en el seguimiento público.'}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
