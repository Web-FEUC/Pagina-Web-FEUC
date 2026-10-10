import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import JobCard from '../components/empleos/JobCard'
import JobFilters, { emptyFilters, type JobFilterState } from '../components/empleos/JobFilters'
import { usePageMeta } from '../lib/usePageMeta'
import { getPublicJobs } from '../lib/empleosStore'
import { track } from '../lib/track'
import {
  EMPLEOS_TELEGRAM_URL,
  EMPLEOS_WHATSAPP_URL,
  JOB_AREAS,
  JOB_CAREERS,
  JOB_TYPES,
  labelOf,
  type JobOpportunity,
} from '../data/empleos'

function matches(job: JobOpportunity, filters: JobFilterState) {
  const haystack = [
    job.title,
    job.company,
    job.description,
    job.location,
    labelOf(JOB_TYPES, job.type),
    ...job.areas.map((area) => labelOf(JOB_AREAS, area)),
    ...job.careers.map((career) => labelOf(JOB_CAREERS, career)),
    job.openToAllCareers ? 'abierto a todas las carreras' : '',
  ]
    .join(' ')
    .toLowerCase()
  if (filters.query && !haystack.includes(filters.query.trim().toLowerCase())) return false
  if (filters.type && job.type !== filters.type) return false
  if (filters.area && !job.areas.includes(filters.area)) return false
  if (filters.modality && job.modality !== filters.modality) return false
  if (filters.experience && job.experienceLevel !== filters.experience) return false
  if (filters.career === '__open__' && !job.openToAllCareers) return false
  if (filters.career && filters.career !== '__open__' && !job.openToAllCareers && !job.careers.includes(filters.career)) {
    return false
  }
  return true
}

function sortJobs(jobs: JobOpportunity[], sort: JobFilterState['sort']) {
  return [...jobs].sort((a, b) => {
    if (sort === 'closing') {
      const aDate = a.deadline || '9999-12-31'
      const bDate = b.deadline || '9999-12-31'
      return aDate.localeCompare(bDate)
    }
    return (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt)
  })
}

export default function Empleos() {
  const [filters, setFilters] = useState<JobFilterState>(emptyFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)

  usePageMeta(
    'Empleos FEUC | Oportunidades para estudiantes UC',
    'Encuentra prácticas, trabajos y oportunidades profesionales para estudiantes y recién egresados de la Universidad Católica.',
  )

  useEffect(() => {
    track('empleos_visit')
  }, [])

  const jobs = useMemo(() => getPublicJobs(), [])

  const results = useMemo(() => sortJobs(jobs.filter((job) => matches(job, filters)), filters.sort), [jobs, filters])

  const updateFilters = (next: JobFilterState) => {
    setFilters(next)
    track('empleos_filter', {
      type: next.type || 'all',
      area: next.area || 'all',
      career: next.career || 'all',
      query: next.query ? 1 : 0,
    })
  }

  const clearFilters = () => {
    setFilters(emptyFilters)
    setFiltersOpen(false)
  }

  return (
    <section className="py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={EMPLEOS_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('empleos_join_whatsapp')}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.44 0 .07 5.37.07 11.97c0 2.11.55 4.17 1.6 6L0 24l6.2-1.62a11.94 11.94 0 0 0 5.84 1.49h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.5-8.42ZM12.05 21.85h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.68.96.98-3.58-.24-.37a9.88 9.88 0 0 1-1.52-5.3c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.91a9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.87-9.96 9.87Zm5.44-7.4c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
          </svg>
          Unirse a WhatsApp
        </a>
        <a
          href={EMPLEOS_TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('empleos_join_telegram')}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-secondary/20 bg-white px-5 py-2.5 text-sm font-semibold text-secondary transition hover:bg-secondary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M21.5 3.1 2.7 10.3c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.2-7.1c.5-.3 1-.1.6.2l-9 8.2-.3 4.8c.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.6-1.4Z" />
          </svg>
          Unirse a Telegram
        </a>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Empleos FEUC</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Encuentra tu próxima oportunidad</h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Prácticas, trabajos y oportunidades para estudiantes y recién egresados UC.
          </p>
        </div>
        <Link
          to="/empleos/publicar"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          Publica una oportunidad
        </Link>
      </div>

      <label className="mt-8 block">
        <span className="sr-only">Buscar cargo, empresa, área o palabra clave</span>
        <input
          value={filters.query}
          onChange={(event) => {
            updateFilters({ ...filters, query: event.target.value })
            track('empleos_search')
          }}
          placeholder="Buscar cargo, empresa, área o palabra clave"
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10"
        />
      </label>

      <div className="mt-6 lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink"
          aria-expanded={filtersOpen}
        >
          {filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={`${filtersOpen ? 'block' : 'hidden'} rounded-2xl bg-white p-5 shadow-card lg:block`}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Filtros</h2>
          <JobFilters value={filters} onChange={updateFilters} onClear={clearFilters} />
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-card">
              <p className="text-lg font-semibold text-ink">No encontramos oportunidades con estos filtros.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-600">
                {results.length} {results.length === 1 ? 'oportunidad' : 'oportunidades'}
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                {results.map((job) => (
                  <JobCard key={job.id} job={job} onOpen={() => track('empleos_open', { slug: job.slug })} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
