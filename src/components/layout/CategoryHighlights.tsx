// src/components/layout/CategoryHighlights.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getIconBySlug } from '@/lib/iconMapping'
import { Carousel } from '@/components/ui/Carousel'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image_url?: string
  order_index: number
  business_count?: number
}

function generateGradient(slug: string): string {
  const gradients = [
    'from-purple-400 to-pink-500', 'from-blue-400 to-purple-500',
    'from-green-400 to-teal-500', 'from-orange-400 to-red-500',
    'from-pink-400 to-rose-500', 'from-indigo-400 to-purple-500',
    'from-teal-400 to-blue-500', 'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500', 'from-cyan-400 to-blue-500',
  ]
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i)
    hash = hash & hash
  }
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

let categoriesCache: {
  data: Category[] | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export function CategoryHighlights() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadCategories() {
      try {
        const now = Date.now()
        if (categoriesCache.data && (now - categoriesCache.timestamp) < CACHE_TTL) {
          setCategories(categoriesCache.data)
          setLoading(false)
          return
        }

        const { data: categoriesData, error: catError } = await supabase
          .from('categories')
          .select('id, name, slug, icon, image_url, order_index')
          .order('order_index')
          .limit(20)  // Aumentado de 6 para 20 para suportar scroll
        if (catError) throw catError

        const { data: businesses } = await supabase
          .from('businesses')
          .select('category_main')
          .eq('status', 'approved')

        const counts: Record<string, number> = {}
        if (businesses) {
          businesses.forEach(b => {
            counts[b.category_main] = (counts[b.category_main] || 0) + 1
          })
        }

        const categoriesWithCount = categoriesData?.map(cat => ({
          ...cat,
          business_count: counts[cat.slug] || 0
        })) || []

        categoriesCache = {
          data: categoriesWithCount,
          timestamp: now
        }

        setCategories(categoriesWithCount)
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [supabase])

  const renderIcon = (category: Category) => {
    const LucideIcon = getIconBySlug(category.slug)
    
    if (LucideIcon) {
      return <LucideIcon className="w-7 h-7" />
    }
    
    if (category.icon) {
      return <span className="text-2xl">{category.icon}</span>
    }
    
    return <span className="text-xl font-bold">{category.name.charAt(0)}</span>
  }

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Explore por Categoria</h2>
            <p className="text-gray-500 mt-2">Encontre rapidamente o que você precisa.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-sm animate-pulse aspect-square bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Componente individual de categoria
  const CategoryCard = ({ category }: { category: Category }) => {
    const gradient = generateGradient(category.slug)

    return (
      <Link
        href={`/busca?categoria=${category.slug}`}
        className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-square"
      >
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/20 transition-all" />

        {/* Ícone no canto superior direito */}
        <div className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-lg bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform text-white">
          {renderIcon(category)}
        </div>

        <div className="relative h-full flex flex-col items-center justify-center p-3 sm:p-4 text-white">
          <h3 className="font-bold text-xs sm:text-sm md:text-base text-center leading-tight">
            {category.name}
          </h3>
          <p className="text-[10px] sm:text-xs opacity-90 mt-1 h-4">
            {category.business_count !== undefined && category.business_count > 0
              ? `${category.business_count} ${category.business_count === 1 ? 'parceiro' : 'parceiros'}`
              : ' '
            }
          </p>
        </div>
      </Link>
    )
  }

  // Mobile: Agrupa em slides de 6 (3x2)
  const mobileSlides = []
  for (let i = 0; i < categories.length; i += 6) {
    mobileSlides.push(categories.slice(i, i + 6))
  }

  // Desktop: Agrupa em slides de 6 (em linha)
  const desktopSlides = []
  for (let i = 0; i < categories.length; i += 6) {
    desktopSlides.push(categories.slice(i, i + 6))
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-gray-800">
            Explore por Categoria
          </h2>
          <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-500">
            Encontre rapidamente o que você precisa
          </p>
        </div>

        {/* Mobile: Carrossel 3x2 com swipe */}
        <div className="md:hidden -mx-4">
          <Carousel arrowsOutside={false} autoplay={false}>
            {mobileSlides.map((slide, slideIndex) => (
              <div key={slideIndex} className="px-4">
                <div className="grid grid-cols-3 gap-3">
                  {slide.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            ))}
          </Carousel>

          {/* Botão Veja Mais - Mobile */}
          <div className="mt-6 text-center">
            <Link
              href="/busca"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C2227A] text-white rounded-xl font-semibold hover:bg-[#A01860] transition-colors"
            >
              Veja Mais Categorias
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Desktop: Carrossel 6 por slide */}
        <div className="hidden md:block">
          <Carousel arrowsOutside={true} autoplay={false}>
            {desktopSlides.map((slide, slideIndex) => (
              <div key={slideIndex} className="w-full">
                <div className="grid grid-cols-6 gap-4">
                  {slide.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            ))}
          </Carousel>

          {/* Botão Veja Mais - Desktop */}
          <div className="mt-8 text-center">
            <Link
              href="/busca"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C2227A] text-white rounded-xl font-semibold hover:bg-[#A01860] transition-colors"
            >
              Veja Mais Categorias
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}