'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/ui/SearchBar'
import { Card } from '@/components/ui/Card'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter' // Novo componente

// TODO: Substituir placeholders por ícones SVG personalizados
const categories = [
  { name: 'Restaurantes', icon: '🍴', count: 28 },
  { name: 'Beleza', icon: '💅', count: 22 },
  { name: 'Pet Shop', icon: '🐾', count: 15 },
  { name: 'Saúde', icon: '🏥', count: 14 },
  { name: 'Mercado', icon: '🛒', count: 9 },
  { name: 'Fitness', icon: '💪', count: 7 },
  { name: 'Vestuário', icon: '👕', count: 23 },
  { name: 'Serviços', icon: '🔧', count: 31 },
]

const counters = [
  { label: 'Parceiros', target: 130, color: 'text-rosa' },
  { label: 'Cupons Ativos', target: 99, color: 'text-verde' },
  { label: 'Visitas', target: 27988, color: 'text-ciano' },
]

export function HeroSection() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <section className="relative w-full overflow-hidden py-8 md:py-16">
      {/* ... (código do background e logo) ... */}
       <div className="container relative z-10 mx-auto px-4">
        {/* Logo */}
        <div className="mb-12 text-center">
          <h1 className="inline-flex flex-wrap items-center justify-center gap-3 text-4xl font-extrabold tracking-tighter md:text-5xl">
            <span className="text-rosa">GUIA</span>
            <span className="text-2xl font-normal text-text-primary md:text-3xl">DO</span>
            <span className="text-verde">Marajoara</span>
          </h1>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="mx-auto max-w-2xl">
            <SearchBar value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat, index) => (
              <Card
                key={cat.name}
                className={cn(
                  'flex flex-col items-center justify-center p-4 text-center',
                  'md:p-6',
                  index > 5 && 'hidden md:flex'
                )}
              >
                <div className="mb-2 text-3xl md:mb-4 md:text-4xl">{cat.icon}</div>
                <h3 className="text-sm font-semibold md:text-base">{cat.name}</h3>
                <p className="hidden text-xs text-text-secondary md:block">{cat.count} lugares</p>
              </Card>
            ))}
          </div>
          <Link
            href="/categorias"
            className="mt-4 block text-center text-sm font-medium text-verde hover:underline md:hidden"
          >
            Ver todas as categorias →
          </Link>
        </div>

        {/* Counters */}
        <div className="flex justify-around border-t border-gray-200/80 pt-8">
          {counters.map((counter) => (
            <div key={counter.label} className="text-center">
              <div className={cn('text-3xl font-bold md:text-4xl', counter.color)}>
                 <AnimatedCounter value={counter.target} />
              </div>
              <p className="text-xs uppercase tracking-wider text-text-secondary">{counter.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}