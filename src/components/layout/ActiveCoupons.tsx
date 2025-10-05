'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getIconBySlug } from '@/lib/iconMapping'
import { Carousel } from '@/components/ui/Carousel'
import { Calendar, Users } from 'lucide-react'

interface Coupon {
  id: string
  title: string
  description: string
  discount_text: string | null
  image_url: string
  expires_at: string
  views_count: number
  redemptions_count: number
  business: {
    id: string
    name: string
    slug: string
    logo_url: string | null
    category_main: string
    whatsapp: string | null
  }
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

// Componente do Card individual
function CouponCard({ coupon }: { coupon: Coupon }) {
  const supabase = createClientComponentClient()
  const CategoryIcon = getIconBySlug(coupon.business?.category_main || '')
  const logoUrl = getValidImageUrl(coupon.business?.logo_url)
  
  async function handleCouponClick() {
    try {
      // Incrementar visualizações
      await supabase.rpc('increment_coupon_views', { coupon_id: coupon.id })
      
      // Registrar resgate completo (incrementa redemptions_count + salva histórico)
      await supabase.rpc('register_coupon_redemption', {
        p_coupon_id: coupon.id,
        p_user_name: null, // Opcional: pode coletar depois
        p_whatsapp_hash: null, // Hash do telefone (LGPD)
        p_ip_hash: null, // Hash do IP
        p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      })
      
      // Abrir WhatsApp
      const whatsapp = coupon.business?.whatsapp || ''
      if (whatsapp) {
        const message = `Olá! Vi o cupom "${coupon.title}" no Guia Marajoara e gostaria de usá-lo.`
        const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
      }
    } catch (error) {
      console.error('Erro ao registrar cupom:', error)
      // Mesmo com erro, abre o WhatsApp (não bloqueia o usuário)
      const whatsapp = coupon.business?.whatsapp || ''
      if (whatsapp) {
        const message = `Olá! Vi o cupom "${coupon.title}" no Guia Marajoara e gostaria de usá-lo.`
        const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
      }
    }
  }
  
  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={handleCouponClick}
    >
      {/* Imagem do cupom */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={coupon.image_url}
          alt={coupon.title}
          fill
          className="object-cover"
        />
        
        {/* Badge de desconto */}
        {coupon.discount_text && (
          <div className="absolute top-2 right-2 bg-[#C2227A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {coupon.discount_text}
          </div>
        )}
        
        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center">
          <div className="mb-3">
            {logoUrl ? (
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mx-auto mb-3">
                <Image
                  src={logoUrl}
                  alt={coupon.business?.name || ''}
                  width={48}
                  height={48}
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                {coupon.business?.name?.substring(0, 2).toUpperCase() || 'C'}
              </div>
            )}
          </div>
          
          <p className="font-bold text-lg mb-1 line-clamp-2">{coupon.title}</p>
          <p className="text-sm mb-1 opacity-90">{coupon.business?.name}</p>
          
          {coupon.description && (
            <p className="text-xs mb-4 opacity-75 line-clamp-2">{coupon.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-xs mb-4 opacity-75">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Até {new Date(coupon.expires_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {coupon.redemptions_count || 0} resgates
            </span>
          </div>
          
          <button className="bg-[#25D366] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#20BA5A] transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Resgatar
          </button>
        </div>
      </div>

      {/* Informações abaixo da imagem */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate flex-1">{coupon.title}</h3>
          {CategoryIcon && (
            <CategoryIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{coupon.business?.name}</p>
      </div>
    </div>
  )
}

export function ActiveCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadCoupons() {
      try {
        const now = new Date().toISOString()
        
        const { data, error } = await supabase
          .from('coupons')
          .select(`
            *,
            business:businesses(
              id,
              name,
              slug,
              logo_url,
              category_main,
              whatsapp
            )
          `)
          .eq('status', 'active')
          .gte('expires_at', now)
          .order('created_at', { ascending: false })
          .limit(15) // Desktop: 15 cupons

        if (error) throw error
        setCoupons(data || [])
      } catch (error) {
        console.error('Erro ao carregar cupons:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCoupons()
  }, [supabase])

  // Loading skeleton
  if (loading) {
    return (
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-gray-800 md:text-4xl">
              Cupons Ativos
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Economize agora com descontos exclusivos dos parceiros
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Se não tem cupons
  if (coupons.length === 0) {
    return null
  }

  // Mobile: Agrupa em slides de 4 (2x2) - limite de 12 cupons
  const mobileSlides = []
  const mobileCoupons = coupons.slice(0, 12)
  for (let i = 0; i < mobileCoupons.length; i += 4) {
    mobileSlides.push(mobileCoupons.slice(i, i + 4))
  }

  // Desktop: Agrupa em slides de 5 - até 15 cupons
  const desktopSlides = []
  const desktopCoupons = coupons.slice(0, 15)
  for (let i = 0; i < desktopCoupons.length; i += 5) {
    desktopSlides.push(desktopCoupons.slice(i, i + 5))
  }

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-gray-800 md:text-4xl">
            Cupons Ativos
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Economize agora com descontos exclusivos dos parceiros
          </p>
        </div>

        {/* Mobile: 4 cards por slide (2x2) */}
        <div className="md:hidden">
          <Carousel arrowsOutside={true} autoplay={false}>
            {mobileSlides.map((slide, slideIndex) => (
              <div key={slideIndex} className="w-full px-2">
                <div className="grid grid-cols-2 gap-3">
                  {slide.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Desktop: 5 cards por slide */}
        <div className="hidden md:block">
          <Carousel arrowsOutside={true} autoplay={false}>
            {desktopSlides.map((slide, slideIndex) => (
              <div key={slideIndex} className="w-full">
                <div className="grid grid-cols-5 gap-4">
                  {slide.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Link para ver todos */}
        <div className="mt-8 text-center">
          <Link 
            href="/cupons"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C2227A] text-white rounded-xl font-semibold hover:bg-[#A01860] transition-colors"
          >
            Ver Todos os Cupons
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}