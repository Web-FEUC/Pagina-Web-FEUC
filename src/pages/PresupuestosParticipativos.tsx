const BASES_URL =
  'https://uccl0-my.sharepoint.com/:f:/g/personal/juan_aguero_uc_cl/IgAxzpEg7N0AQoqiFKuyJX7IAT1v91ortleNLisWkKkhsMI?e=wmPreE'
const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf6UzEjoLjTJyFTAYNcmndOl9nxY9ZtGWcdP8SbizlLXCj68g/viewform'

export default function PresupuestosParticipativos() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Convocatoria 2027</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Presupuestos participativos</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          La FEUC invita a estudiantes de pregrado representados por la Federación a presentar
          proyectos que aborden problemáticas de la comunidad universitaria. Revisa primero el
          reglamento y las bases, y luego completa el formulario de inscripción.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          El fondo disponible es de $8.193.551. Completar el formulario debe complementarse con el
          envío de los documentos requeridos a{' '}
          <a className="font-semibold text-primary hover:underline" href="mailto:feuc.chile+pp@gmail.com">
            feuc.chile+pp@gmail.com
          </a>
          .
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a
            href={BASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-primary/35 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Documentos oficiales</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Reglamento y bases</h2>
            <p className="mt-2 text-sm text-slate-600">
              Lee las bases de Presupuestos Participativos 2027 y el reglamento antes de postular.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3">
              Leer reglamento y bases →
            </span>
          </a>

          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-primary/35 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Formulario</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Inscripción</h2>
            <p className="mt-2 text-sm text-slate-600">
              Completa el formulario de postulación. Este envío no sustituye la documentación por correo.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3">
              Ir al formulario →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
