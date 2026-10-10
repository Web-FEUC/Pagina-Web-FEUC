import { useState } from 'react'
import { Link } from 'react-router-dom'
import JobForm from '../components/empleos/JobForm'
import { saveJob } from '../lib/empleosStore'
import { track } from '../lib/track'
import { usePageMeta } from '../lib/usePageMeta'
import type { JobDraft } from '../data/empleos'

export default function PublicarEmpleo() {
  const [sent, setSent] = useState(false)
  usePageMeta(
    'Publicar una oportunidad | Empleos FEUC',
    'Comparte una práctica o trabajo con estudiantes y recién egresados de la Universidad Católica.',
  )

  const handleSubmit = (draft: JobDraft) => {
    saveJob({ ...draft, status: 'pending' })
    track('empleos_submit')
    setSent(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="py-10">
      <Link to="/empleos" className="text-sm font-semibold text-secondary hover:underline">
        ← Volver a Empleos FEUC
      </Link>
      <div className="mx-auto mt-6 max-w-3xl rounded-3xl bg-white p-6 shadow-card md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Empleos FEUC</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Publica una oportunidad</h1>
        <p className="mt-3 text-sm text-slate-600">
          Para empresas, organizaciones, startups, fundaciones, académicos u otras instituciones que
          quieran compartir oportunidades con estudiantes UC. FEUC revisa cada envío antes de publicarlo.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl bg-primary/20 p-6">
            <h2 className="text-xl font-semibold text-ink">Recibimos tu oportunidad</h2>
            <p className="mt-2 text-sm text-slate-700">
              Quedó en revisión. El equipo FEUC la publicará si cumple los criterios de la plataforma.
            </p>
            <Link to="/empleos" className="mt-4 inline-flex font-semibold text-secondary hover:underline">
              Volver a las ofertas
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <JobForm
              submitLabel="Enviar a revisión"
              onSubmit={handleSubmit}
              requireAuthorization
              showDemoNote
            />
          </div>
        )}
      </div>
    </section>
  )
}
