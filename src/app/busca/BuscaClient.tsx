'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/ui/SearchBar'
import { BusinessCard } from '@/components/BusinessCard'
import { LoadingCard } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'

// Interface para Business tipada corretamente
interface Business {
  id: string
  name: string
  slug: string
  description: string
  category_main: string
  category_sub?: string
  phone?: string
  whatsapp?: string
  website?: string
  instagram?: string
  email?: string
  address: string
  address_number?: string
  neighborhood?: string
  city: string
  state: string
  zip_code?: string
  latitude?: number
  longitude?: number
  opening_hours?: Record<string, string>
  delivery?: boolean
  rating?: number
  total_reviews?: number
  logo_url?: string
  banner_url?: string
  featured_until?: string
  plan_type: 'basic' | 'premium'
  status: 'pending' | 'approved' | 'suspended'
  created_at: string
  updated_at: string
}

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
    { value: 'all', label: 'Todas', count: 130 },
    { value: 'vestuario', label: 'Vestuário', count: 23 },
    { value: 'pet', label: 'PET', count: 15 },
    { value: 'imovel', label: 'Imóvel', count: 8 },
    { value: 'doces', label: 'Doces & Bolos', count: 12 },
    { value: 'acessorios', label: 'Acessórios', count: 18 },
    { value: 'fitness', label: 'Fitness', count: 7 },
    { value: 'beleza', label: 'Beleza', count: 14 },
    { value: 'saude', label: 'Saúde', count: 9 },
    { value: 'restaurante', label: 'Restaurantes', count: 28 },
  ]

  // Dados mockados para testes
  const mockData: Business[] = [
    {
      id: '1',
      name: 'Pizzaria Bella Italia',
      slug: 'pizzaria-bella-italia',
      description: 'A melhor pizza do bairro com mais de 30 sabores',
      category_main: 'restaurante',
      phone: '(11) 5555-1234',
      whatsapp: '11955551234',
      address: 'Rua das Flores',
      address_number: '123',
      neighborhood: 'Jardim Marajoara',
      city: 'São Paulo',
      state: 'SP',
      rating: 4.5,
      total_reviews: 127,
      plan_type: 'premium',
      status: 'approved',
      delivery: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Pet Shop Amigo Fiel',
      slug: 'pet-shop-amigo-fiel',
      description: 'Tudo para seu pet com amor e carinho',
      category_main: 'pet',
      phone: '(11) 5555-5678',
      whatsapp: '11955555678',
      address: 'Av. do Cursino',
      address_number: '456',
      neighborhood: 'Jardim Marajoara',
      city: 'São Paulo',
      state: 'SP',
      rating: 4.8,
      total_reviews: 89,
      plan_type: 'basic',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Academia PowerFit',
      slug: 'academia-powerfit',
      description: 'Seu corpo em forma com os melhores equipamentos',
      category_main: 'fitness',
      phone: '(11) 5555-9012',
      whatsapp: '11955559012',
      address: 'Rua do Esporte',
      address_number: '789',
      neighborhood: 'Jardim Marajoara',
      city: 'São Paulo',
      state: 'SP',
      rating: 4.2,
      total_reviews: 56,
      plan_type: 'premium',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Boutique Elegância',
      slug: 'boutique-elegancia',
      description: 'Moda feminina com estilo e sofisticação',
      category_main: 'vestuario',
      phone: '(11) 5555-3456',
      whatsapp: '11955553456',
      address: 'Av. Principal',
      address_number: '321',
      neighborhood: 'Jardim Marajoara',
      city: 'São Paulo',
      state: 'SP',
      rating: 4.7,
      total_reviews: 42,
      plan_type: 'basic',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Salão Beleza Pura',
      slug: 'salao-beleza-pura',
      description: 'Cabelo, maquiagem e muito mais',
      category_main: 'beleza',
      phone: '(11) 5555-7890',
      whatsapp: '11955557890',
      address: 'Rua da Beleza',
      address_number: '159',
      neighborhood: 'Jardim Marajoara',
      city: 'São Paulo',
      state: 'SP',
      rating: 4.9,
      total_reviews: 203,
      plan_type: 'premium',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Doces da Vovó',
      slug: 'doces-da-vovo',
      description: 'Bolos e doces caseiros feitos com amor',
      category_main: 'doces',
      phone: '(11) 5555-2468',
      whatsapp: '11955552468',
      address: 'Rua dos Sabores',
      address_number: '753',
      neighborhood: 'Jardim Marajoara',
      city: 'São Paulo',
      state: 'SP',
      rating: 4.6,
      total_reviews: 67,
      plan_type: 'basic',
      status: 'approved',
      delivery: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  // useCallback para evitar recriação da função
  const loadBusinesses = useCallback(async () => {
    try {
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setBusinesses(mockData)
      setFilteredBusinesses(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBusinesses()
  }, [loadBusinesses])

  // Filtrar por busca e categoria
  useEffect(() => {
    let filtered = businesses

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category_main === selectedCategory)
    }

    // Filtrar por texto de busca
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category_main.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredBusinesses(filtered)
  }, [searchQuery, selectedCategory, businesses])

  return (
    <>
      {/* Hero Section */}
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
              onSearch={(value) => setSearchQuery(value)}
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
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`
                    px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium
                    whitespace-nowrap lg:w-full lg:text-left
                    transition-all duration-200
                    ${selectedCategory === cat.value
                      ? 'bg-[#C2227A] text-white'
                      : 'bg-white text-[#6B7280] hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  <span>{cat.label}</span>
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
                {loading ? 'Carregando...' : `${filteredBusinesses.length} resultados encontrados`}
              </span>
              
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2227A]/20 focus:border-[#C2227A]"
              >
                <option value="relevance">Mais relevantes</option>
                <option value="name">Nome A-Z</option>
                <option value="rating">Melhor avaliação</option>
                <option value="distance">Mais próximos</option>
              </select>
            </div>

            {/* Grid de Resultados */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-[#6B7280] mb-6">
                  Tente buscar por outros termos ou categorias
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}