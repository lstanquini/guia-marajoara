'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Mock data, será substituído por dados da API na FASE 3
const recentBusinesses = [
  {
    name: 'Burger King Marajoara',
    category: 'Fast Food • Hamburgueria',
    logo: '🍔',
    status: { text: 'Novo Cupom', variant: 'success' },
    rating: '4.2',
    address: 'Av. do Cursino, 234',
    coupons: 2,
  },
  {
    name: 'Studio Beauty Nails',
    category: 'Beleza • Manicure e Pedicure',
    logo: '💅',
    status: { text: 'Novo Cupom', variant: 'success' },
    rating: '4.8',
    address: 'Rua das Flores, 567',
    coupons: 1,
  },
  {
    name: 'Clínica Saúde & Vida',
    category: 'Saúde • Clínica Médica',
    logo: '🏥',
    status: { text: 'Novo', variant: 'primary' },
    rating: '5.0',
    address: 'Av. Marajoara, 890',
    coupons: 0,
  },
]

export function RecentBusinesses() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-text-primary md:text-4xl">
            Acabaram de Chegar
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Fique por dentro das últimas novidades e cupons do bairro.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {recentBusinesses.map((business) => (
            <Card
              key={business.name}
              className="grid grid-cols-1 items-center gap-6 p-4 md:grid-cols-[100px_1fr_auto] md:p-6"
            >
              {/* Logo */}
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-100 text-5xl md:h-24 md:w-24">
                {business.logo}
              </div>

              {/* Info */}
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h3 className="text-xl font-semibold">{business.name}</h3>
                  <Badge variant={business.status.variant as any}>
                    {business.status.text}
                  </Badge>
                </div>
                <p className="mb-3 text-sm text-text-secondary">{business.category}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
                  <span aria-label={`Avaliação: ${business.rating} de 5 estrelas`}>
                    ⭐ {business.rating}
                  </span>
                  <span>📍 {business.address}</span>
                  {business.coupons > 0 && <span>🎫 {business.coupons} cupons</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full gap-3 md:w-auto md:flex-col">
                <Button variant="whatsapp" size="md" className="w-full">
                  WhatsApp
                </Button>
                <Button variant="outline" size="md" className="w-full">
                  Ver mais
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}