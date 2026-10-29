import { useState } from 'react'
import { articulosEstatutarios } from '../../data/subrepresentacion'

export default function StatutesAccordion() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-xl font-semibold text-ink">¿Qué artículos se modificarían?</h3>
      <p className="mt-2 text-sm text-slate-600">
        Resumen de los cambios estatutarios asociados a la propuesta. Expande cada ítem para leer el
        detalle.
      </p>
      <div className="mt-5 space-y-3">
        {articulosEstatutarios.map((articulo) => {
          const open = openId === articulo.id
          return (
            <div key={articulo.id} className="overflow-hidden rounded-2xl border border-slate-100">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : articulo.id)}
              >
                <span className="text-sm font-semibold text-ink">{articulo.titulo}</span>
                <span className="text-lg leading-none text-slate-400" aria-hidden>
                  {open ? '–' : '+'}
                </span>
              </button>
              {open && (
                <div className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">
                  {articulo.resumen}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
