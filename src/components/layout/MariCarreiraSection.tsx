'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export function MariCarreiraSection() {
  return (
    <section 
      className="w-full overflow-hidden relative bg-gradient-to-br from-rosa/5 to-transparent py-12 md:py-16" // <-- 2. ESPAÇAMENTO CORRIGIDO
      aria-labelledby="mari-title"
    >
      <div 
        className="absolute top-[-50%] right-[-20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(194,34,122,0.08)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          
          {/* 1. ORDEM CORRIGIDA: Adicionadas classes 'order-2 md:order-1' */}
          <div className="order-2 flex flex-col gap-8 md:order-1">
            <div>
              <h2 id="mari-title" className="text-4xl font-extrabold tracking-tighter text-rosa md:text-5xl">
                MARI CARREIRA
              </h2>
              <p className="mt-2 text-lg font-medium text-text-secondary">@JARDIMMARAJOARASP</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="p-4 text-center"><div className="text-3xl font-bold text-rosa">+<AnimatedCounter value={20000} /></div><p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Seguidores</p></Card>
              <Card className="p-4 text-center"><div className="text-3xl font-bold text-rosa"><AnimatedCounter value={200} /></div><p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Parceiros Divulgados</p></Card>
              <Card className="p-4 text-center"><div className="text-3xl font-bold text-rosa"><AnimatedCounter value={2016} /></div><p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Perfil Ativo Desde</p></Card>
            </div>

            <div className="space-y-4 text-base leading-relaxed text-text-secondary">
              <p>Mari Carreira é a influenciadora digital que conecta o Jardim Marajoara com os melhores negócios locais...</p>
            </div>

            <div className="pt-4">
                <Button size="lg" variant="primary">Entre em contato</Button>
            </div>
          </div>

          {/* 1. ORDEM CORRIGIDA: Adicionadas classes 'order-1 md:order-2' */}
          <div className="order-1 relative flex items-center justify-center md:order-2">
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px] md:mx-0 md:max-w-full">
              <div className="relative transform rotate-3 rounded-[40px] bg-white p-3 shadow-2xl">
                <div className="aspect-[9/16] overflow-hidden rounded-[32px] bg-gray-100">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-rosa/10 to-rosa/20">
                    <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-gradient-to-br from-rosa to-pink-700 text-6xl font-light text-white">MC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}