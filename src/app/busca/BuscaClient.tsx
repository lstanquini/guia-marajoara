'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
// Importe o novo componente
import { BuscaHero } from './BuscaHero' 
import { BusinessCard } from '@/components/BusinessCard'
import { LoadingCard } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
// ...sua interface Business e mockData continuam aqui...

interface Business {
  // ... (interface completa como você já tem)
}
const mockData: Business[] = [
  // ... (array de dados como você já tem)
]


export default function BuscaClient() {
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get('q') || ''
  const categoryFromUrl = searchParams.get('categoria') || 'all'
  
  const [searchQuery, setSearchQuery] = useState(queryFromUrl)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl)

  const categories = [
    // ... (seu array de categorias)
  ]

  const loadBusinesses = useCallback(async () => {
    // ... (sua função loadBusinesses, sem alterações)
  }, [])

  useEffect(() => {
    loadBusinesses()
  }, [loadBusinesses])

  useEffect(() => {
    // ... (seu useEffect de filtro, sem alterações)
  }, [searchQuery, selectedCategory, businesses])

  return (
    <>
      {/* AQUI ESTÁ A MUDANÇA PRINCIPAL!
        Trocamos todo aquele bloco <section> pelo novo componente.
        Passamos o estado (searchQuery) e a função para atualizá-lo (setSearchQuery) como props.
      */}
      <BuscaHero 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      {/* O resto do seu componente continua exatamente igual */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Categorias */}
          <aside className="lg:w-64">
            {/* ... (seu código da sidebar, sem alterações) */}
          </aside>

          {/* Área de Resultados */}
          <section className="flex-1">
             {/* ... (seu código da área de resultados, sem alterações) */}
          </section>
        </div>
      </div>
    </>
  )
}