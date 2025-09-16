'use client'

import { useState } from 'react'
import { Carousel } from '@/components/ui/Carousel'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const featuredBusinesses = [
    { id: 1, name: 'Casa Bauducco', category: 'Padaria & Confeitaria', logo: 'CB', coupon: '15% OFF', imagePlaceholder: '🥖' },
    { id: 2, name: 'Pizzaria Bella Italia', category: 'Restaurante Italiano', logo: 'BI', coupon: '20% OFF', imagePlaceholder: '🍕' },
    { id: 3, name: 'Pet Shop Amigo Fiel', category: 'Pet Shop & Veterinário', logo: 'AF', coupon: 'Banho Grátis', imagePlaceholder: '🐾' },
]

export function FeaturedSection() {
  const [infoPanelOpen, setInfoPanelOpen] = useState<number | null>(null)
  const toggleInfoPanel = (id: number) => { setInfoPanelOpen(prev => (prev === id ? null : id)) }
  
  return (
    <section className="py-12 md:py-8 lg:py-10"> {/* Ajustado padding */}
      <div className="container mx-auto px-4">
        <div className="mb-12 md:mb-6 lg:mb-8 text-center"> {/* Ajustado margins */}
          <h2 className="text-3xl font-bold tracking-tighter text-text-primary md:text-3xl lg:text-4xl">Destaques da Semana</h2>
          <p className="mt-4 md:mt-2 text-lg md:text-base text-text-secondary">Os parceiros mais procurados do Guia Marajoara.</p>
        </div>
        <div className="md:max-w-6xl md:mx-auto"> {/* Aumentado largura máxima */}
          <Carousel>
            {featuredBusinesses.map(business => (
              <Card key={business.id} className="relative aspect-[4/3] md:aspect-[3/2] lg:aspect-[5/3] w-full overflow-hidden"> {/* Aspect ratio menos horizontal */}
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-8xl md:text-7xl lg:text-8xl">{business.imagePlaceholder}</div>
                <div className="absolute top-4 right-4 md:top-3 md:right-3"><Badge variant="success">{business.coupon}</Badge></div>
                <Button variant="ghost" size="sm" className="absolute top-4 left-4 md:top-3 md:left-3 h-8 w-8 rounded-full bg-white/80 p-0" onClick={() => toggleInfoPanel(business.id)} aria-label={`Mais informações sobre ${business.name}`} aria-expanded={infoPanelOpen === business.id}>ⓘ</Button>
                <div className="absolute bottom-4 left-4 md:bottom-3 md:left-3 flex items-center gap-3 rounded-lg bg-white/80 p-3 md:p-2.5 pr-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-md bg-rosa font-bold text-white">{business.logo}</div>
                  <div>
                    <h3 className="font-semibold md:text-[15px]">{business.name}</h3>
                    <p className="text-xs text-text-secondary">{business.category}</p>
                  </div>
                </div>
                <div className={cn("absolute inset-0 flex items-center justify-center bg-black/50 p-8 md:p-6 text-white backdrop-blur-md transition-opacity", infoPanelOpen === business.id ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
                  <div className="text-center">
                    <h4 className="mb-4 md:mb-3 text-xl md:text-lg font-bold">Mais sobre {business.name}</h4>
                    <p className="mb-6 md:mb-4 text-sm">Horário, endereço e detalhes do cupom apareceriam aqui.</p>
                    <Button variant="whatsapp">WhatsApp</Button>
                  </div>
                </div>
              </Card>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  )
}