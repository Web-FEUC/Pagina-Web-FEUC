import { tramitesPropuesta } from '../../data/subrepresentacion'

export default function ProcessTimeline() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-xl font-semibold text-ink">Tramitación de la propuesta</h3>
      <p className="mt-2 text-sm text-slate-600">
        Etapas previstas. Ninguna aparece marcada como aprobada porque el proceso aún no ha ocurrido.
      </p>
      <ol className="mt-6 space-y-0 sm:flex sm:items-stretch sm:gap-0 sm:space-y-0">
        {tramitesPropuesta.map((paso, index) => (
          <li key={paso} className="relative flex gap-3 sm:flex-1 sm:flex-col sm:gap-0">
            <div className="flex flex-col items-center sm:flex-row sm:items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-white text-xs font-semibold text-secondary">
                {index + 1}
              </span>
              {index < tramitesPropuesta.length - 1 && (
                <span
                  className="mt-1 h-full w-px flex-1 bg-slate-200 sm:mt-0 sm:h-px sm:w-full"
                  aria-hidden
                />
              )}
            </div>
            <p className="pb-6 text-sm leading-snug text-slate-700 sm:mt-3 sm:pb-0 sm:pr-3">{paso}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
