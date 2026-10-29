import { formatMiles, resumenPropuesta } from '../../data/subrepresentacion'

const cards = [
  {
    label: 'Consejeros Ejecutivos',
    actual: resumenPropuesta.consejerosEjecutivos.actual,
    propuesto: resumenPropuesta.consejerosEjecutivos.propuesto,
    note: 'Sin cambios',
    highlight: false,
  },
  {
    label: 'Votos territoriales ordinarios',
    actual: resumenPropuesta.votosOrdinarios.actual,
    propuesto: resumenPropuesta.votosOrdinarios.propuesto,
    note: 'Sin cambios',
    highlight: false,
  },
  {
    label: 'Votos de Consejos de Presidencias',
    actual: resumenPropuesta.votosConsejosPresidencias.actual,
    propuesto: resumenPropuesta.votosConsejosPresidencias.propuesto,
    note: '6 votos adicionales',
    highlight: true,
  },
  {
    label: 'Total territorial en votaciones ponderadas',
    actual: resumenPropuesta.votosPonderadosTerritoriales.actual,
    propuesto: resumenPropuesta.votosPonderadosTerritoriales.propuesto,
    note: 'Aumento de representación',
    highlight: true,
  },
] as const

export default function SummaryCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const cambia = card.actual !== card.propuesto
        return (
          <article
            key={card.label}
            className={`rounded-2xl bg-white p-5 shadow-card ${
              card.highlight ? 'ring-1 ring-primary/40' : ''
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">{card.label}</p>
            <p className="mt-3 flex flex-wrap items-baseline gap-2 text-ink">
              <span className={`text-2xl font-semibold tabular-nums ${cambia ? 'text-slate-400' : 'text-ink'}`}>
                {formatMiles(card.actual)}
              </span>
              <span className="text-slate-400" aria-hidden>
                →
              </span>
              <span
                className={`text-2xl font-semibold tabular-nums ${
                  cambia ? 'text-secondary' : 'text-ink'
                }`}
              >
                {formatMiles(card.propuesto)}
              </span>
            </p>
            <p className={`mt-2 text-sm ${cambia ? 'font-medium text-secondary' : 'text-slate-500'}`}>
              {card.note}
            </p>
          </article>
        )
      })}
    </div>
  )
}
