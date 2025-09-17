'use client'

import { SearchBar } from '@/components/ui/SearchBar'

interface BuscaHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function BuscaHero({ searchQuery, onSearchChange }: BuscaHeroProps) {
  return (
    <section className="bg-gradient-to-r from-[#C2227A] to-[#A01860] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
          Encontre o que você procura
        </h1>
        <p className="text-white/90 text-center mb-8">
          Mais de 130 comércios e serviços no Jardim Marajoara
        </p>
        
        <div className="max-w-2xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onSearch={onSearchChange} // Pode simplificar para passar o valor diretamente
            className="bg-white rounded-xl"
            rotatePlaceholder={false}
          />
        </div>
      </div>
    </section>
  )
}