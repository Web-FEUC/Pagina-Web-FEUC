import projectsJson from './programa.json' with { type: 'json' }

export const PROGRAMA_STATUSES = [
  { value: 'logrado', label: 'Logrado', shortLabel: 'Logrado', color: '#053333' },
  { value: 'logrado-adaptaciones', label: 'Logrado con adaptaciones', shortLabel: 'Adaptado', color: '#8DE09C' },
  {
    value: 'inclusion-pe',
    label: 'Inclusión en el P.E.',
    shortLabel: 'P.E.',
    color: '#2F6B5A',
  },
  { value: 'avances', label: 'En avance', shortLabel: 'Avance', color: '#FCC216' },
  { value: 'no-logrado', label: 'No logrado', shortLabel: 'Pendiente', color: '#E5562A' },
] as const

export type ProgramaStatus = (typeof PROGRAMA_STATUSES)[number]['value']

export interface ProgramaProject {
  id: number
  name: string
  description: string
  status: ProgramaStatus
  statusRaw: string
}

export const PROGRAMA_PROJECTS = projectsJson as ProgramaProject[]

export function statusMeta(status: ProgramaStatus) {
  return PROGRAMA_STATUSES.find((item) => item.value === status) ?? PROGRAMA_STATUSES[PROGRAMA_STATUSES.length - 1]
}

export function programaStats(projects = PROGRAMA_PROJECTS) {
  const total = projects.length
  const counts = Object.fromEntries(PROGRAMA_STATUSES.map((item) => [item.value, 0])) as Record<ProgramaStatus, number>
  for (const project of projects) counts[project.status] += 1
  const logrado = counts.logrado + counts['logrado-adaptaciones'] + counts['inclusion-pe']
  const amplio = logrado + counts.avances
  return {
    total,
    counts,
    logrado,
    amplio,
    logradoPct: Math.round((logrado / total) * 1000) / 10,
    amplioPct: Math.round((amplio / total) * 1000) / 10,
    avancePct: Math.round((counts.avances / total) * 1000) / 10,
    noLogradoPct: Math.round((counts['no-logrado'] / total) * 1000) / 10,
  }
}
