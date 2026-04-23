import { Link } from 'react-router-dom'

export default function Transparencia() {
  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Transparencia</p>
          <h2 className="text-2xl font-semibold text-ink">Información pública y rendición de cuentas</h2>
          <p className="text-sm text-slate-600">Actas, documentos y recursos públicos de la FEUC.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink">Actas del Consejo</h3>
          <p className="mt-2 text-sm text-slate-600">Sesiones abiertas y actas públicas del Consejo de Federación.</p>
          <Link to="/actas" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">
            Ver actas →
          </Link>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.761 0-5 2.239-5 5v5h10v-5c0-2.761-2.239-5-5-5zM9 8V6a3 3 0 116 0v2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink">Becas FEUC - CS</h3>
          <p className="mt-2 text-sm text-slate-600">Bases y formulario de postulacion para las becas FEUC - CS.</p>
          <Link to="/becas-feuc-cs" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">
            Ir a becas →
          </Link>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink">Rendición de cuentas</h3>
          <p className="mt-2 text-sm text-slate-600">Informes mensuales y rendiciones financieras públicas.</p>
          <a href="https://uccl0.sharepoint.com/:x:/s/uc365_FEUC2026/IQCd-C1OrGXvSZU396nlVm7YATUle2OTYHXnUuy-UfDWBJs?e=R0Ph1k" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">
            Ver informes →
          </a>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink">Estatutos y documentos</h3>
          <p className="mt-2 text-sm text-slate-600">Estatutos FEUC, reglamentos y documentos oficiales.</p>
          <a href="https://uccl0.sharepoint.com/:b:/s/uc365_FEUC2026/IQAVRtHbLjLzToViYXyvKydoAfd6UYuUkBBPfpmf-5Q42EE?e=JMc7nZ" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">
            Ver documentos →
          </a>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink">Comisión de sub representación</h3>
          <p className="mt-2 text-sm text-slate-600">Documentos oficiales de la Comisión de Subrepresentación.</p>
          <a href="https://uccl0.sharepoint.com/:f:/s/uc365_ComisinSub-Representacin/IgBBC-Tgd2mnT5Q0G8ASyKTyAVBibeYaGPQiqTzrJhyXnNY?e=Zl5Lev" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">
            Ir a comisión →
          </a>
        </div>
      </div>
    </section>
  )
}

