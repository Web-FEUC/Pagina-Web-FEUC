import { Link } from 'react-router-dom'
import { directiva } from '../data/constants'

const beneficios = [
  {
    title: 'Descuento Flixbus',
    description: 'Descuentos especiales para estudiantes UC en viajes en bus.',
    link: 'https://www.hiphiphour.com/77ae13c817cbc332e855',
    icon: '🚌',
  },
  {
    title: 'Becas FEUC',
    description: 'Becas de alimentación, materiales y apoyo económico.',
    link: '/becas-feuc-cs',
    icon: '💰',
  },
  {
    title: 'Descuentos culturales',
    description: 'Acceso preferencial a eventos culturales y deportivos.',
    link: '#',
    icon: '🎭',
  },
  {
    title: 'Apoyo académico',
    description: 'Recursos y acompañamiento para tu vida universitaria.',
    link: '#',
    icon: '📚',
  },
]

export default function Home() {
  return (
    <>
      <section
        className="relative isolate min-h-[50vh] overflow-hidden rounded-3xl bg-cover bg-center shadow-card"
        style={{ backgroundImage: 'url(/casa-central-universidad.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/70 via-primary/45 to-coral/40" />
        <div className="absolute inset-0 bg-black/12 mix-blend-multiply" />
        <div className="relative flex min-h-[50vh] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 rounded-2xl bg-white/95 p-3 shadow-xl">
            <img
              src="/assets/logo_feuc_nuevo.svg"
              alt="Logo FEUC"
              className="h-14 w-auto md:h-20"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg md:text-3xl">
            Federación de Estudiantes de la<br />
            Pontificia Universidad Católica de Chile
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Directiva FEUC 2026</p>
            <h2 className="text-2xl font-semibold text-ink">Directiva FEUC</h2>
            <p className="text-sm text-slate-600">Representación electa por votación universal de estudiantes.</p>
          </div>
          <Link to="/representacion" className="text-sm font-semibold text-primary hover:underline">
            Ver representación completa
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
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

      <section className="py-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Beneficios FEUC</p>
          <h2 className="text-2xl font-semibold text-ink">Beneficios y descuentos para estudiantes</h2>
          <p className="mt-2 text-sm text-slate-600">
            Accede a descuentos, becas y beneficios exclusivos para estudiantes UC.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {beneficios.map((beneficio) => (
            <a
              key={beneficio.title}
              href={beneficio.link}
              target={beneficio.link.startsWith('http') ? '_blank' : undefined}
              rel={beneficio.link.startsWith('http') ? 'noreferrer' : undefined}
              className="group rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">{beneficio.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-ink">{beneficio.title}</h3>
              <p className="text-sm text-slate-600">{beneficio.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3">
                Ver más →
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

