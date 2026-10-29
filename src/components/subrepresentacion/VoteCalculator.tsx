import { useMemo, useState } from 'react'
import {
  BLOQUE_ESTUDIANTES,
  ejemplosCalculadora,
  formatMiles,
  votosPonderados,
} from '../../data/subrepresentacion'

export default function VoteCalculator() {
  const [matricula, setMatricula] = useState(5037)
  const result = useMemo(() => votosPonderados(matricula), [matricula])

  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-xl font-semibold text-ink">Calculadora de votos ponderados</h3>
      <p className="mt-2 text-sm text-slate-600">
        Ingresa una matrícula (0 a 10.000) para ver cuántos votos corresponderían con la regla
        propuesta.
      </p>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-ink">Matrícula del territorio</span>
        <input
          type="range"
          min={0}
          max={10000}
          step={50}
          value={matricula}
          onChange={(event) => setMatricula(Number(event.target.value))}
          className="mt-3 w-full accent-secondary"
          aria-valuemin={0}
          aria-valuemax={10000}
          aria-valuenow={matricula}
          aria-label="Matrícula del territorio"
        />
        <input
          type="number"
          min={0}
          max={10000}
          value={matricula}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (Number.isNaN(next)) return
            setMatricula(Math.min(10000, Math.max(0, next)))
          }}
          className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm tabular-nums outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
        />
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Voto base</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{result.votoBase}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Adicionales</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
            +{result.votosAdicionales}
          </p>
        </div>
        <div className="rounded-2xl bg-primary/20 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">Total</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-secondary">
            {result.votosTotales}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Fórmula: 1 + floor({formatMiles(result.matricula)} / {formatMiles(BLOQUE_ESTUDIANTES)}) ={' '}
        {result.votosTotales}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {ejemplosCalculadora.map((ejemplo) => {
          const ejemploResult = votosPonderados(ejemplo.matricula)
          return (
            <button
              key={ejemplo.matricula}
              type="button"
              onClick={() => setMatricula(ejemplo.matricula)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                matricula === ejemplo.matricula
                  ? 'bg-secondary text-white'
                  : 'border border-slate-200 bg-white text-slate-700'
              }`}
            >
              {ejemplo.label} → {ejemploResult.votosTotales}{' '}
              {ejemploResult.votosTotales === 1 ? 'voto' : 'votos'}
            </button>
          )
        })}
      </div>
    </section>
  )
}
