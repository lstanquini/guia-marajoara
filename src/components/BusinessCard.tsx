'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface BusinessCardProps {
  business: any
  className?: string
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  const handleGetCoupon = (e: React.MouseEvent) => {
    e.preventDefault()
    // TODO: Abrir modal WhatsApp
    alert(`Pegando cupom: ${business.latestCoupon?.code}`)
  }

  return (
    <article
      className={cn(
        'group relative flex h-[140px] flex-col rounded-xl bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md',
        className
      )}
    >
      <Link href={`/empresas/${business.slug}`} className="flex flex-1 flex-col">
        {/* Header com logo e info */}
        <div className="flex gap-3">
          <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
            {business.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-semibold text-text-primary">
              {business.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                ⭐ {business.rating}
              </span>
              <span>•</span>
              <span>{business.distance}km</span>
            </div>
            <p className="text-xs text-text-secondary">{business.category}</p>
          </div>
        </div>

        {/* Cupom */}
        {business.latestCoupon && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 px-2 py-1">
            <span className="text-xs">🎫</span>
            <span className="flex-1 truncate text-xs font-medium text-verde">
              {business.latestCoupon.title}
            </span>
          </div>
        )}
      </Link>

      {/* Ações */}
      <div className="mt-2 flex gap-2">
        {business.latestCoupon && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleGetCoupon}
            className="flex-1 text-xs"
          >
            💬 Cupom
          </Button>
        )}
        <Link href={`/empresas/${business.slug}`} className="flex-1">
          <Button size="sm" variant="ghost" className="w-full text-xs">
            Detalhes
          </Button>
        </Link>
      </div>
    </article>
  )
}