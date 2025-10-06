'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getIconBySlug } from '@/lib/iconMapping'
import { Carousel } from '@/components/ui/Carousel'
import { Award, Star } from 'lucide-react'

interface FeaturedBusiness {
  id: string
  business_id: string
  coupon_id: string | null
  custom_title: string | null
  custom_description: string | null
  custom_button_text: string | null
  custom_button_url: string | null
  video_url: string | null
  order_index: number
  business: {
    id: string
    name: string
    slug: string
    category_main: string
    category_sub: string | null
    logo_url: string | null
    banner_url: string | null
    banner_mobile_url: string | null // <-- NOVO: Banner específico para mobile
    rating: number | null
    total_reviews: number | null
    neighborhood: string | null
    city: string
    whatsapp: string | null
  }
  coupon: {
    id: string
    title: string
    discount_text: string | null
    expires_at: string
  } | null
}

function getValidImageUrl(url: string | null): string | null {
  if (!url?.trim()) return null
  try {
    new URL(url)
    return url
  } catch {
    return url.startsWith('/') ? url : null
  }
}

function generateGradient(slug: string): string {
  const gradients = [
    'from-purple-400 to-pink-500',
    'from-blue-400 to-purple-500',
    'from-green-400 to-teal-500',
    'from-orange-400 to-red-500',
    'from-pink-400 to-rose-500',
    'from-indigo-400 to-purple-500',
  ]
  
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i)
    hash = hash & hash
  }
  
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

