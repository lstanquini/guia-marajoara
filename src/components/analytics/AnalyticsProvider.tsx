import { Suspense } from 'react'
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts'
import { AnalyticsRouteTracker } from '@/components/analytics/AnalyticsRouteTracker'
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner'

const analyticsEnabled =
  Boolean(process.env.NEXT_PUBLIC_GTM_ID) || Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)

export function AnalyticsProvider() {
  if (!analyticsEnabled) return null

  return (
    <>
      <AnalyticsScripts />
      <Suspense fallback={null}>
        <AnalyticsRouteTracker />
      </Suspense>
      <CookieConsentBanner enabled={analyticsEnabled} />
    </>
  )
}
