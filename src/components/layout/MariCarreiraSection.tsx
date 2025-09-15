'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

// Corrigido para o padrão de função exportada
export function MariCarreiraSection() {
  return (
    <section 
      className="w-full overflow-hidden relative bg-gradient-to-br from-rosa/5 to-transparent py-16 md:py-24"
      aria-labelledby="mari-title" // Adicionado para acessibilidade
    >
      <div 
        className="absolute top-[-50%] right-[-20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(194,34,122,0.08)_0%,transparent_70%)] pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          
          {/* Conteúdo - Lado Esquerdo */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 id="mari-title" className="text-4xl font-extrabold tracking-tighter text-rosa md:text-5xl">
                MARI CARREIRA
              </h2>
              <p className="mt-2 text-lg font-medium text-text-secondary">@JARDIMMARAJOARASP</p>
            </div>

            {/* Cards de estatísticas - CORRIGIDO para usar o componente <Card> */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-rosa">
                  +<AnimatedCounter value={20000} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Seguidores</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-rosa">
                  <AnimatedCounter value={200} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Parceiros Divulgados</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-rosa">
                  <AnimatedCounter value={2016} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Perfil Ativo Desde</p>
              </Card>
            </div>

            <div className="space-y-4 text-base leading-relaxed text-text-secondary">
              <p>
                Mari Carreira é a influenciadora digital que conecta o Jardim Marajoara com os melhores negócios locais. Com mais de 20 mil seguidores engajados, ela promove estabelecimentos da região e ajuda a fortalecer a economia local.
              </p>
              <p>
                Seu perfil é uma vitrine para pequenos e médios empresários que desejam alcançar mais clientes e aumentar sua visibilidade no bairro.
              </p>
            </div>

            {/* CTA Button - CORRIGIDO para usar o componente <Button> */}
            <div className="pt-4">
                <Button size="lg" variant="primary">
                    Entre em contato
                </Button>
            </div>
          </div>

          {/* Visual - Lado Direito */}
          <div className="relative flex items-center justify-center md:order-first">
            {/* ... (código do celular mantido, pois era majoritariamente visual) ... */}
            <div className="relative mx-auto w-full max-w-[300px] md:mx-0 md:max-w-full">
              <div className="relative transform rotate-3 rounded-[40px] bg-white p-3 shadow-2xl">
                <div className="aspect-[9/16] overflow-hidden rounded-[32px] bg-gray-100">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-rosa/10 to-rosa/20">
                    <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-gradient-to-br from-rosa to-pink-700 text-6xl font-light text-white">
                      MC
                    </div>
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