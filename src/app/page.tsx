'use client'

import { HeroSection } from '@/components/layout/HeroSection'
import { RecentBusinesses } from '@/components/layout/RecentBusinesses'
import { ActiveCoupons } from '@/components/layout/ActiveCoupons'
import { FeaturedSection } from '@/components/layout/FeaturedSection'
import { MariCarreiraSection } from '@/components/layout/MariCarreiraSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RecentBusinesses />
      <ActiveCoupons />
      <FeaturedSection />
      <MariCarreiraSection />
    </>
  )
}