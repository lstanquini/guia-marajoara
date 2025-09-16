'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'

// Mock Data
const mockBusinesses = [
  { id: 1, name: 'Pizzaria Bella Italia', category: 'Restaurante', logo: '🍕' },
  { id: 2, name: 'Studio Beauty Nails', category: 'Beleza', logo: '💅' },
  { id: 3, name: 'Pet Shop Amigo Fiel', category: 'Pet Shop', logo: '🐾' },
  { id: 4, name: 'Burger King Marajoara', category: 'Restaurante', logo: '🍔' },
  { id: 5, name: 'Clínica Saúde & Vida', category: 'Saúde', logo: '🏥' },
]

export default function SearchPage() {
  const [resultsCount, setResultsCount] = useState(mockBusinesses.length);

  const handleFilter = () => {
    setResultsCount(3);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Encontre no Bairro</h1>
        <p className="mt-2 text-text-secondary">
          Descubra os melhores comércios e serviços perto de você.
        </p>
      </div>

      <div className="sr-only" aria-live="polite" role="status">
        {resultsCount} resultados encontrados.
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Filtros</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>Todas</option>
                  <option>Restaurantes</option>
                </select>
              </div>
               <Button onClick={handleFilter} className="w-full">Filtrar</Button>
            </div>
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="mb-4 md:hidden">
             <Button className="w-full">Mostrar Filtros</Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockBusinesses.slice(0, resultsCount).map((business) => (
              <Card key={business.id} variant="business">
                <div className="text-3xl">{business.logo}</div>
                <h3 className="mt-2 font-semibold">{business.name}</h3>
                <p className="text-sm text-text-secondary">{business.category}</p>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}