import { useState } from 'react'
import SubrepresentacionProposal from '../components/subrepresentacion/SubrepresentacionProposal'
import { territories, movements, consejoEjecutivo } from '../data/constants'
import { usePageMeta } from '../lib/usePageMeta'

export default function Representacion() {
  const [expandedTerritories, setExpandedTerritories] = useState<Set<string>>(new Set())

  usePageMeta(
    'Representación y subrepresentación | FEUC',
    'Territorios, consejerías y la propuesta de voto ponderado según matrícula territorial.',
  )

  const toggleTerritory = (territoryName: string) => {
    setExpandedTerritories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(territoryName)) {
        newSet.delete(territoryName)
      } else {
        newSet.add(territoryName)
      }
      return newSet
    })
  }

  const generateLinePoints = () => {
    const points: Array<{ color: string; movement: string }> = []
    consejoEjecutivo.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        points.push({ color: group.color, movement: group.movement })
      }
    })
    return points
  }

  const linePoints = generateLinePoints()
  const totalCount = linePoints.length

  return (
    <section className="py-12">
      <SubrepresentacionProposal />

      <div className="mt-14 border-t border-slate-200 pt-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Representación</p>
          <h2 className="text-2xl font-semibold text-ink">Territorios y Representantes</h2>
          <p className="mt-2 text-sm text-slate-600">
            En representación, cada carrera pertenece a un Territorio. De esta manera, en cada Territorio
            están los Centros de Estudiantes de las carreras que lo componen y un determinado número de
            Consejerías Territoriales (CT&apos;s), dependiendo del número de estudiantes totales que hay
            en el Territorio.
          </p>
        </div>

        <div className="mb-10 rounded-3xl bg-white p-8 shadow-card">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-ink">Consejo Ejecutivo</h2>
            <p className="mt-2 text-sm text-slate-600">
              El Consejo Ejecutivo está compuesto por las Consejerías Territoriales (CT&apos;s) de todos
              los territorios.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative">
              <div className="relative w-full overflow-hidden rounded-2xl bg-slate-50 p-6">
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {linePoints.map((point, index) => (
                    <div
                      key={index}
                      className="h-3 w-3 rounded-full transition-all hover:scale-125 hover:shadow-md"
                      style={{ backgroundColor: point.color }}
                      title={point.movement}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="text-sm font-semibold text-slate-600">Consejeros Territoriales</div>
                <div className="text-5xl font-bold text-ink">{totalCount}</div>
              </div>
            </div>

            <div>
              <p className="mb-4 text-sm font-semibold text-primary">Composición del Consejo</p>
              <div className="space-y-3">
                {consejoEjecutivo.map((group) => (
                  <div key={group.movement} className="flex items-center gap-3">
                    {group.logo ? (
                      <img src={group.logo} alt={group.movement} className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded" style={{ backgroundColor: group.color }} />
                    )}
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-ink">{group.count}</span>
                      <span className="ml-2 text-sm text-slate-700">{group.movement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {territories.map((territory) => {
            const isExpanded = expandedTerritories.has(territory.name)
            return (
              <div key={territory.name} className="overflow-hidden rounded-2xl bg-white shadow-card transition">
                <button
                  type="button"
                  onClick={() => toggleTerritory(territory.name)}
                  className="flex w-full items-center justify-between p-6 text-left transition hover:bg-slate-50"
                >
                  <h3 className="text-lg font-semibold text-ink">{territory.name}</h3>
                  <svg
                    className={`h-5 w-5 text-primary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-slate-100 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-3 text-sm font-semibold text-primary">Centros de Estudiantes</p>
                        <ul className="space-y-2">
                          {territory.centers.map((center, idx) => (
                            <li key={idx} className="text-sm text-slate-700">
                              <span className="font-medium">{center.name}</span>
                              {center.president && (
                                <span className="mt-0.5 block text-xs text-slate-600">
                                  Presidente: {center.president}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-3 text-sm font-semibold text-primary">Consejerías Territoriales</p>
                        <ul className="space-y-1">
                          {territory.counselors.map((counselor, idx) => (
                            <li key={idx} className="text-sm text-slate-700">
                              {counselor.name} <span className="text-primary">({counselor.movement})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-card">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Movimientos y Pactos</p>
            <h3 className="text-xl font-semibold text-ink">Participa en los movimientos universitarios</h3>
            <p className="mt-2 text-sm text-slate-600">
              En la UC hay diferentes movimientos o partidos políticos en los que puedes participar. Te
              invitamos a conocerlos a través de sus Instagrams.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
            {movements.map((movement) => (
              <a
                key={movement.name}
                href={movement.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:border-primary hover:bg-primary/5"
              >
                {movement.logo && (
                  <img src={movement.logo} alt={movement.name} className="h-16 w-16 rounded-lg object-cover" />
                )}
                <p className="text-sm font-semibold text-ink">{movement.name}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
