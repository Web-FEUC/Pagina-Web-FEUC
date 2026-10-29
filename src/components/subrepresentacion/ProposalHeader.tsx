export default function ProposalHeader() {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Subrepresentación</p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        Propuesta de voto ponderado según matrícula territorial
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
        Una propuesta para reducir la subrepresentación de los territorios con mayor matrícula, sin
        modificar la cantidad ni la distribución de sus Consejeros Ejecutivos.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
          Propuesta de la Comisión de Subrepresentación
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Padrón FEUC 2027
        </span>
      </div>
    </header>
  )
}
