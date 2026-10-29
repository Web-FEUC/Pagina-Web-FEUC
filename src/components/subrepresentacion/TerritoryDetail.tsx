import { composicionSalud, formatMiles, territoriosBeneficiados } from '../../data/subrepresentacion'

export default function TerritoryDetail() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-xl font-semibold text-ink">Detalle de los territorios beneficiados</h3>
      <p className="mt-2 text-sm text-slate-600">
        Cinco territorios reciben votos adicionales. Ingeniería destaca al pasar de 1 a 3 votos.
      </p>

      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              <th className="py-3 pr-4">Territorio</th>
              <th className="py-3 pr-4">Matrícula</th>
              <th className="py-3 pr-4">Votos actuales</th>
              <th className="py-3 pr-4">Votos propuestos</th>
              <th className="py-3">Cambio</th>
            </tr>
          </thead>
          <tbody>
            {territoriosBeneficiados.map((territorio) => {
              const destacado = territorio.cambio >= 2
              return (
                <tr
                  key={territorio.territorio}
                  className={`border-b border-slate-100 ${destacado ? 'bg-primary/10' : ''}`}
                >
                  <td className="py-3 pr-4 font-semibold text-ink">{territorio.territorio}</td>
                  <td className="py-3 pr-4 tabular-nums text-slate-700">{formatMiles(territorio.estudiantes)}</td>
                  <td className="py-3 pr-4 tabular-nums text-slate-700">{territorio.votosActuales}</td>
                  <td className="py-3 pr-4 tabular-nums font-semibold text-secondary">
                    {territorio.votosPropuestos}
                  </td>
                  <td className="py-3 font-semibold tabular-nums text-secondary">+{territorio.cambio}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 space-y-3 md:hidden">
        {territoriosBeneficiados.map((territorio) => {
          const destacado = territorio.cambio >= 2
          return (
            <li
              key={territorio.territorio}
              className={`rounded-2xl border px-4 py-4 ${
                destacado ? 'border-primary/40 bg-primary/10' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <p className="font-semibold text-ink">{territorio.territorio}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Matrícula</dt>
                  <dd className="font-medium tabular-nums text-ink">{formatMiles(territorio.estudiantes)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Cambio</dt>
                  <dd className="font-semibold tabular-nums text-secondary">+{territorio.cambio}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Actuales</dt>
                  <dd className="tabular-nums text-ink">{territorio.votosActuales}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Propuestos</dt>
                  <dd className="font-semibold tabular-nums text-secondary">{territorio.votosPropuestos}</dd>
                </div>
              </dl>
            </li>
          )
        })}
      </ul>

      <details className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          Composición de Ciencias de la Salud ({formatMiles(2181)} estudiantes)
        </summary>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          {composicionSalud.map((item) => (
            <li key={item.carrera} className="flex justify-between gap-3">
              <span>{item.carrera}</span>
              <span className="tabular-nums">{formatMiles(item.estudiantes)}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}
