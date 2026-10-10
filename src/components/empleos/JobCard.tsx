import { Link } from 'react-router-dom'
import {
  JOB_MODALITIES,
  JOB_TYPES,
  areaSummary,
  careerSummary,
  companyInitials,
  formatDate,
  labelOf,
  opportunityPath,
  type JobOpportunity,
} from '../../data/empleos'

interface JobCardProps {
  job: JobOpportunity
  onOpen?: (job: JobOpportunity) => void
}

export default function JobCard({ job, onOpen }: JobCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        {job.companyLogo ? (
          <img src={job.companyLogo} alt={`Logo de ${job.company}`} className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <div
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-xs font-semibold text-white"
          >
            {companyInitials(job.company)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug text-ink">{job.title}</h3>
          <p className="text-sm text-slate-600">{job.company}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-secondary">
        {labelOf(JOB_TYPES, job.type)} · {areaSummary(job)}
      </p>

      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        <li>📍 {job.location}</li>
        <li>🏠 {labelOf(JOB_MODALITIES, job.modality)}</li>
        <li>🎓 {careerSummary(job)}</li>
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {job.isDemo && (
          <span className="rounded-full bg-accent/20 px-2 py-1 font-semibold text-secondary">Ejemplo</span>
        )}
        {job.deadline && <span>Cierre: {formatDate(job.deadline)}</span>}
        {job.publishedAt && <span>Publicada: {formatDate(job.publishedAt.slice(0, 10))}</span>}
      </div>

      <Link
        to={opportunityPath(job.slug)}
        onClick={() => onOpen?.(job)}
        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-secondary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        Ver oportunidad →
      </Link>
    </article>
  )
}
