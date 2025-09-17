'use client'

import { useState } from 'react'

// Importações dos Componentes Principais
import HeroSection from '@/components/layout/HeroSection'
import { CategoryHighlights } from '@/components/layout/CategoryHighlights' // <-- IMPORTAÇÃO NOVA
import { RecentBusinesses } from '@/components/layout/RecentBusinesses'
import { ActiveCoupons } from '@/components/layout/ActiveCoupons'
import { FeaturedSection } from '@/components/layout/FeaturedSection'
import { MariCarreiraSection } from '@/components/layout/MariCarreiraSection'
import { SearchBar } from '@/components/ui/SearchBar'

/**
 * Componente de busca exclusivo para a Homepage.
 * Ele captura o texto e redireciona o usuário para a página /busca.
 */
function HomePageSearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      // Redireciona para a página de busca com o parâmetro de query
      window.location.href = `/busca?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <SearchBar
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onSearch={handleSearch}
      placeholder="O que você está procurando hoje?"
      className="shadow-xl"
    />
  );
}

/**
 * Página principal (Homepage) do site.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection
        title="Bem-vindo ao Guia Marajoara"
        subtitle="Tudo sobre o bairro na palma da sua mão."
      >
        <HomePageSearchBar />
      </HeroSection>

      {/* SEÇÃO DE CATEGORIAS ADICIONADA AQUI */}
      <CategoryHighlights />

      <RecentBusinesses />
      
      <ActiveCoupons />
      
      <FeaturedSection />
      
      <MariCarreiraSection />
    </>
  )
}