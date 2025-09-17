'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { SearchBar } from '@/components/ui/SearchBar'
import { Skeleton } from '@/components/ui/Loading'

// Tipo para os resultados
interface Business {
  id: string
  name: string
  category: string
  description: string
  rating: number
  reviews: number
  icon: string
  isPremium?: boolean
}

export default function BuscaPage() {
  const [searchQuery, setSearchQuery] = useState('academias')
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [sortBy, setSortBy] = useState('relevance')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Business[]>([])

  // Categorias disponíveis
  const categories = [
    { id: 'todas', name: 'Todas', count: 130 },
    { id: 'vestuario', name: 'Vestuário', count: 23 },
    { id: 'pet', name: 'PET', count: 15 },
    { id: 'imovel', name: 'Imóvel', count: 8 },
    { id: 'doces', name: 'Doces & Bolos', count: 12 },
    { id: 'acessorios', name: 'Acessórios', count: 18 },
    { id: 'fitness', name: 'Fitness', count: 7 },
  ]

  // Mock de resultados
  const mockResults: Business[] = [
    {
      id: '1',
      name: 'Pizzaria Bella Italia',
      category: 'Restaurante',
      description: 'A melhor pizza do bairro',
      rating: 4.5,
      reviews: 127,
      icon: '🍕',
      isPremium: true
    },
    {
      id: '2',
      name: 'Pet Shop Amigo Fiel',
      category: 'Pet Shop',
      description: 'Tudo para seu pet',
      rating: 4.8,
      reviews: 89,
      icon: '🐾',
      isPremium: false
    },
    {
      id: '3',
      name: 'Academia PowerFit',
      category: 'Fitness',
      description: 'Seu corpo em forma',
      rating: 4.2,
      reviews: 56,
      icon: '💪',
      isPremium: true
    }
  ]

  // Simular busca
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
    }, 500)
  }, [searchQuery, selectedCategory, sortBy])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <>
      {/* Navbar - Apenas uma vez! */}
      <Navbar />

      {/* Hero de Busca */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              className="bg-white rounded-xl"
              rotatePlaceholder={false}
            />
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Categorias */}
          <aside className="lg:w-64">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
              Categorias
            </h2>
            
            {/* Mobile: Horizontal scroll */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium
                    whitespace-nowrap lg:w-full lg:text-left
                    transition-all duration-200
                    ${selectedCategory === cat.id
                      ? 'bg-[#C2227A] text-white'
                      : 'bg-white text-[#6B7280] hover:bg-gray-100 border border-gray-200 lg:border-0'
                    }
                  `}
                >
                  <span>{cat.name}</span>
                  <span className="ml-2 text-xs opacity-75">({cat.count})</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Área de Resultados */}
          <section className="flex-1">
            {/* Header dos Resultados */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <span className="text-[#6B7280]">
                {results.length} resultados encontrados
              </span>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="relevance">Mais relevantes</option>
                <option value="name">Nome A-Z</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>

            {/* Grid de Resultados */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6">
                    <Skeleton variant="card" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((business) => (
                  <Card key={business.id} variant="business" className="relative">
                    {business.isPremium && (
                      <div className="absolute top-4 right-4 bg-[#C2227A] text-white text-xs font-semibold px-2 py-1 rounded">
                        Premium
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="text-3xl mb-2">{business.icon}</div>
                      <CardTitle>{business.name}</CardTitle>
                      <CardDescription>{business.category}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-[#6B7280] mb-3">
                        {business.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(business.rating) ? '⭐' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-[#6B7280]">
                          {business.rating} ({business.reviews})
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Mensagem quando não há resultados */}
            {!loading && results.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-[#6B7280]">
                  Tente buscar por outro termo ou categoria
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}