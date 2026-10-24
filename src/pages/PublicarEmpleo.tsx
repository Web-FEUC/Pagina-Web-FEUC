import { useState } from 'react'
import { Link } from 'react-router-dom'
import JobForm from '../components/empleos/JobForm'
import { submitOpportunity } from '../lib/empleosStore'
import { track } from '../lib/track'
import { usePageMeta } from '../lib/usePageMeta'
import type { JobDraft } from '../data/empleos'

export default function PublicarEmpleo() {
  const [sentMessage, setSentMessage] = useState('')
  usePageMeta(
    'Publicar una oportunidad | Empleos FEUC',
    'Comparte una práctica o trabajo con estudiantes y recién egresados de la Universidad Católica.',
  )

  const handleSubmit = async (draft: JobDraft) => {
    const result = await submitOpportunity(draft)
    track('empleos_submit')
    setSentMessage(
      result.message ||
        'Recibimos tu oportunidad. Revisa tu correo para verificar el contacto.',
    )
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
          Para empresas, organizaciones, startups, fundaciones, académicos u otras instituciones. No
          necesitas crear una cuenta: completas el formulario, verificas tu correo y el sistema evalúa
          la publicación.
        </p>

        {sentMessage ? (
          <div className="mt-8 rounded-2xl bg-primary/20 p-6">
            <h2 className="text-xl font-semibold text-ink">Recibimos tu oportunidad</h2>
            <p className="mt-2 text-sm text-slate-700">{sentMessage}</p>
            <Link to="/empleos" className="mt-4 inline-flex font-semibold text-secondary hover:underline">
              Volver a las ofertas
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <JobForm submitLabel="Enviar oportunidad" onSubmit={handleSubmit} requireAuthorization showDemoNote />
          </div>
        )}
      </div>
    </section>
  )
}
