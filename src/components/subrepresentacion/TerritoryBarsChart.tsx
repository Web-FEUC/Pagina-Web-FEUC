import { formatMiles, territoriosBeneficiados } from '../../data/subrepresentacion'

const COLOR_ACTUAL = '#94a3b8'
const COLOR_PROPUESTO = '#053333'

export default function TerritoryBarsChart() {
  const maxVotos = Math.max(...territoriosBeneficiados.map((t) => t.votosPropuestos))

  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8" aria-labelledby="chart-territorios-title">
      <h3 id="chart-territorios-title" className="text-xl font-semibold text-ink">
        Comparación por territorio beneficiado
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Votos actuales frente a votos propuestos en votaciones ponderadas, ordenados por matrícula.
      </p>

      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLOR_ACTUAL }} aria-hidden />
          Actual
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLOR_PROPUESTO }} aria-hidden />
          Propuesto
        </span>
      </div>

      <ul className="mt-6 space-y-5" role="list">
        {territoriosBeneficiados.map((territorio) => {
          const actualPct = (territorio.votosActuales / maxVotos) * 100
          const propuestoPct = (territorio.votosPropuestos / maxVotos) * 100
          return (
            <li key={territorio.territorio}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{territorio.territorio}</p>
                <p className="text-xs text-slate-500">
                  Matrícula: {formatMiles(territorio.estudiantes)} · {territorio.votosActuales} →{' '}
                  {territorio.votosPropuestos} votos (+{territorio.cambio})
                </p>
              </div>
              <div className="mt-2 space-y-1.5" role="img" aria-label={`${territorio.territorio}: ${territorio.votosActuales} votos actuales, ${territorio.votosPropuestos} propuestos`}>
                <div className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[11px] font-medium text-slate-500">Actual</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
                      style={{ width: `${actualPct}%`, backgroundColor: COLOR_ACTUAL }}
                    />
                  </div>
                  <span className="w-4 text-right text-xs font-semibold tabular-nums text-slate-600">
                    {territorio.votosActuales}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[11px] font-medium text-secondary">Propuesto</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
                      style={{ width: `${propuestoPct}%`, backgroundColor: COLOR_PROPUESTO }}
                    />
                  </div>
                  <span className="w-4 text-right text-xs font-semibold tabular-nums text-secondary">
                    {territorio.votosPropuestos}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
