import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { EMPLEOS_WHATSAPP_GROUPS } from '../../data/empleosWhatsappGroups'
import { track } from '../../lib/track'
import WhatsappGroupIcon from './WhatsappGroupIcon'

interface WhatsappGroupsModalProps {
  open: boolean
  onClose: () => void
}

export default function WhatsappGroupsModal({ open, onClose }: WhatsappGroupsModalProps) {
  const titleId = useId()
  const descId = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return EMPLEOS_WHATSAPP_GROUPS
    return EMPLEOS_WHATSAPP_GROUPS.filter((group) => group.name.toLowerCase().includes(needle))
  }, [query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => searchRef.current?.focus(), 50)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-t-3xl bg-white shadow-card sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Empleos FEUC</p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold text-ink sm:text-2xl">
              Elige tu grupo de WhatsApp
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-slate-600">
              Únete a los grupos de WhatsApp de Empleos FEUC y recibe oportunidades laborales según tus
              intereses. Puedes participar en todos los que quieras.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="border-b border-slate-100 px-5 py-3 sm:px-6">
          <label className="block">
            <span className="sr-only">Buscar categoría</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar categoría…"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/10 sm:text-sm"
            />
          </label>
        </div>

        <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {groups.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
              No hay categorías con ese nombre.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {groups.map((group) => {
                const ready = Boolean(group.inviteUrl.trim())
                return (
                  <li
                    key={group.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/25 text-secondary">
                        <WhatsappGroupIcon name={group.icon} />
                      </span>
                      <h3 className="min-w-0 pt-1.5 text-sm font-semibold leading-snug text-ink">{group.name}</h3>
                    </div>
                    {ready ? (
                      <a
                        href={group.inviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track('empleos_join_whatsapp_group', { group: group.id })}
                        className="inline-flex items-center justify-center rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary/90"
                      >
                        Unirme al grupo
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-400">
                        Próximamente
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
