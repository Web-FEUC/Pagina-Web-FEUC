export default function Privacidad() {
  return (
    <section className="py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Política de privacidad</p>
        <h2 className="text-2xl font-semibold text-ink">Política de Protección de Datos FEUC</h2>
        <p className="mt-2 text-sm text-slate-600">
          Esta Política de Privacidad describe la forma en que la Federación de Estudiantes Universidad Católica de Chile, 
          en adelante FEUC, realiza el tratamiento de los datos personales tanto de los estudiantes UC como de otras personas 
          con las cuales la FEUC interactúa.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-3 text-lg font-semibold text-ink">¿En qué proceso recolectamos tus datos personales?</h3>
          <div className="space-y-3 text-sm text-slate-700">
            <p><strong>Del titular:</strong> Los datos son captados directamente del titular mediante formularios incluidos en su página web o redes sociales. También hay datos personales captados directamente del titular en algunos de los campus de la Universidad.</p>
            <p><strong>De terceros:</strong> La Universidad entrega un listado de estudiantes a la FEUC a través de la Dirección de Asuntos Estudiantiles para los procesos de votación.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-3 text-lg font-semibold text-ink">¿Quién trata los datos personales?</h3>
          <p className="text-sm text-slate-700">La FEUC es la entidad responsable del tratamiento de los datos personales.</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-3 text-lg font-semibold text-ink">¿Cuál es la finalidad del tratamiento de tus datos personales?</h3>
          <div className="space-y-3 text-sm text-slate-700">
            <p>La FEUC tiene la finalidad de representar y de hacer partícipe al alumnado de la Universidad y para esto se realiza un proceso de votación anual. La FEUC solicitará a los estudiantes mostrar su TUC o cédula de identidad para identificar a los estudiantes por territorios, unidad académica y hacer válida su votación.</p>
            <p>La FEUC genera espacios de convivencia, de vida universitaria, de encuentros, debates, eventos. Para esto, solicitará datos personales como nombres, apellidos, número de cédula identidad, correo electrónico, número de teléfono, domicilio para poder contactarse e identificar a la persona y enviar invitaciones o descuentos.</p>
            <p>Para el otorgamiento de becas a estudiantes, como: beca de alimentación, beca de gastos complementarios, beca de materiales o la beca de vía de admisión de equidad. La FEUC solicita los siguientes datos personales para identificar a la persona: nombres, apellidos, número de cédula de identidad o número de estudiante. Datos de contacto, correo electrónico y número de teléfono. Dato bancario, número de cuenta bancaria para hacer depósito de la beca en caso de que sea beneficiario/a.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-3 text-lg font-semibold text-ink">¿Quién tiene acceso a tus datos personales?</h3>
          <div className="space-y-2 text-sm text-slate-700">
            <p><strong>Personal de la FEUC:</strong> Los datos personales serán procesados por personal autorizado de la FEUC, incluyendo directivos, coordinadores, personal administrativo y estudiantes de distintas áreas necesarias para el cumplimiento de las finalidades informadas en esta Política de Privacidad.</p>
            <p><strong>Tricel:</strong> Para el proceso de votaciones, el tribunal de calificación de elecciones tratará el Padrón Electoral, lo cual está regulado en los estatutos de la FEUC.</p>
            <p><strong>Entidades externas:</strong> Proveedores y eventos masivos según corresponda.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-3 text-lg font-semibold text-ink">¿Cómo ejercer mis derechos?</h3>
          <p className="text-sm text-slate-700">
            Debes comunicarte con el Vicepresidente de la FEUC, cuyo mail es juan.aguero@uc.cl. El derecho sólo podrá ser ejercido por el propio titular.
          </p>
        </div>
      </div>
    </section>
  )
}

