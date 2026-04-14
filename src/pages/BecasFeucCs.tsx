export default function BecasFeucCs() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Consejeria Superior</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Becas FEUC - CS</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          Revisa las bases oficiales y completa tu postulacion en los enlaces habilitados.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a
            href="https://drive.google.com/file/d/1qse9QU2pDLFwtuWpXHBxsUkajkQ3kJ2e/view?pli=1"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-primary/35 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Documento oficial</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Bases Becas FEUC - CS</h2>
            <p className="mt-2 text-sm text-slate-600">Accede al documento completo con requisitos y condiciones.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3">
              Ver bases →
            </span>
          </a>

          <a
            href="https://forms.cloud.microsoft/pages/responsepage.aspx?id=-tn1Xz_4wUqk0utI6goA0lCJk9XRq99MnIleTlerUzhUMjRXVkNFNTU0OUdXUEFFQzc4TkIwWU1UUi4u&route=shorturl"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-primary/35 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Formulario</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Postulacion a Becas FEUC - CS</h2>
            <p className="mt-2 text-sm text-slate-600">Completa el formulario para realizar tu postulacion.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3">
              Ir a postulacion →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
