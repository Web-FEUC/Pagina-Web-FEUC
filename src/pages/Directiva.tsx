import { Link } from 'react-router-dom'
import { directiva } from '../data/constants'

export default function Directiva() {
  return (
    <section className="py-8 md:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Directiva FEUC 2026</p>
          <h2 className="text-xl md:text-2xl font-semibold text-ink">Directiva FEUC</h2>
          <p className="text-sm text-slate-600">Representación electa por votación universal de estudiantes.</p>
        </div>
        <Link to="/representacion" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
          Ver representación completa
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {directiva.map((member) => (
          <div key={member.name} className="overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-64 w-full overflow-hidden bg-slate-100">
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
            </div>
            <div className="space-y-1 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{member.role}</p>
              <p className="text-lg font-semibold text-ink">{member.name}</p>
              <p className="text-sm text-slate-600">{member.area}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

