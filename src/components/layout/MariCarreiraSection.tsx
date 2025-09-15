'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export function MariCarreiraSection() {
  return (
    <section 
      className="w-full overflow-hidden relative bg-gradient-to-br from-rosa/5 to-transparent py-8 md:py-12" // Reduzido padding vertical
      aria-labelledby="mari-title"
    >
      <div 
        className="absolute top-[-50%] right-[-20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(194,34,122,0.08)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"> {/* Reduzido gap */}
          
          {/* Mobile: Título primeiro, depois celular */}
          <div className="flex flex-col gap-6 md:gap-8"> {/* Reduzido gap interno */}
            {/* Título e Instagram - Sempre primeiro no mobile */}
            <div className="md:hidden">
              <h2 className="text-4xl font-extrabold tracking-tighter text-rosa">
                MARI CARREIRA
              </h2>
              <p className="mt-2 text-lg font-medium text-text-secondary">@JARDIMMARAJOARASP</p>
            </div>

            {/* Celular - Logo após título no mobile, oculto aqui no desktop */}
            <div className="relative flex items-center justify-center md:hidden">
              <div className="relative mx-auto w-full max-w-[280px]">
                <div className="relative transform rotate-3 rounded-[40px] bg-white p-3 shadow-2xl">
                  <div className="aspect-[9/16] overflow-hidden rounded-[32px] bg-gray-100">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-rosa/10 to-rosa/20">
                      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gradient-to-br from-rosa to-pink-700 text-5xl font-light text-white">MC</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Título no desktop - Oculto no mobile */}
            <div className="hidden md:block">
              <h2 id="mari-title" className="text-4xl font-extrabold tracking-tighter text-rosa lg:text-5xl">
                MARI CARREIRA
              </h2>
              <p className="mt-2 text-lg font-medium text-text-secondary">@JARDIMMARAJOARASP</p>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"> {/* Reduzido gap */}
              <Card className="p-3 text-center"> {/* Reduzido padding */}
                <div className="text-2xl font-bold text-rosa md:text-3xl">+<AnimatedCounter value={20000} /></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Seguidores</p>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-rosa md:text-3xl"><AnimatedCounter value={200} /></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Parceiros Divulgados</p>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-rosa md:text-3xl"><AnimatedCounter value={2016} /></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Perfil Ativo Desde</p>
              </Card>
            </div>

            {/* Descrição */}
            <div className="space-y-3 text-base leading-relaxed text-text-secondary"> {/* Reduzido espaçamento */}
              <p>Mari Carreira é a influenciadora digital que conecta o Jardim Marajoara com os melhores negócios locais...</p>
            </div>

            {/* Botão CTA */}
            <div className="pt-2"> {/* Reduzido padding */}
              <Button size="lg" variant="primary">Entre em contato</Button>
            </div>
          </div>

          {/* Celular no desktop - Só aparece em telas grandes */}
          <div className="hidden md:flex relative items-center justify-center">
            <div className="relative w-full max-w-[320px] lg:max-w-[360px]"> {/* Ajustado tamanhos */}
              <div className="relative transform rotate-3 rounded-[40px] bg-white p-3 shadow-2xl">
                <div className="aspect-[9/16] overflow-hidden rounded-[32px] bg-gray-100">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-rosa/10 to-rosa/20">
                    <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-gradient-to-br from-rosa to-pink-700 text-6xl font-light text-white">MC</div>
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