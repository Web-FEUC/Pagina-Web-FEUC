import { useState, type FormEvent } from 'react'
import {
  JOB_AREAS,
  JOB_CAREERS,
  JOB_EXPERIENCE,
  JOB_MODALITIES,
  JOB_SCHEDULES,
  JOB_TYPES,
  emptyJobDraft,
  type JobArea,
  type JobCareer,
  type JobDraft,
} from '../../data/empleos'

const fieldClass =
  'mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10'

interface JobFormProps {
  initial?: JobDraft
  submitLabel: string
  onSubmit: (draft: JobDraft) => void
  requireAuthorization?: boolean
  showDemoNote?: boolean
}

export default function JobForm({
  initial,
  submitLabel,
  onSubmit,
  requireAuthorization = false,
  showDemoNote = false,
}: JobFormProps) {
  const [draft, setDraft] = useState<JobDraft>(initial ?? emptyJobDraft)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState('')

  const update = (patch: Partial<JobDraft>) => setDraft((current) => ({ ...current, ...patch }))

  const toggleValue = <T extends string>(list: T[], value: T) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.title.trim() || !draft.company.trim() || !draft.contactName.trim() || !draft.contactEmail.trim()) {
      setError('Completa al menos cargo, organización, nombre y correo de contacto.')
      return
    }
    if (!draft.description.trim() || !draft.applicationUrl.trim()) {
      setError('La descripción y el link de postulación son obligatorios.')
      return
    }
    if (draft.areas.length === 0) {
      setError('Selecciona al menos un área.')
      return
    }
    if (!draft.openToAllCareers && draft.careers.length === 0) {
      setError('Selecciona carreras sugeridas o marca “Abierto a todas las carreras”.')
      return
    }
    if (requireAuthorization && !authorized) {
      setError('Debes autorizar la publicación para enviar la oportunidad.')
      return
    }
    setError('')
    onSubmit(draft)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {showDemoNote && (
        <p className="rounded-2xl bg-accent/15 px-4 py-3 text-sm text-secondary">
          Las ofertas enviadas quedan pendientes de revisión. FEUC las publica después de validarlas.
        </p>
      )}

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-ink">Datos de contacto</legend>
        <label className="block text-sm font-semibold text-ink">
          Nombre de la organización
          <input className={fieldClass} value={draft.company} onChange={(event) => update({ company: event.target.value })} required />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Nombre de la persona responsable
          <input className={fieldClass} value={draft.contactName} onChange={(event) => update({ contactName: event.target.value })} required />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Correo
          <input type="email" className={fieldClass} value={draft.contactEmail} onChange={(event) => update({ contactEmail: event.target.value })} required />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Teléfono (opcional)
          <input className={fieldClass} value={draft.contactPhone} onChange={(event) => update({ contactPhone: event.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Sitio web
          <input className={fieldClass} value={draft.companyWebsite} onChange={(event) => update({ companyWebsite: event.target.value })} placeholder="https://" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          URL del logo (opcional)
          <input className={fieldClass} value={draft.companyLogo} onChange={(event) => update({ companyLogo: event.target.value })} placeholder="https://" />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-ink">Oferta</legend>
        <label className="block text-sm font-semibold text-ink">
          Nombre del cargo
          <input className={fieldClass} value={draft.title} onChange={(event) => update({ title: event.target.value })} required />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Tipo de oportunidad
          <select className={fieldClass} value={draft.type} onChange={(event) => update({ type: event.target.value as JobDraft['type'] })}>
            {JOB_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Área</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {JOB_AREAS.map((item) => (
              <label key={item.value} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-secondary"
                  checked={draft.areas.includes(item.value)}
                  onChange={() => update({ areas: toggleValue(draft.areas, item.value as JobArea) })}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-semibold text-ink">
          Descripción de la oportunidad
          <textarea className={`${fieldClass} min-h-[120px]`} value={draft.description} onChange={(event) => update({ description: event.target.value })} required />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Principales funciones
          <textarea className={`${fieldClass} min-h-[100px]`} value={draft.responsibilities} onChange={(event) => update({ responsibilities: event.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Perfil buscado
          <textarea className={`${fieldClass} min-h-[100px]`} value={draft.requirements} onChange={(event) => update({ requirements: event.target.value })} />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            className="h-4 w-4 accent-secondary"
            checked={draft.openToAllCareers}
            onChange={(event) => update({ openToAllCareers: event.target.checked, careers: event.target.checked ? [] : draft.careers })}
          />
          Abierto a todas las carreras
        </label>
        {!draft.openToAllCareers && (
          <fieldset>
            <legend className="text-sm font-semibold text-ink">Carreras sugeridas</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {JOB_CAREERS.map((item) => (
                <label key={item.value} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-secondary"
                    checked={draft.careers.includes(item.value)}
                    onChange={() => update({ careers: toggleValue(draft.careers, item.value as JobCareer) })}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-ink">
            Modalidad
            <select className={fieldClass} value={draft.modality} onChange={(event) => update({ modality: event.target.value as JobDraft['modality'] })}>
              {JOB_MODALITIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-ink">
            Jornada
            <select className={fieldClass} value={draft.schedule} onChange={(event) => update({ schedule: event.target.value as JobDraft['schedule'] })}>
              {JOB_SCHEDULES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-semibold text-ink">
          Experiencia
          <select className={fieldClass} value={draft.experienceLevel} onChange={(event) => update({ experienceLevel: event.target.value as JobDraft['experienceLevel'] })}>
            {JOB_EXPERIENCE.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink">
          Ciudad / ubicación
          <input className={fieldClass} value={draft.location} onChange={(event) => update({ location: event.target.value })} required />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Fecha límite
          <input type="date" className={fieldClass} value={draft.deadline} onChange={(event) => update({ deadline: event.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Link de postulación
          <input className={fieldClass} value={draft.applicationUrl} onChange={(event) => update({ applicationUrl: event.target.value })} placeholder="https://" required />
        </label>
      </fieldset>

      {requireAuthorization && (
        <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-ink">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-secondary"
            checked={authorized}
            onChange={(event) => setAuthorized(event.target.checked)}
            required
          />
          Confirmo que la información entregada es correcta y autorizo a FEUC a publicar esta oportunidad.
        </label>
      )}

      {error && <p className="text-sm font-medium text-coral">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        {submitLabel}
      </button>
    </form>
  )
}
