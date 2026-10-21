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
    <svg
      viewBox="0 0 140 140"
      className="h-36 w-36 shrink-0 sm:h-44 sm:w-44 md:h-52 md:w-52"
      role="img"
      aria-label="Distribución del programa por estado"
    >
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
    <section className="py-6 md:py-10">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs sm:tracking-[0.2em]">
          Programa FEUC 2026
        </p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl md:text-4xl">
          Así vamos con el programa
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
          Seguimiento público de {stats.total} compromisos. El porcentaje principal suma lo ya logrado
          y lo que está en avance.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:mt-8 md:gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="rounded-3xl bg-gradient-to-br from-white via-white to-primary/25 p-5 shadow-card sm:p-6 md:p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="relative">
              <svg viewBox="0 0 140 140" className="h-40 w-40 sm:h-44 sm:w-44 md:h-48 md:w-48" aria-hidden>
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
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
                <p className="text-4xl font-semibold tracking-tight text-ink">{stats.amplioPct}%</p>
                <p className="mt-1 max-w-[8rem] text-center text-[10px] font-medium uppercase leading-tight tracking-[0.1em] text-slate-500 sm:text-[11px] sm:tracking-[0.12em]">
                  logrado o en avance
                </p>
              </div>
            </div>
            <div className="w-full min-w-0 space-y-3 sm:max-w-sm sm:space-y-4">
              <div>
                <p className="text-sm font-semibold text-ink">{stats.logradoPct}% ya está logrado</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {stats.logrado} de {stats.total} proyectos cumplidos (con o sin adaptaciones, o incluidos en el P.E.).
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="flex h-full">
                  <span className="bg-secondary" style={{ width: `${stats.logradoPct}%` }} />
                  <span className="bg-accent" style={{ width: `${stats.avancePct}%` }} />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                {stats.counts.avances} en avance · {stats.counts['no-logrado']} aún no se logran
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Desglose</h2>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Donut
              segments={PROGRAMA_STATUSES.map((item) => ({
                value: stats.counts[item.value],
                color: item.color,
                label: item.label,
              }))}
            />
            <ul className="w-full min-w-0 space-y-2.5 text-sm">
              {PROGRAMA_STATUSES.map((item) => (
                <li key={item.value} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="min-w-0 flex-1 leading-snug text-slate-600">{item.label}</span>
                  <span className="font-semibold tabular-nums text-ink">{stats.counts[item.value]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
        <div className="rounded-2xl bg-white p-3 shadow-card sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">Logrado</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink sm:mt-2 sm:text-3xl">{stats.logrado}</p>
          <p className="text-[11px] leading-snug text-slate-600 sm:text-sm">{stats.logradoPct}%</p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-card sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">En avance</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink sm:mt-2 sm:text-3xl">{stats.counts.avances}</p>
          <p className="text-[11px] leading-snug text-slate-600 sm:text-sm">{stats.avancePct}%</p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-card sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">No logrado</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink sm:mt-2 sm:text-3xl">{stats.counts['no-logrado']}</p>
          <p className="text-[11px] leading-snug text-slate-600 sm:text-sm">{stats.noLogradoPct}%</p>
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink sm:text-2xl">Compromisos</h2>
            <p className="text-sm text-slate-600">Filtra por estado o busca por nombre.</p>
          </div>
          <label className="block w-full md:max-w-xs">
            <span className="sr-only">Buscar compromiso</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar un proyecto"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 md:py-2.5 md:text-sm"
            />
          </label>
        </div>

        <div className="-mx-4 mb-5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`min-h-11 shrink-0 touch-manipulation rounded-full px-3.5 py-2 text-sm font-semibold ${
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
                className={`min-h-11 shrink-0 touch-manipulation rounded-full px-3.5 py-2 text-sm font-semibold ${
                  filter === item.value ? 'bg-secondary text-white' : 'bg-white text-slate-700'
                }`}
              >
                <span className="sm:hidden">
                  {item.shortLabel} ({stats.counts[item.value]})
                </span>
                <span className="hidden sm:inline">
                  {item.label} ({stats.counts[item.value]})
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="mb-3 text-xs text-slate-500">{visible.length} compromisos</p>

        <div className="space-y-2.5 sm:space-y-3">
          {visible.length === 0 && (
            <p className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-card sm:p-6">
              No hay compromisos con esa búsqueda.
            </p>
          )}
          {visible.map((project) => {
            const meta = statusMeta(project.status)
            const open = openId === project.id
            return (
              <article key={project.id} className="rounded-2xl bg-white shadow-card">
                <button
                  type="button"
                  className="flex min-h-14 w-full items-start justify-between gap-3 px-4 py-3.5 text-left touch-manipulation sm:gap-4 sm:px-5 sm:py-4"
                  onClick={() => setOpenId(open ? null : project.id)}
                  aria-expanded={open}
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide sm:text-xs" style={{ color: meta.color }}>
                      {meta.label}
                    </p>
                    <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink sm:text-base">{project.name}</h3>
                  </div>
                  <span className="mt-1 shrink-0 text-lg leading-none text-slate-400" aria-hidden>
                    {open ? '–' : '+'}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-slate-100 px-4 py-3.5 text-sm leading-relaxed text-slate-600 sm:px-5 sm:py-4">
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
