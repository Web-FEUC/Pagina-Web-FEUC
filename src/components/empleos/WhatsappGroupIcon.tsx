import type { WhatsappGroupIcon } from '../../data/empleosWhatsappGroups'

const paths: Record<WhatsappGroupIcon, string> = {
  finance:
    'M3 3v18h18M7 14l3-3 3 2 5-6M16 8h3v3',
  tech: 'M4 7h16v10H4zM8 21h8M12 17v4M8 11h.01M12 11h.01M16 11h.01',
  industry: 'M3 21h18M5 21V10l5 3V10l5 3V7l6-2v16',
  design: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  health: 'M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z',
  science: 'M10 2v6l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V2M8.5 14h7',
  law: 'M12 3v18M5 8h14M7 8l-3 8h6L7 8zm10 0l-3 8h6l-3-8z',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  marketing: 'M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1zm13 1a3 3 0 0 0 0-6M17 19a7 7 0 0 0 0-14',
  education: 'M22 10L12 5 2 10l10 5 10-5zM6 12.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5',
  art: 'M12 2a5 5 0 0 1 0 10 5 5 0 1 0 0 10 9 9 0 0 0 0-20zM12 12a3 3 0 1 0 0-6',
  sustainability: 'M12 22c4-4 7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 3 8 7 12zM12 10a2 2 0 1 0 0-4',
  startup: 'M5 19l4-2 3 2 3-2 4 2V6l-4 2-3-2-3 2-4-2v13zM9 10v4M12 9v5M15 10v4',
  students: 'M4 19a2 2 0 0 0 2 2h12M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h6M9 11h6M9 15h3',
  social: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zm0 0h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18',
  agro: 'M12 22V10M8 14c0-4 2-7 4-8 2 1 4 4 4 8M5 22h14M7 10c-2 1-3 3-3 5 0 2 2 3 3 3M17 10c2 1 3 3 3 5 0 2-2 3-3 3',
}

export default function WhatsappGroupIcon({
  name,
  className = 'h-5 w-5',
}: {
  name: WhatsappGroupIcon
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={paths[name]} />
    </svg>
  )
}
