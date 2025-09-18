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
    { value: 200, label: 'Comércios', suffix: '+' },
    { value: 4.8, label: 'Avaliação', isDecimal: true },
    { value: 50, label: 'Economia', suffix: '%' }
  ]

  return (
    <section className="relative w-full">
      {/* Hero Banner Container */}
      <div className="relative w-full max-w-[1200px] mx-auto">
        {/* Banner com altura responsiva */}
        <div className="relative w-full h-[500px] md:h-[400px] overflow-hidden">
          
          {/* Imagem de Fundo */}
          <Image
            src="/images/marajoara-street.png"
            alt="Rua arborizada do Jardim Marajoara"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          
          {/* Overlay para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Conteúdo centralizado sobre a imagem */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8">
            
            {/* Logo MaraON */}
            <div className="mb-8 md:mb-10">
              <Image
                src="/images/logo-maraon.png"
                alt="MaraON - Explore nosso bairro. Resgate seu CUPON"
                width={320}
                height={120}
                className="w-[280px] md:w-[320px] h-auto"
                priority
              />
            </div>
            
            {/* SearchBar - Componente passado como children */}
            {children && (
              <div className="w-full max-w-[600px] mb-8 md:mb-10">
                {children}
              </div>
            )}
            
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-[500px]">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white"
                >
                  <div className="text-2xl md:text-3xl font-bold text-[#00BCD4] mb-1">
                    {stat.isDecimal ? (
                      <span>{stat.value}</span>
                    ) : (
                      <>
                        <AnimatedCounter 
                          value={stat.value} 
                          duration={1500}
                        />
                        {stat.suffix && <span>{stat.suffix}</span>}
                      </>
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-gray-700 font-medium">
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