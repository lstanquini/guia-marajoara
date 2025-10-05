// src/components/layout/CategoryHighlights.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getIconBySlug } from '@/lib/iconMapping'

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
          .limit(6)
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

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Explore por Categoria</h2>
          <p className="text-gray-500 mt-2">Encontre rapidamente o que você precisa.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => {
            const gradient = generateGradient(category.slug)
            
            return (
              <Link
                key={category.id}
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
          })}
        </div>
      </div>
    </section>
  )
}