import { formatMiles, resumenPropuesta } from '../../data/subrepresentacion'

const conclusiones = [
  `${formatMiles(resumenPropuesta.consejerosEjecutivos.actual)} Consejeros Ejecutivos: sin cambios.`,
  `${formatMiles(resumenPropuesta.votosOrdinarios.actual)} votos territoriales ordinarios: sin cambios.`,
  `${formatMiles(resumenPropuesta.votosPonderadosTerritoriales.actual)} → ${formatMiles(resumenPropuesta.votosPonderadosTerritoriales.propuesto)} votos territoriales ponderados.`,
]

export default function ClosingCard() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-white via-white to-primary/20 p-6 shadow-card sm:p-8">
      <h3 className="text-xl font-semibold text-ink">¿Qué cambiaría?</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
        Cinco territorios aumentarían su representación en las votaciones ponderadas. Se agregarían
        seis votos, ningún territorio perdería representación y las votaciones ordinarias seguirían
        funcionando de la misma manera.
      </p>
      <ul className="mt-5 space-y-2">
        {conclusiones.map((item) => (
          <li key={item} className="flex gap-2 text-sm font-medium text-ink">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
