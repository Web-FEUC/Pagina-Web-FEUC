/** Datos de la propuesta de voto ponderado — Comisión de Subrepresentación / Padrón FEUC 2027 */

export const BLOQUE_ESTUDIANTES = 2000

export function votosPonderados(matricula: number) {
  const base = Math.max(0, Math.floor(matricula))
  const adicionales = Math.floor(base / BLOQUE_ESTUDIANTES)
  return {
    matricula: base,
    votoBase: 1,
    votosAdicionales: adicionales,
    votosTotales: 1 + adicionales,
  }
}

export const resumenPropuesta = {
  consejerosEjecutivos: { actual: 43, propuesto: 43 },
  votosOrdinarios: { actual: 89, propuesto: 89 },
  votosConsejosPresidencias: { actual: 22, propuesto: 28 },
  votosPonderadosTerritoriales: { actual: 65, propuesto: 71 },
  votosAdicionales: 6,
  territoriosBeneficiados: 5,
} as const

export const territoriosBeneficiados = [
  {
    territorio: 'Ingeniería',
    estudiantes: 5037,
    votosActuales: 1,
    votosPropuestos: 3,
    cambio: 2,
  },
  {
    territorio: 'College',
    estudiantes: 2780,
    votosActuales: 1,
    votosPropuestos: 2,
    cambio: 1,
  },
  {
    territorio: 'Educación',
    estudiantes: 2516,
    votosActuales: 1,
    votosPropuestos: 2,
    cambio: 1,
  },
  {
    territorio: 'Ingeniería Comercial',
    estudiantes: 2320,
    votosActuales: 1,
    votosPropuestos: 2,
    cambio: 1,
  },
  {
    territorio: 'Ciencias de la Salud',
    estudiantes: 2181,
    votosActuales: 1,
    votosPropuestos: 2,
    cambio: 1,
  },
] as const

export const composicionSalud = [
  { carrera: 'Fonoaudiología', estudiantes: 325 },
  { carrera: 'Kinesiología', estudiantes: 471 },
  { carrera: 'Medicina Veterinaria', estudiantes: 610 },
  { carrera: 'Nutrición y Dietética', estudiantes: 366 },
  { carrera: 'Terapia Ocupacional', estudiantes: 409 },
] as const

export const tramosVoto = [
  { rango: '0 a 1.999 estudiantes', votos: 1 },
  { rango: '2.000 a 3.999', votos: 2 },
  { rango: '4.000 a 5.999', votos: 3 },
  { rango: '6.000 a 7.999', votos: 4 },
  { rango: '8.000 a 9.999', votos: 5 },
] as const

export const ejemplosCalculadora = [
  { label: '1.500 estudiantes', matricula: 1500 },
  { label: '2.500 estudiantes', matricula: 2500 },
  { label: '5.037 estudiantes', matricula: 5037 },
  { label: '6.200 estudiantes', matricula: 6200 },
] as const

export const tramitesPropuesta = [
  'Discusión en el Consejo Ejecutivo.',
  'Presentación y votación en el Consejo de Federación.',
  'Aprobación de cada disposición por tres quintas partes del Consejo.',
  'Plebiscito por tratarse de una modificación a la forma de votación.',
] as const

export const articulosEstatutarios = [
  {
    id: '17-bis',
    titulo: 'Artículo 17 bis',
    resumen:
      'Se incorporaría la regla de un voto ponderado adicional por cada bloque completo de 2.000 estudiantes. También se establecería que los votos adicionales solo se aplican al mecanismo del artículo 17 y deben ser ejercidos por personas distintas.',
  },
  {
    id: '19',
    titulo: 'Artículo 19',
    resumen:
      'Se aclararía que el principio de una persona, un voto es compatible con los votos ponderados adicionales, siempre que cada voto sea ejercido por una persona distinta.',
  },
] as const

export function formatMiles(value: number) {
  return value.toLocaleString('es-CL')
}
