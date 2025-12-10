export default function Actas() {
  return (
    <section className="py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Transparencia</p>
        <h2 className="text-2xl font-semibold text-ink">Actas del Consejo</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sesiones abiertas y actas públicas del Consejo de Federación y Consejo Ejecutivo.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <a
          href="https://uccl0-my.sharepoint.com/:f:/r/personal/antonia_rebolledo_uc_cl/Documents/CONSEJOS/COFEUC?csf=1&web=1&e=S22eHl"
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl bg-white p-8 shadow-card transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-ink">Consejo FEUC</h3>
          <p className="mt-2 text-sm text-slate-600">
            Accede a las actas y documentos del Consejo de Federación.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3">
            Abrir enlace →
          </span>
        </a>

        <a
          href="https://uccl0-my.sharepoint.com/:f:/r/personal/antonia_rebolledo_uc_cl/Documents/CONSEJOS/EJECUTIVO?csf=1&web=1&e=AStkpY"
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl bg-white p-8 shadow-card transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-ink">Consejo Ejecutivo</h3>
          <p className="mt-2 text-sm text-slate-600">
            Accede a las actas y documentos del Consejo Ejecutivo.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3">
            Abrir enlace →
          </span>
        </a>
      </div>
    </section>
  )
}

