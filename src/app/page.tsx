'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
// import { Button } from '@/components/ui/Button' // Removido se não usado

export default function BuscaPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Busca</h1>
      <SearchBar 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Busque por empresas..."
      />
      {/* Conteúdo da busca aqui */}
    </div>
  )
}