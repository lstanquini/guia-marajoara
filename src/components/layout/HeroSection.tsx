// src/components/layout/HeroSection.tsx
'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

interface HeroSectionProps {
  children?: ReactNode
}

export default function HeroSection({ children }: HeroSectionProps) {
  const stats = [
    { value: 200, label: 'Parceiros', suffix: '+', icon: '🤝' },
    { value: 100, label: 'Cupons Ativos', suffix: '+', icon: '🎫' },
    { value: 5000, label: 'Visitas', suffix: '+', icon: '👥' }
  ]

  return (
    <section className="relative w-full">
      {/* Hero Banner Container */}
      <div className="relative w-full">
        {/* Banner com altura fixa e ratio correto */}
        <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
          
          {/* Imagem Desktop - 16:9 ratio (1067x600) - Escondida no mobile */}
          <div className="hidden md:block absolute inset-0">
            <Image
              src="/images/marajoara-street-desk.png"
              alt="Rua arborizada do Jardim Marajoara"
              fill
              priority
              quality={100}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          
          {/* Imagem Mobile - 1:1 ratio (quadrada) - Escondida no desktop */}
          <div className="md:hidden absolute inset-0">
            <Image
              src="/images/marajoara-street-mob.png"
              alt="Rua arborizada do Jardim Marajoara"
              fill
              priority
              quality={100}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          
          {/* Overlay para melhor legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />
          
          {/* Conteúdo centralizado sobre a imagem */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8 md:py-12">
            
            {/* Logo MaraON - AUMENTADO 20% COM QUALIDADE MÁXIMA */}
            <div className="mb-8 md:mb-12">
              <Image
                src="/images/logo-maraon.png"
                alt="MaraON - Explore nosso bairro. Resgate seu CUPON"
                width={600}
                height={216}
                className="w-[384px] md:w-[600px] h-auto"
                priority
                quality={100}
                unoptimized={true} // Desabilita otimização automática do Next.js
              />
            </div>
            
            {/* SearchBar - Componente passado como children */}
            {children && (
              <div className="w-full max-w-[700px] mb-8 md:mb-12">
                {children}
              </div>
            )}
            
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-3 gap-3 md:gap-8 w-full max-w-[650px]">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-md rounded-xl p-3 md:p-5 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/95 shadow-lg"
                >
                  <div className="text-2xl md:text-4xl font-bold text-[#00BCD4] mb-1">
                    <AnimatedCounter 
                      value={stat.value} 
                      duration={2000}
                    />
                    {stat.suffix && <span className="text-xl md:text-3xl">{stat.suffix}</span>}
                  </div>
                  <div className="text-xs md:text-base text-gray-700 font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}