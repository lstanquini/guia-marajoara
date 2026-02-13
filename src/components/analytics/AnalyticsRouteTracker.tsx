'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export function AnalyticsRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return

    const query = searchParams?.toString()
    const fullPath = query ? `${pathname}?${query}` : pathname

    trackPageView(fullPath)
  }, [pathname, searchParams])

  return null
}
