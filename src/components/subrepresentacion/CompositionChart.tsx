import { formatMiles, resumenPropuesta } from '../../data/subrepresentacion'

const COLOR_CT = '#053333'
const COLOR_CP = '#8DE09C'

type Escenario = {
  label: string
  ct: number
  cp: number
  total: number
}

const escenarios: Escenario[] = [
  {
    label: 'Situación actual',
    ct: resumenPropuesta.consejerosEjecutivos.actual,
    cp: resumenPropuesta.votosConsejosPresidencias.actual,
    total: resumenPropuesta.votosPonderadosTerritoriales.actual,
  },
  {
    label: 'Con la propuesta',
    ct: resumenPropuesta.consejerosEjecutivos.propuesto,
    cp: resumenPropuesta.votosConsejosPresidencias.propuesto,
    total: resumenPropuesta.votosPonderadosTerritoriales.propuesto,
  },
]

export default function CompositionChart() {
  const maxTotal = Math.max(...escenarios.map((e) => e.total))

  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8" aria-labelledby="chart-composicion-title">
      <h3 id="chart-composicion-title" className="text-xl font-semibold text-ink">
        Composición de la votación ponderada
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Los Consejeros Ejecutivos se mantienen. Todo el aumento proviene de los Consejos de Presidencias.
      </p>

      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLOR_CT }} aria-hidden />
          Consejeros Ejecutivos
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLOR_CP }} aria-hidden />
          Consejos de Presidencias
        </span>
      </div>

      <ul className="mt-6 space-y-6">
        {escenarios.map((escenario) => {
          const ctPct = (escenario.ct / maxTotal) * 100
          const cpPct = (escenario.cp / maxTotal) * 100
          return (
            <li key={escenario.label}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{escenario.label}</p>
                <p className="text-sm font-semibold tabular-nums text-ink">
                  Total {formatMiles(escenario.total)}
                </p>
              </div>
              <div
                className="mt-2 flex h-8 overflow-hidden rounded-full bg-slate-100"
                role="img"
                aria-label={`${escenario.label}: ${escenario.ct} votos de Consejeros Ejecutivos y ${escenario.cp} de Consejos de Presidencias`}
              >
                <div
                  className="flex items-center justify-center text-[11px] font-semibold text-white transition-[width] duration-700 motion-reduce:transition-none"
                  style={{ width: `${ctPct}%`, backgroundColor: COLOR_CT }}
                >
                  <span className="px-2">{formatMiles(escenario.ct)}</span>
                </div>
                <div
                  className="flex items-center justify-center text-[11px] font-semibold text-secondary transition-[width] duration-700 motion-reduce:transition-none"
                  style={{ width: `${cpPct}%`, backgroundColor: COLOR_CP }}
                >
                  <span className="px-2">{formatMiles(escenario.cp)}</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {formatMiles(escenario.ct)} CT · {formatMiles(escenario.cp)} Consejos de Presidencias
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
