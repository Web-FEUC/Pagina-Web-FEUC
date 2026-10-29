import { BLOQUE_ESTUDIANTES, formatMiles, tramosVoto } from '../../data/subrepresentacion'

const puntos = [
  'Cada territorio mantiene un voto base.',
  `Se agrega un voto por cada bloque completo de ${formatMiles(BLOQUE_ESTUDIANTES)} estudiantes.`,
  'Solo se aplica en votaciones ponderadas del artículo 17.',
  'No cambia las votaciones ordinarias del Consejo de Federación.',
  'Ningún territorio pierde votos.',
]

export default function MechanismSection() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-xl font-semibold text-ink">Cómo funciona el mecanismo</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        La propuesta no modifica la distribución de Consejeros Ejecutivos ni CT. El cambio aplica
        únicamente a los votos de los Consejos de Presidencias cuando se activa una votación
        ponderada.
      </p>
      <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 font-mono text-sm text-ink">
        votosPonderados = 1 + Math.floor(matricula / {formatMiles(BLOQUE_ESTUDIANTES)})
      </p>
      <ul className="mt-5 space-y-2">
        {puntos.map((punto) => (
          <li key={punto} className="flex gap-2 text-sm text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
            <span>{punto}</span>
          </li>
        ))}
      </ul>

      <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-primary">Escala de tramos</h4>
      <ol className="mt-4 grid gap-2 sm:grid-cols-5">
        {tramosVoto.map((tramo) => (
          <li
            key={tramo.rango}
            className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 px-3 py-4 text-center"
          >
            <span className="text-2xl font-semibold tabular-nums text-secondary">{tramo.votos}</span>
            <span className="mt-1 text-[11px] font-medium leading-snug text-slate-600">
              {tramo.votos === 1 ? 'voto' : 'votos'}
            </span>
            <span className="mt-2 text-xs leading-snug text-slate-500">{tramo.rango}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
