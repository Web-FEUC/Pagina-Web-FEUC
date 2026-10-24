/**
 * Grupos temáticos de WhatsApp — Empleos FEUC.
 * Completa `inviteUrl` con el enlace real de cada grupo (chat.whatsapp.com/…).
 * Si queda vacío, la tarjeta muestra “Próximamente” y no redirige.
 */
export type WhatsappGroupIcon =
  | 'finance'
  | 'tech'
  | 'industry'
  | 'design'
  | 'health'
  | 'science'
  | 'law'
  | 'people'
  | 'marketing'
  | 'education'
  | 'art'
  | 'sustainability'
  | 'startup'
  | 'students'
  | 'social'
  | 'agro'

export interface EmpleosWhatsappGroup {
  id: string
  name: string
  icon: WhatsappGroupIcon
  /** Enlace de invitación de WhatsApp. Vacío = aún no configurado. */
  inviteUrl: string
}

export const EMPLEOS_WHATSAPP_GROUPS: EmpleosWhatsappGroup[] = [
  { id: 'estrategia-finanzas', name: 'Estrategia y Finanzas', icon: 'finance', inviteUrl: '' },
  { id: 'tecnologia-datos', name: 'Tecnología y Datos', icon: 'tech', inviteUrl: '' },
  { id: 'industrias', name: 'Industrias', icon: 'industry', inviteUrl: '' },
  {
    id: 'arquitectura-diseno',
    name: 'Arquitectura, Diseño y Estudios Urbanos',
    icon: 'design',
    inviteUrl: '',
  },
  { id: 'salud', name: 'Salud', icon: 'health', inviteUrl: '' },
  { id: 'ciencia-id', name: 'Ciencia e I+D', icon: 'science', inviteUrl: '' },
  { id: 'derecho-gobierno', name: 'Derecho y Gobierno', icon: 'law', inviteUrl: '' },
  { id: 'impacto-personas', name: 'Impacto y Personas', icon: 'people', inviteUrl: '' },
  {
    id: 'marketing-comunicaciones',
    name: 'Marketing y Comunicaciones',
    icon: 'marketing',
    inviteUrl: '',
  },
  { id: 'educacion', name: 'Educación', icon: 'education', inviteUrl: '' },
  { id: 'arte-cultura', name: 'Arte y Cultura', icon: 'art', inviteUrl: '' },
  { id: 'sustentabilidad', name: 'Sustentabilidad', icon: 'sustainability', inviteUrl: '' },
  { id: 'startups-innovacion', name: 'Startups e Innovación', icon: 'startup', inviteUrl: '' },
  { id: 'empleos-estudiantes', name: 'Empleos para Estudiantes', icon: 'students', inviteUrl: '' },
  {
    id: 'ciencias-sociales-patrimonio',
    name: 'Ciencias Sociales y Patrimonio',
    icon: 'social',
    inviteUrl: '',
  },
  {
    id: 'agro-alimentos',
    name: 'Agro, Alimentos y Recursos Naturales',
    icon: 'agro',
    inviteUrl: '',
  },
]
