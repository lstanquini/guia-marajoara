'use client'

import { useState, useEffect } from 'react'
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
    { id: 'beleza', name: 'Beleza', count: 14 },
    { id: 'saude', name: 'Saúde', count: 9 },
    { id: 'restaurantes', name: 'Restaurantes', count: 28 },
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
      {/* Hero de Busca - SEM NAVBAR pois já vem do layout */}
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
      <div className="container mx-auto px-4 py-8">
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
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2227A]/20 focus:border-[#C2227A]"
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
                  <Card key={business.id} variant="business" className="relative group hover:scale-105 transition-transform">
                    {business.isPremium && (
                      <div className="absolute top-4 right-4 bg-[#C2227A] text-white text-xs font-semibold px-2 py-1 rounded z-10">
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
                      
                      <div className="flex items-center gap-2 mb-3">
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

                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>Av. do Cursino, {456 - parseInt(business.id) * 33} - Jardim Marajoara</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <span>(11) 5555-{1234 + parseInt(business.id) * 1000}</span>
                      </div>

                      {/* Botões de ação */}
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-[#25D366] text-white py-2 px-3 rounded-lg hover:bg-[#20BD5C] transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          WhatsApp
                        </button>
                        <button className="flex-1 border border-[#C2227A] text-[#C2227A] py-2 px-3 rounded-lg hover:bg-[#C2227A] hover:text-white transition-colors text-sm font-medium">
                          Ver mais
                        </button>
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
      </div>
    </>
  )
}