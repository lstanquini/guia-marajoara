'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getIconBySlug } from '@/lib/iconMapping'
import { Carousel } from '@/components/ui/Carousel'
import { Star, MapPin } from 'lucide-react'

interface Business {
  id: string
  name: string
  slug: string
  category_main: string
  category_sub: string | null
  logo_url: string | null
  banner_url: string | null
  rating: number | null
  address: string
  neighborhood: string | null
  city: string
  created_at: string
  has_active_coupons?: boolean
}

// Função para calcular tempo relativo (ex: "Há 2 dias")
function getTimeAgo(dateString: string): string {
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Há 1 dia'
  if (diffDays < 7) return `Há ${diffDays} dias`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `Há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
  }
  const months = Math.floor(diffDays / 30)
  return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`
}

// Função para validar URL de imagem
function getValidImageUrl(url: string | null): string | null {
  if (!url?.trim()) return null
  try {
    new URL(url)
    return url
  } catch {
    return url.startsWith('/') ? url : null
  }
}

// Função para gerar gradiente baseado no slug
function generateGradient(slug: string): string {
  const gradients = [
    'bg-gradient-to-br from-purple-400 to-pink-500',
    'bg-gradient-to-br from-blue-400 to-purple-500',
    'bg-gradient-to-br from-green-400 to-teal-500',
    'bg-gradient-to-br from-orange-400 to-red-500',
    'bg-gradient-to-br from-pink-400 to-rose-500',
    'bg-gradient-to-br from-indigo-400 to-purple-500',
    'bg-gradient-to-br from-teal-400 to-blue-500',
    'bg-gradient-to-br from-amber-400 to-orange-500',
    'bg-gradient-to-br from-rose-400 to-pink-500',
    'bg-gradient-to-br from-cyan-400 to-blue-500',
  ]
  
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i)
    hash = hash & hash
  }
  
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

// Componente do Card (extraído para reutilizar)
function BusinessCard({ business }: { business: Business }) {
  const CategoryIcon = getIconBySlug(business.category_main)
  const bannerUrl = getValidImageUrl(business.banner_url)
  const logoUrl = getValidImageUrl(business.logo_url)
  const timeAgo = getTimeAgo(business.created_at)
  
  return (
    <Link
      href={`/empresas/${business.slug}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      {/* Banner da empresa - maior no mobile */}
      <div className={`relative h-56 md:h-48 flex-shrink-0 ${
        !bannerUrl ? generateGradient(business.slug) : 'bg-gray-200'
      }`}>
        {bannerUrl && (
          <Image
            src={bannerUrl}
            alt={`Banner de ${business.name}`}
            fill
            className="object-contain"
          />
        )}
        
        {/* Badge "Novo" ou "Novo Cupom" */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            business.has_active_coupons 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {business.has_active_coupons ? 'Novo Cupom' : 'Novo'}
          </span>
        </div>
      </div>

      {/* Informações da empresa */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          {/* Logo */}
          <div className={`w-14 h-14 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl md:text-lg flex-shrink-0 relative overflow-hidden ${
            logoUrl ? 'bg-white border border-gray-100' : 'bg-gradient-to-br from-pink-500 to-purple-500'
          }`}>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`Logo de ${business.name}`}
                fill
                className="object-contain p-1"
              />
            ) : (
              business.name.substring(0, 2).toUpperCase()
            )}
          </div>

          {/* Nome e ícone da categoria */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <h3 className="font-bold text-gray-800 text-lg md:text-lg truncate flex-1">
                {business.name}
              </h3>
              {CategoryIcon && (
                <CategoryIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {business.category_sub || business.category_main}
            </p>
          </div>
        </div>

        {/* Rating e tempo */}
        <div className="flex items-center justify-between text-sm mb-2">
          {business.rating && business.rating > 0 ? (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4" fill="currentColor" />
              <span className="font-semibold">{business.rating.toFixed(1)}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-xs">Sem avaliações</span>
          )}
          <span className="text-gray-400 text-xs">{timeAgo}</span>
        </div>

        {/* Endereço */}
        <div className="flex items-start gap-1 text-xs text-gray-500 mt-auto">
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <p className="line-clamp-1">
            {business.neighborhood ? `${business.neighborhood}, ` : ''}{business.city}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function RecentBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadRecentBusinesses() {
      try {
        // Busca as 9 últimas empresas aprovadas
        const { data: businessesData, error: bizError } = await supabase
          .from('businesses')
          .select('id, name, slug, category_main, category_sub, logo_url, banner_url, rating, address, neighborhood, city, created_at')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(9)

        if (bizError) throw bizError

        // Para cada empresa, verifica se tem cupons ativos
        const businessesWithCoupons = await Promise.all(
          (businessesData || []).map(async (business) => {
            const { data: coupons } = await supabase
              .from('coupons')
              .select('id')
              .eq('business_id', business.id)
              .eq('status', 'active')
              .gte('expires_at', new Date().toISOString())
              .limit(1)

            return {
              ...business,
              has_active_coupons: (coupons?.length || 0) > 0
            }
          })
        )

        setBusinesses(businessesWithCoupons)
      } catch (error) {
        console.error('Erro ao carregar empresas recentes:', error)
        setBusinesses([])
      } finally {
        setLoading(false)
      }
    }

    loadRecentBusinesses()
  }, [supabase])

  // Loading skeleton
  if (loading) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-gray-800 md:text-4xl">
              Acabaram de Chegar
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Fique por dentro das últimas novidades e cupons do bairro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Se não tem empresas
  if (businesses.length === 0) {
    return null
  }

  // Agrupa em slides de 3 para desktop
  const slides = []
  for (let i = 0; i < businesses.length; i += 3) {
    slides.push(businesses.slice(i, i + 3))
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-gray-800">
            Acabaram de Chegar
          </h2>
          <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-500">
            Fique por dentro das últimas novidades e cupons do bairro.
          </p>
        </div>

        {/* Mobile: 1 card por vez, fullwidth */}
        <div className="md:hidden -mx-4">
          <Carousel arrowsOutside={false} autoplay={false}>
            {businesses.map((business) => (
              <div key={business.id} className="px-4">
                <BusinessCard business={business} />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Desktop: 3 cards por slide */}
        <div className="hidden md:block">
          <Carousel arrowsOutside={true} autoplay={false}>
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="w-full">
                <div className="grid grid-cols-3 gap-6">
                  {slide.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  )
}