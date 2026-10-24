import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  JOB_EXPERIENCE,
  JOB_MODALITIES,
  JOB_SCHEDULES,
  JOB_TYPES,
  areaSummary,
  careerSummary,
  companyInitials,
  effectiveStatus,
  formatDate,
  labelOf,
  opportunityUrl,
  whatsappShareUrl,
  type JobOpportunity,
} from '../data/empleos'
import { loadPublicJob } from '../lib/empleosStore'
import { track } from '../lib/track'
import { usePageMeta } from '../lib/usePageMeta'

export default function EmpleoDetalle() {
  const { slug = '' } = useParams()
  const [job, setJob] = useState<JobOpportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const result = await loadPublicJob(slug)
      if (!cancelled) {
        setJob(result)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  const isPublic = job ? effectiveStatus(job) === 'published' : false

  usePageMeta(
    job ? `${job.title} — ${job.company} | Empleos FEUC` : 'Oportunidad | Empleos FEUC',
    job
      ? `${job.title} en ${job.company}. ${labelOf(JOB_TYPES, job.type)} para estudiantes y recién egresados UC.`
      : 'Oportunidad profesional para estudiantes UC.',
  )

  if (loading) {
    return (
      <section className="py-12">
        <p className="rounded-2xl bg-white p-8 text-sm text-slate-600 shadow-card">Cargando oportunidad…</p>
      </section>
    )
  }

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

      <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="border-b border-slate-100 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/25 text-sm font-semibold text-secondary">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt="" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  companyInitials(job.company)
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {labelOf(JOB_TYPES, job.type)}
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-ink md:text-3xl">{job.title}</h1>
                <p className="mt-1 text-sm text-slate-600">
                  {job.company}
                  {job.companyWebsite ? (
                    <>
                      {' · '}
                      <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                        Sitio web
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={job.applicationUrl.startsWith('http') ? job.applicationUrl : `mailto:${job.applicationUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('empleos_apply', { slug: job.slug })}
                className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white"
              >
                Postular
              </a>
              <a
                href={whatsappShareUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('empleos_share_whatsapp', { slug: job.slug })}
                className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink"
              >
                Compartir
              </a>
              <button type="button" onClick={copyLink} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink">
                Copiar enlace
              </button>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink">Modalidad</dt>
              <dd>{labelOf(JOB_MODALITIES, job.modality)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Jornada</dt>
              <dd>{labelOf(JOB_SCHEDULES, job.schedule)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Experiencia</dt>
              <dd>{labelOf(JOB_EXPERIENCE, job.experienceLevel)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Ubicación</dt>
              <dd>{job.location}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Áreas</dt>
              <dd>{areaSummary(job)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Carreras</dt>
              <dd>{careerSummary(job)}</dd>
            </div>
            {job.compensation ? (
              <div>
                <dt className="font-semibold text-ink">Remuneración</dt>
                <dd>{job.compensation}</dd>
              </div>
            ) : null}
            {job.deadline ? (
              <div>
                <dt className="font-semibold text-ink">Cierre</dt>
                <dd>{formatDate(job.deadline)}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="space-y-6 p-6 text-sm leading-relaxed text-slate-700 md:p-8">
          <section>
            <h2 className="text-lg font-semibold text-ink">Descripción</h2>
            <p className="mt-2 whitespace-pre-wrap">{job.description}</p>
          </section>
          {job.responsibilities ? (
            <section>
              <h2 className="text-lg font-semibold text-ink">Funciones</h2>
              <p className="mt-2 whitespace-pre-wrap">{job.responsibilities}</p>
            </section>
          ) : null}
          {job.requirements ? (
            <section>
              <h2 className="text-lg font-semibold text-ink">Requisitos</h2>
              <p className="mt-2 whitespace-pre-wrap">{job.requirements}</p>
            </section>
          ) : null}
        </div>
      </article>
    </section>
  )
}
