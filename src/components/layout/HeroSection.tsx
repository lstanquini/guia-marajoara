'use client'

import React from 'react'

interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

// Renomeado para HeroSection para corresponder ao nome do arquivo
export default function HeroSection({ title, subtitle, children }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-[#C2227A] to-[#A01860] py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {title}
        </h1>
        <p className="text-white/90 mb-8">
          {subtitle}
        </p>
        
        {children && (
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}