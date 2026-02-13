export const COOKIE_CONSENT_STORAGE_KEY = 'marajoara_cookie_consent_v1'

export type ConsentState = {
  essential: true
  analytics: boolean
  updatedAt: string
  source: 'banner' | 'settings'
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }
}

export function readConsentState(): ConsentState | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>

    if (typeof parsed.analytics !== 'boolean') return null

    return {
      essential: true,
      analytics: parsed.analytics,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      source: parsed.source === 'settings' ? 'settings' : 'banner',
    }
  } catch {
    return null
  }
}

export function saveConsentState(consent: ConsentState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent))
}

export function pushDataLayer(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

export function updateConsentMode(analyticsGranted: boolean): void {
  const consent = {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  }

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', consent)
  }

  pushDataLayer({
    event: 'consent_updated',
    ...consent,
  })
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined') return

  const consent = readConsentState()
  if (!consent?.analytics) return

  pushDataLayer({
    event: 'page_view',
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    })
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  const consent = readConsentState()
  if (!consent?.analytics) return

  pushDataLayer({
    event: eventName,
    ...params,
  })

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}
