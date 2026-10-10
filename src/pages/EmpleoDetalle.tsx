import { Link, useParams } from 'react-router-dom'
import {
  JOB_EXPERIENCE,
  JOB_MODALITIES,
  JOB_SCHEDULES,
  JOB_TYPES,
  areaSummary,
  careerSummary,
  companyInitials,
  formatDate,
  labelOf,
  opportunityUrl,
  whatsappShareUrl,
} from '../data/empleos'
import { getJobBySlug } from '../lib/empleosStore'
import { effectiveStatus } from '../data/empleos'
import { track } from '../lib/track'
import { usePageMeta } from '../lib/usePageMeta'

export default function EmpleoDetalle() {
  const { slug = '' } = useParams()
  const job = getJobBySlug(slug)
  const isPublic = job ? effectiveStatus(job) === 'published' : false

  usePageMeta(
    job ? `${job.title} — ${job.company} | Empleos FEUC` : 'Oportunidad | Empleos FEUC',
    job
      ? `${job.title} en ${job.company}. ${labelOf(JOB_TYPES, job.type)} para estudiantes y recién egresados UC.`
      : 'Oportunidad profesional para estudiantes UC.',
  )

  if (!job || !isPublic) {
    return (
      <section className="py-12">
        <div className="rounded-2xl bg-white p-8 shadow-card">
          <h1 className="text-2xl font-semibold text-ink">Esta oportunidad no está disponible</h1>
          <p className="mt-2 text-sm text-slate-600">Puede haber vencido o aún no haber sido publicada.</p>
          <Link to="/empleos" className="mt-4 inline-flex font-semibold text-secondary hover:underline">
            Volver a Empleos FEUC
          </Link>
        </div>
      </section>
    )
  }

  const shareUrl = opportunityUrl(job.slug)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      window.alert('Enlace copiado.')
    } catch {
      window.prompt('Copia este enlace:', shareUrl)
    }
  }

  return (
    <section className="py-10">
      <Link to="/empleos" className="text-sm font-semibold text-secondary hover:underline">
        ← Volver a oportunidades
      </Link>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={`Logo de ${job.company}`} className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-sm font-semibold text-white">
                {companyInitials(job.company)}
              </div>
            )}
            <div>
              {job.isDemo && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Oferta de ejemplo</p>
              )}
              <h1 className="text-3xl font-semibold text-ink">{job.title}</h1>
              <p className="mt-1 text-base text-slate-600">{job.company}</p>
              <p className="mt-3 text-sm text-slate-600">
                {job.location} · {labelOf(JOB_MODALITIES, job.modality)} · {labelOf(JOB_TYPES, job.type)}
              </p>
            </div>
          </div>
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('empleos_apply', { slug: job.slug })}
            className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Postular
          </a>
        </div>

        <dl className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-ink">Área</dt>
            <dd className="text-slate-600">{areaSummary(job)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Carreras sugeridas</dt>
            <dd className="text-slate-600">{careerSummary(job)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Tipo de jornada</dt>
            <dd className="text-slate-600">{labelOf(JOB_SCHEDULES, job.schedule)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Experiencia</dt>
            <dd className="text-slate-600">{labelOf(JOB_EXPERIENCE, job.experienceLevel)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Fecha límite</dt>
            <dd className="text-slate-600">{job.deadline ? formatDate(job.deadline) : 'No indicada'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Link de postulación</dt>
            <dd>
              <a href={job.applicationUrl} className="break-all font-semibold text-secondary hover:underline" target="_blank" rel="noopener noreferrer">
                {job.applicationUrl}
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-ink">Descripción</h2>
            <p className="mt-2 whitespace-pre-line">{job.description}</p>
          </section>
          {job.responsibilities && (
            <section>
              <h2 className="text-lg font-semibold text-ink">Principales funciones</h2>
              <p className="mt-2 whitespace-pre-line">{job.responsibilities}</p>
            </section>
          )}
          {job.requirements && (
            <section>
              <h2 className="text-lg font-semibold text-ink">Perfil buscado</h2>
              <p className="mt-2 whitespace-pre-line">{job.requirements}</p>
            </section>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={whatsappShareUrl(job)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('empleos_share_whatsapp', { slug: job.slug })}
            className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Compartir por WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              void copyLink()
            }}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Compartir oportunidad
          </button>
        </div>
      </div>
    </section>
  )
}
