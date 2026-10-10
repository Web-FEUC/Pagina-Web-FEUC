import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import JobCard from '../components/empleos/JobCard'
import JobFilters, { emptyFilters, type JobFilterState } from '../components/empleos/JobFilters'
import { usePageMeta } from '../lib/usePageMeta'
import { getPublicJobs } from '../lib/empleosStore'
import { track } from '../lib/track'
import { JOB_AREAS, JOB_CAREERS, JOB_TYPES, labelOf, type JobOpportunity } from '../data/empleos'

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
