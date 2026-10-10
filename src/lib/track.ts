type TrackPayload = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function track(event: string, payload: TrackPayload = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, payload)
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...payload })
  }
}
