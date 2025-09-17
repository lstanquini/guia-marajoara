'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchBusinesses } from '@/lib/mock-data'
import { SearchBar } from '@/components/ui/SearchBar'
import { BusinessCard } from '@/components/BusinessCard'
import { Skeleton } from '@/components/ui/Loading'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const observerTarget = useRef<HTMLDivElement>(null)

  // Carregar dados iniciais
  const loadBusinesses = useCallback(async (reset = false) => {
    if (loading) return
    
    setLoading(true)
    const currentPage = reset ? 1 : page
    
    const result = await searchBusinesses(query, currentPage, 12)
    
    if (reset) {
      setBusinesses(result.businesses)
      setPage(2)
    } else {
      setBusinesses(prev => [...prev, ...result.businesses])
      setPage(prev => prev + 1)
    }
    
    setHasMore(result.hasMore)
    setLoading(false)
  }, [query, page, loading])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadBusinesses()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, loadBusinesses])

  // Busca inicial e quando query muda
  useEffect(() => {
    setBusinesses([])
    setPage(1)
    loadBusinesses(true)
  }, [query])

  return (
    <div className="min-h-screen bg-background">
      {/* Header com busca */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar empresas, categorias..."
          />
          <div className="mt-2 text-sm text-text-secondary">
            {businesses.length > 0 && `${businesses.length} empresas encontradas`}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Filtros - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Filtros</h3>
              
              <div className="space-y-4">
                {/* Categoria */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Categoria</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Restaurantes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Beleza</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Pet Shop</span>
                    </label>
                  </div>
                </div>

                {/* Distância */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Distância</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="distance" className="mr-2" />
                      <span className="text-sm">Até 1km</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="distance" className="mr-2" />
                      <span className="text-sm">Até 3km</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="distance" className="mr-2" />
                      <span className="text-sm">Até 5km</span>
                    </label>
                  </div>
                </div>

                {/* Com cupom */}
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm font-medium">Apenas com cupom</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Resultados */}
          <main className="lg:col-span-4">
            {/* Grid de cards - 3 colunas desktop, 1 mobile */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {businesses.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[140px] rounded-xl bg-white p-4">
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Observer target for infinite scroll */}
            <div ref={observerTarget} className="h-10" />

            {/* Fim da lista */}
            {!hasMore && businesses.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-text-secondary">
                  Você viu todas as {businesses.length} empresas
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="mt-4 text-verde hover:underline"
                >
                  Voltar ao topo ↑
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}