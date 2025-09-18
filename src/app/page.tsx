// src/app/page.tsx
'use client'

import { useState } from 'react'

// Importações dos Componentes Principais
import HeroSection from '@/components/layout/HeroSection'
import { CategoryHighlights } from '@/components/layout/CategoryHighlights'
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
      placeholder="Buscar estabelecimentos, serviços..."
      className="shadow-xl"
    />
  );
}

/**
 * Página principal (Homepage) do site.
 * Agora com novo Hero Section com banner e logo MaraON
 */
export default function HomePage() {
  return (
    <>
      {/* Hero Section com novo design */}
      <HeroSection>
        <HomePageSearchBar />
      </HeroSection>

      {/* Categorias em destaque */}
      <CategoryHighlights />

      {/* Empresas recentes */}
      <RecentBusinesses />
      
      {/* Cupons ativos */}
      <ActiveCoupons />
      
      {/* Seção de destaque */}
      <FeaturedSection />
      
      {/* Seção Mari Carreira */}
      <MariCarreiraSection />
    </>
  )
}