// Componente Mobile - Simplificado
function HeroCardMobile({ featured }: { featured: FeaturedBusiness }) {
  // MOBILE: Usa banner_mobile_url se existir, senão usa banner_url como fallback
  const bannerUrl = getValidImageUrl(featured.business.banner_mobile_url) || 
                    getValidImageUrl(featured.business.banner_url)
  const logoUrl = getValidImageUrl(featured.business.logo_url)
  const CategoryIcon = getIconBySlug(featured.business.category_main)
  const displayTitle = featured.custom_title || featured.business.name
  
  return (
    <div className="relative h-[85vh] min-h-[600px] w-full">
      {/* Background */}
      <div className="absolute inset-0">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={displayTitle}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${generateGradient(featured.business.slug)}`} />
        )}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      
      {/* Badge Premium */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
        <Award className="w-4 h-4" />
        DESTAQUE DA SEMANA
      </div>
      
      {/* Conteúdo */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
        <div className="w-full max-w-md text-center">
          
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center relative overflow-hidden">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={featured.business.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <span className="text-3xl font-bold text-pink-600">
                  {featured.business.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          
          {/* Categoria + Rating */}
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="px-3 py-1.5 bg-pink-600 text-white rounded-full text-xs font-semibold flex items-center gap-1.5">
              {CategoryIcon && <CategoryIcon className="w-3.5 h-3.5" />}
              {featured.business.category_main}
            </span>
            
            {featured.business.rating && featured.business.rating > 0 && (
              <span className="px-3 py-1.5 bg-white/25 backdrop-blur-md text-white rounded-full text-xs font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5" fill="currentColor" />
                {featured.business.rating.toFixed(1)} ({featured.business.total_reviews})
              </span>
            )}
          </div>
          
          {/* Nome */}
          <h1 className="text-3xl font-black text-white mb-2 drop-shadow-lg leading-tight">
            {displayTitle}
          </h1>
          
          {/* Categoria sub */}
          <p className="text-base text-white/90 mb-4">
            {featured.business.category_sub || featured.business.category_main} em {featured.business.neighborhood || featured.business.city}
          </p>
          
          {/* Cupom */}
          {featured.coupon && featured.coupon.discount_text && (
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-xl shadow-xl mb-4">
              <p className="text-xs mb-1">Cupom exclusivo</p>
              <p className="text-2xl font-black">{featured.coupon.discount_text}</p>
              <p className="text-xs opacity-90 mt-1">
                Válido até {new Date(featured.coupon.expires_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </p>
            </div>
          )}
          
          {/* Botão WhatsApp */}
          {featured.business.whatsapp && (
            <a
              href={`https://wa.me/${featured.business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi o destaque de ${displayTitle} no Guia Marajoara`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#20BA5A] transition-colors shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contato via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente Desktop - Completo
function HeroCardDesktop({ featured }: { featured: FeaturedBusiness }) {
  // DESKTOP: Usa apenas banner_url (horizontal)
  const bannerUrl = getValidImageUrl(featured.business.banner_url)
  const logoUrl = getValidImageUrl(featured.business.logo_url)
  const videoUrl = getValidImageUrl(featured.video_url)
  const CategoryIcon = getIconBySlug(featured.business.category_main)
  
  const displayTitle = featured.custom_title || featured.business.name
  const displayDescription = featured.custom_description || 
    `${featured.business.category_sub || featured.business.category_main} em ${featured.business.neighborhood || featured.business.city}`
  
  const buttonText = featured.custom_button_text || 'Ver Cardápio Completo'
  const buttonUrl = featured.custom_button_url || `/empresas/${featured.business.slug}`
  
  return (
    <div className="relative h-screen min-h-[600px] max-h-[800px] w-full">
      <div className="absolute inset-0">
        {videoUrl ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : bannerUrl ? (
          <Image src={bannerUrl} alt={displayTitle} fill className="object-cover" priority />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${generateGradient(featured.business.slug)}`} />
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      
      <div className="absolute top-8 right-8 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl">
        <Award className="w-5 h-5" />
        DESTAQUE DA SEMANA
      </div>
      
      <div className="absolute inset-0 flex items-end pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="mb-6">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-2xl flex items-center justify-center relative overflow-hidden">
                {logoUrl ? (
                  <Image src={logoUrl} alt={featured.business.name} fill className="object-contain p-3" />
                ) : (
                  <span className="text-4xl font-bold text-pink-600">
                    {featured.business.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-pink-600 text-white rounded-full text-sm font-semibold flex items-center gap-2">
                {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                {featured.business.category_main}
              </span>
              
              {featured.business.rating && featured.business.rating > 0 && (
                <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4" fill="currentColor" />
                  {featured.business.rating.toFixed(1)}
                  {featured.business.total_reviews && (
                    <span className="opacity-75">({featured.business.total_reviews})</span>
                  )}
                </span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
              {displayTitle}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
              {displayDescription}
            </p>
            
            {featured.coupon && featured.coupon.discount_text && (
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl mb-8">
                <span className="text-4xl font-black">{featured.coupon.discount_text}</span>
                <div className="border-l border-white/30 pl-4">
                  <p className="text-sm">Cupom exclusivo</p>
                  <p className="font-semibold">
                    Válido até {new Date(featured.coupon.expires_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              {featured.business.whatsapp && (
                <a
                  href={`https://wa.me/${featured.business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi o destaque de ${displayTitle} no Guia Marajoara`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#20BA5A] transition-colors shadow-xl flex items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contato via WhatsApp
                </a>
              )}
              
              <Link
                href={buttonUrl}
                className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors border-2 border-white/30"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeaturedSection() {
  const [featured, setFeatured] = useState<FeaturedBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadFeaturedBusinesses() {
      try {
        const { data, error } = await supabase
          .from('featured_businesses')
          .select(`
            *,
            business:businesses(
              id,
              name,
              slug,
              category_main,
              category_sub,
              logo_url,
              banner_url,
              banner_mobile_url,
              rating,
              total_reviews,
              neighborhood,
              city,
              whatsapp
            ),
            coupon:coupons(
              id,
              title,
              discount_text,
              expires_at
            )
          `)
          .eq('is_active', true)
          .order('order_index')

        if (error) throw error
        setFeatured(data || [])
      } catch (error) {
        console.error('Erro ao carregar destaques:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedBusinesses()
  }, [supabase])

  if (!loading && featured.length === 0) {
    return null
  }

  if (loading) {
    return (
      <section className="relative h-[85vh] md:h-screen md:min-h-[600px] md:max-h-[800px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container mx-auto px-4">
            <div className="space-y-4 max-w-4xl">
              <div className="w-24 h-24 bg-gray-300 rounded-2xl" />
              <div className="h-16 bg-gray-300 rounded w-3/4" />
              <div className="h-8 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative">
      {/* Mobile */}
      <div className="md:hidden">
        <Carousel autoplay={true} autoplayDelay={6000} arrowsOutside={false}>
          {featured.map((item) => (
            <HeroCardMobile key={item.id} featured={item} />
          ))}
        </Carousel>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <Carousel autoplay={true} autoplayDelay={8000} arrowsOutside={false}>
          {featured.map((item) => (
            <HeroCardDesktop key={item.id} featured={item} />
          ))}
        </Carousel>
      </div>
    </section>
  )
}