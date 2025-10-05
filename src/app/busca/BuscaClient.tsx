'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { BuscaHero } from './BuscaHero'
import { BusinessCard } from '@/components/BusinessCard'
import { LoadingCard } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { searchBusinesses, getCategoriesWithCount, BusinessSearchResult } from '@/lib/services/search'
import { Filter, Tag, Clock } from 'lucide-react'
import { capitalizeCategory } from '@/lib/utils'

export default function BuscaClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Ler TUDO da URL (source of truth)
  const queryFromUrl = searchParams.get('q') || ''
  const categoryFromUrl = searchParams.get('categoria') || 'all'
  const hasCouponsFromUrl = searchParams.get('cupons') === 'true'
  const isOpenFromUrl = searchParams.get('aberto') === 'true'
  const sortByFromUrl = (searchParams.get('ordenar') || 'relevance') as 'relevance' | 'name' | 'rating'
  
  const [allBusinesses, setAllBusinesses] = useState<BusinessSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categories, setCategories] = useState<{ value: string; label: string; count: number }[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Carregar categorias
  useEffect(() => {
    getCategoriesWithCount().then(setCategories)
  }, [])

  // Buscar empresas quando categoria muda
  useEffect(() => {
    async function loadBusinesses() {
      setCategoryLoading(true)
      setLoading(true)
      try {
        const [results] = await Promise.all([
          searchBusinesses('', {
            category: categoryFromUrl,
            sortBy: 'relevance'
          }),
          new Promise(resolve => setTimeout(resolve, 300))
        ])
        setAllBusinesses(results)
      } catch (error) {
        console.error('Erro ao carregar empresas:', error)
      } finally {
        setLoading(false)
        setCategoryLoading(false)
      }
    }

    loadBusinesses()
  }, [categoryFromUrl])

  // Função para atualizar URL
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || value === 'false') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    const newUrl = `${pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }

  // Handlers que atualizam a URL
  const handleSearchChange = (value: string) => {
    updateURL({ q: value || null })
  }

  const handleCategoryChange = (category: string) => {
    updateURL({ categoria: category === 'all' ? null : category })
  }

  const handleFilterChange = (filter: 'cupons' | 'aberto', value: boolean) => {
    updateURL({ [filter]: value ? 'true' : null })
  }

  const handleSortChange = (sortBy: string) => {
    updateURL({ ordenar: sortBy === 'relevance' ? null : sortBy })
  }

  const handleClearAll = () => {
    router.push(pathname, { scroll: false })
  }

  // Filtrar e ordenar localmente
  const filteredBusinesses = useMemo(() => {
    let results = [...allBusinesses]

    // Filtro de busca por texto
    if (queryFromUrl && queryFromUrl.trim() !== '') {
      const searchLower = queryFromUrl.toLowerCase().trim()
      results = results.filter(b => {
        const nameMatch = b.name.toLowerCase().includes(searchLower)
        const categoryMatch = b.category_sub?.toLowerCase().includes(searchLower)
        const descMatch = b.description?.toLowerCase().includes(searchLower)
        const neighborhoodMatch = b.neighborhood?.toLowerCase().includes(searchLower)
        
        return nameMatch || categoryMatch || descMatch || neighborhoodMatch
      })

      results = results.map(b => {
        let relevance = 0
        const searchLower = queryFromUrl.toLowerCase().trim()
        
        if (b.name.toLowerCase().startsWith(searchLower)) relevance += 100
        else if (b.name.toLowerCase().includes(searchLower)) relevance += 50
        
        if (b.category_sub?.toLowerCase().includes(searchLower)) relevance += 30
        if (b.description?.toLowerCase().includes(searchLower)) relevance += 20
        if (b.neighborhood?.toLowerCase().includes(searchLower)) relevance += 10
        
        if (b.plan_type === 'premium') relevance += 15
        if (b.has_active_coupons) relevance += 10
        
        return { ...b, relevance }
      })
    }

    // Filtro de cupons
    if (hasCouponsFromUrl) {
      results = results.filter(b => b.has_active_coupons)
    }

    // Filtro de aberto agora
    if (isOpenFromUrl) {
      const now = new Date()
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
      const currentTime = now.toTimeString().slice(0, 5)
      
      results = results.filter(b => {
        if (!b.opening_hours || typeof b.opening_hours !== 'object') return false
        
        const schedule = b.opening_hours[dayOfWeek]
        if (!schedule || schedule.closed) return false
        
        return currentTime >= schedule.open && currentTime <= schedule.close
      })
    }

    // Ordenação
    results.sort((a, b) => {
      if (sortByFromUrl === 'name') {
        return a.name.localeCompare(b.name)
      }
      
      if (sortByFromUrl === 'rating') {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        if (ratingB !== ratingA) return ratingB - ratingA
        return (b.total_reviews || 0) - (a.total_reviews || 0)
      }
      
      // Relevância (padrão)
      if (queryFromUrl && queryFromUrl.trim() !== '') {
        return (b.relevance || 0) - (a.relevance || 0)
      }
      
      if (a.plan_type !== b.plan_type) {
        return a.plan_type === 'premium' ? -1 : 1
      }
      return (b.rating || 0) - (a.rating || 0)
    })

    return results
  }, [allBusinesses, queryFromUrl, hasCouponsFromUrl, isOpenFromUrl, sortByFromUrl])

  const activeFiltersCount = [hasCouponsFromUrl, isOpenFromUrl].filter(Boolean).length

  return (
    <>
      <BuscaHero 
        searchQuery={queryFromUrl} 
        onSearchChange={handleSearchChange} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de categorias */}
          <aside className="lg:w-64">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Categorias</h2>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  disabled={categoryLoading}
                  className={`px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium whitespace-nowrap lg:w-full lg:text-left transition-all duration-200 disabled:opacity-50 ${
                    categoryFromUrl === cat.value
                      ? 'bg-[#C2227A] text-white'
                      : 'bg-white text-[#6B7280] hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{capitalizeCategory(cat.label)}</span>
                  <span className="ml-2 text-xs opacity-75">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Filtros adicionais */}
            <div className="mt-6 hidden lg:block">
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Filtros</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={hasCouponsFromUrl}
                    onChange={(e) => handleFilterChange('cupons', e.target.checked)}
                    className="rounded text-[#C2227A] focus:ring-[#C2227A]"
                  />
                  <Tag className="w-4 h-4 text-[#C2227A]" />
                  <span className="text-sm text-[#1A1A1A]">Com cupons ativos</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={isOpenFromUrl}
                    onChange={(e) => handleFilterChange('aberto', e.target.checked)}
                    className="rounded text-[#C2227A] focus:ring-[#C2227A]"
                  />
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-[#1A1A1A]">Aberto agora</span>
                </label>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    updateURL({ cupons: null, aberto: null })
                  }}
                  className="mt-4 text-sm text-[#C2227A] hover:underline"
                >
                  Limpar filtros ({activeFiltersCount})
                </button>
              )}
            </div>
          </aside>

          {/* Resultados */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="text-[#6B7280] flex items-center gap-2">
                  {categoryLoading && (
                    <span className="inline-block w-4 h-4 border-2 border-[#C2227A] border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {loading ? 'Carregando...' : `${filteredBusinesses.length} resultado${filteredBusinesses.length !== 1 ? 's' : ''}`}
                </span>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#C2227A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              <select
                value={sortByFromUrl}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C2227A]/20 focus:border-[#C2227A]"
              >
                <option value="relevance">Mais relevantes</option>
                <option value="name">Nome A-Z</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>

            {/* Filtros mobile */}
            {showFilters && (
              <div className="lg:hidden bg-white border rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Filtros</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={hasCouponsFromUrl}
                      onChange={(e) => handleFilterChange('cupons', e.target.checked)}
                      className="rounded text-[#C2227A] focus:ring-[#C2227A]"
                    />
                    <Tag className="w-4 h-4 text-[#C2227A]" />
                    <span className="text-sm">Com cupons ativos</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={isOpenFromUrl}
                      onChange={(e) => handleFilterChange('aberto', e.target.checked)}
                      className="rounded text-[#C2227A] focus:ring-[#C2227A]"
                    />
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Aberto agora</span>
                  </label>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      updateURL({ cupons: null, aberto: null })
                      setShowFilters(false)
                    }}
                    className="mt-4 text-sm text-[#C2227A] hover:underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => <LoadingCard key={i} />)}
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-[#6B7280] mb-6">
                  Tente buscar por outros termos ou ajustar os filtros
                </p>
                <Button variant="ghost" onClick={handleClearAll}>
                  Limpar tudo
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