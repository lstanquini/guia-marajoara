'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'

const mockBusinesses = [
  { id: 1, name: 'Pizzaria Bella Italia', category: 'Restaurante', logo: '🍕' },
  { id: 2, name: 'Studio Beauty Nails', category: 'Beleza', logo: '💅' },
  { id: 3, name: 'Pet Shop Amigo Fiel', category: 'Pet Shop', logo: '🐾' },
  { id: 4, name: 'Burger King Marajoara', category: 'Restaurante', logo: '🍔' },
  { id: 5, name: 'Clínica Saúde & Vida', category: 'Saúde', logo: '🏥' },
]

function SearchController() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [filteredBusinesses, setFilteredBusinesses] = useState(mockBusinesses)

  const handleFilter = () => {
    setFilteredBusinesses(mockBusinesses.slice(0, 3));
  }
  
  const handleResetFilter = () => {
    setFilteredBusinesses(mockBusinesses);
  }

  return (
    <>
      <div className="mb-8">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="sr-only" aria-live="polite" role="status">
        {filteredBusinesses.length} resultados encontrados.
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Filtros */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Filtros</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" onChange={handleFilter}>
                  <option onClick={handleResetFilter}>Todas</option>
                  <option>Restaurantes</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <main className="md:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} variant="business">
                <div className="text-3xl">{business.logo}</div>
                <h3 className="mt-2 font-semibold">{business.name}</h3>
                <p className="text-sm text-text-secondary">{business.category}</p>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Encontre no Bairro</h1>
      </div>
      <Suspense fallback={<div>Carregando busca...</div>}>
        <SearchController />
      </Suspense>
    </div>
  )
}