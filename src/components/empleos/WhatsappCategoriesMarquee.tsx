import { EMPLEOS_WHATSAPP_GROUPS } from '../../data/empleosWhatsappGroups'
import WhatsappGroupIcon from './WhatsappGroupIcon'

export default function WhatsappCategoriesMarquee() {
  const items = [...EMPLEOS_WHATSAPP_GROUPS, ...EMPLEOS_WHATSAPP_GROUPS]

  return (
    <div className="mt-8 w-full">
      <p className="mx-auto mb-3 max-w-2xl text-center text-sm text-slate-600">
        Grupos temáticos de Empleos FEUC — únete a la comunidad y recibe oportunidades según tus intereses.
      </p>
      <div className="relative overflow-hidden py-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f3f7f3] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f3f7f3] to-transparent sm:w-16" />
        <div className="empleos-marquee flex w-max gap-3 pr-3">
          {items.map((group, index) => (
            <div
              key={`${group.id}-${index}`}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-secondary/10 bg-white px-4 py-2.5 shadow-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/25 text-secondary">
                <WhatsappGroupIcon name={group.icon} className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap text-sm font-semibold text-ink">{group.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
