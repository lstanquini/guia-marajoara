'use client'

import { useState } from 'react'
import { Carousel } from '@/components/ui/Carousel'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

// Mock Data
const featuredBusinesses = [
  { id: 1, name: 'Casa Bauducco', category: 'Padaria & Confeitaria', logo: 'CB', coupon: '15% OFF', imagePlaceholder: '🥖' },
  { id: 2, name: 'Pizzaria Bella Italia', category: 'Restaurante Italiano', logo: 'BI', coupon: '20% OFF', imagePlaceholder: '🍕' },
  { id: 3, name: 'Pet Shop Amigo Fiel', category: 'Pet Shop & Veterinário', logo: 'AF', coupon: 'Banho Grátis', imagePlaceholder: '🐾' },
]

export function FeaturedSection() {
  const [infoPanelOpen, setInfoPanelOpen] = useState<number | null>(null)

  const toggleInfoPanel = (id: number) => {
    setInfoPanelOpen(prev => (prev === id ? null : id))
  }
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-text-primary md:text-4xl">
            Destaques da Semana
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Os parceiros mais procurados do Guia Marajoara.
          </p>
        </div>
        
        <Carousel>
          {featuredBusinesses.map(business => (
            <Card key={business.id} className="relative aspect-[4/3] w-full overflow-hidden">
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-8xl">
                {business.imagePlaceholder}
              </div>

              {/* Badges */}
              <div className="absolute top-4 right-4">
                <Badge variant="success">{business.coupon}</Badge>
              </div>

              {/* Info Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-4 left-4 h-8 w-8 rounded-full bg-white/80 p-0" 
                onClick={() => toggleInfoPanel(business.id)}
                aria-label={`Mais informações sobre ${business.name}`}
                aria-expanded={infoPanelOpen === business.id}
              >
                ⓘ
              </Button>

              {/* Company Info */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-lg bg-white/80 p-3 pr-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rosa font-bold text-white">
                  {business.logo}
                </div>
                <div>
                  <h3 className="font-semibold">{business.name}</h3>
                  <p className="text-xs text-text-secondary">{business.category}</p>
                </div>
              </div>
              
              {/* Info Panel - Ativado por clique */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/50 p-8 text-white backdrop-blur-md transition-opacity",
                infoPanelOpen === business.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}>
                <div className="text-center">
                  <h4 className="mb-4 text-xl font-bold">Mais sobre {business.name}</h4>
                  <p className="mb-6 text-sm">Horário, endereço e detalhes do cupom apareceriam aqui.</p>
                  <Button variant="whatsapp">WhatsApp</Button>
                </div>
              </div>
            </Card>
          ))}
        </Carousel>
      </div>
    </section>
  )
}