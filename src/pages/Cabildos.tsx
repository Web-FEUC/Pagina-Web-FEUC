const INFORME_URL = '/informes/informe-cabildos-feuc-2026.html'

export default function Cabildos() {
  return (
    <section className="py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tu voz construye Chile</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Informe Aprobado · Cabildos FEUC 2026</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          Informe metodológico y de sistematización territorial sobre el Proyecto de Ley de
          Reconstrucción Nacional. Documento oficial aprobado, destinado a la deliberación
          institucional y al uso público.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Estado</p>
          <p className="mt-2 text-2xl font-semibold text-ink">Aprobado</p>
          <p className="mt-1 text-sm text-slate-600">Versión oficial para uso público</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Corpus</p>
          <p className="mt-2 text-2xl font-semibold text-ink">22</p>
          <p className="mt-1 text-sm text-slate-600">Registros territoriales sistematizados</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Método</p>
          <p className="mt-2 text-lg font-semibold text-ink">Cualitativo territorial</p>
          <p className="mt-1 text-sm text-slate-600">Recurrencia, intensidad y trazabilidad</p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <a
          href={INFORME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary"
        >
          Abrir informe aprobado
          <span aria-hidden>→</span>
        </a>
        <a
          href={INFORME_URL}
          download="Informe-Aprobado-Cabildos-FEUC-2026.html"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          Descargar HTML
        </a>
      </div>

      <div className="overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-ink">Vista previa del informe aprobado</p>
          <a
            href={INFORME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Pantalla completa →
          </a>
        </div>
        <iframe
          title="Informe Aprobado Cabildos FEUC 2026"
          src={INFORME_URL}
          className="h-[75vh] w-full bg-slate-100"
        />
      </div>
    </section>
  )
}
