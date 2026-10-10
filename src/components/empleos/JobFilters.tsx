import {
  JOB_AREAS,
  JOB_CAREERS,
  JOB_EXPERIENCE,
  JOB_MODALITIES,
  JOB_TYPES,
  type JobArea,
  type JobCareer,
  type JobExperience,
  type JobModality,
  type JobType,
} from '../../data/empleos'

export interface JobFilterState {
  query: string
  type: JobType | ''
  area: JobArea | ''
  career: JobCareer | '' | '__open__'
  modality: JobModality | ''
  experience: JobExperience | ''
  sort: 'recent' | 'closing'
}

export const emptyFilters: JobFilterState = {
  query: '',
  type: '',
  area: '',
  career: '',
  modality: '',
  experience: '',
  sort: 'recent',
}

interface JobFiltersProps {
  value: JobFilterState
  onChange: (next: JobFilterState) => void
  onClear: () => void
}

const selectClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10'

export default function JobFilters({ value, onChange, onClear }: JobFiltersProps) {
  const update = (patch: Partial<JobFilterState>) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-ink">
        Tipo de oportunidad
        <select
          className={`${selectClass} mt-2`}
          value={value.type}
          onChange={(event) => update({ type: event.target.value as JobType | '' })}
        >
          <option value="">Todos</option>
          {JOB_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-ink">
        Área
        <select
          className={`${selectClass} mt-2`}
          value={value.area}
          onChange={(event) => update({ area: event.target.value as JobArea | '' })}
        >
          <option value="">Todas</option>
          {JOB_AREAS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-ink">
        Carrera
        <select
          className={`${selectClass} mt-2`}
          value={value.career}
          onChange={(event) => update({ career: event.target.value as JobFilterState['career'] })}
        >
          <option value="">Todas</option>
          <option value="__open__">Abierto a todas las carreras</option>
          {JOB_CAREERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-ink">
        Modalidad
        <select
          className={`${selectClass} mt-2`}
          value={value.modality}
          onChange={(event) => update({ modality: event.target.value as JobModality | '' })}
        >
          <option value="">Todas</option>
          {JOB_MODALITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-ink">
        Experiencia
        <select
          className={`${selectClass} mt-2`}
          value={value.experience}
          onChange={(event) => update({ experience: event.target.value as JobExperience | '' })}
        >
          <option value="">Todas</option>
          {JOB_EXPERIENCE.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-ink">
        Ordenar por
        <select
          className={`${selectClass} mt-2`}
          value={value.sort}
          onChange={(event) => update({ sort: event.target.value as JobFilterState['sort'] })}
        >
          <option value="recent">Más recientes</option>
          <option value="closing">Próximas a cerrar</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
