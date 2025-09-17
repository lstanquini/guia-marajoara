'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
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

export default function BuscaPage() {
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get('q') || ''
  const categoryFromUrl = searchParams.get('categoria') || 'all'
  
  const [searchQuery, setSearchQuery] = useState(queryFromUrl)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl)

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'vestuario', label: 'Vestuário' },
    { value: 'pet', label: 'PET' },
    { value: 'imovel', label: 'Imóvel' },
    { value: 'doces', label: 'Doces & Bolos' },
    { value: 'acessorios', label: 'Acessórios' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'beleza', label: 'Beleza' },
    { value: 'saude', label: 'Saúde' },
    { value: 'restaurante', label: 'Restaurantes' },
  ]

  // useCallback para evitar recriação da função
  const loadBusinesses = useCallback(async () => {
    try {
      // Por enquanto usando dados mockados
      const mockData: Business[] = [
        {
          id: '1',
          name: 'Pizzaria Bella Italia',
          slug: 'pizzaria-bella-italia',
          description: 'A melhor pizza do bairro',
          category_main: 'restaurante',
          phone: '(11) 5555-1234',
          whatsapp: '11955551234',
          address: 'Rua das Flores, 123',
          neighborhood: 'Jardim Marajoara',
          city: 'São Paulo',
          state: 'SP',
          rating: 4.5,
          total_reviews: 127,
          plan_type: 'premium',
          status: 'approved',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Pet Shop Amigo Fiel',
          slug: 'pet-shop-amigo-fiel',
          description: 'Tudo para seu pet',
          category_main: 'pet',
          phone: '(11) 5555-5678',
          whatsapp: '11955555678',
          address: 'Av. do Cursino, 456',
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
          description: 'Seu corpo em forma',
          category_main: 'fitness',
          phone: '(11) 5555-9012',
          whatsapp: '11955559012',
          address: 'Rua do Esporte, 789',
          neighborhood: 'Jardim Marajoara',
          city: 'São Paulo',
          state: 'SP',
          rating: 4.2,
          total_reviews: 56,
          plan_type: 'premium',
          status: 'approved',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

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
      <Navbar />
      
      <main className="min-h-screen bg-[#F8F9FA]">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#C2227A] to-[#A01860] py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
              Encontre o que você procura
            </h1>
            <p className="text-white/80 text-center mb-8">
              Mais de 130 comércios e serviços no Jardim Marajoara
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(value) => setSearchQuery(value)}
                className="shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Filtros e Resultados */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filtros */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
                  Categorias
                </h2>
                
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'primary' : 'ghost'}
                      size="full"
                      className="justify-start"
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Resultados */}
            <div className="flex-1">
              {/* Header dos resultados */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-[#6B7280]">
                  {loading ? 'Carregando...' : `${filteredBusinesses.length} resultados encontrados`}
                </p>
                
                <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm">
                  <option>Mais relevantes</option>
                  <option>A-Z</option>
                  <option>Melhor avaliados</option>
                  <option>Mais próximos</option>
                </select>
              </div>

              {/* Grid de resultados */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <LoadingCard key={n} />
                  ))}
                </div>
              ) : filteredBusinesses.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-[#6B7280]">
                    Tente buscar por outros termos ou categorias
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}