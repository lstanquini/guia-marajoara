'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Star, MapPin, Phone } from 'lucide-react'

// Interface Business tipada
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

interface BusinessCardProps {
  business: Business
  variant?: 'default' | 'featured'
}

export function BusinessCard({ business, variant = 'default' }: BusinessCardProps) {
  const handleWhatsApp = () => {
    if (business.whatsapp) {
      const phone = business.whatsapp.replace(/\D/g, '')
      const message = `Olá! Vi vocês no Guia Marajoara e gostaria de mais informações.`
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      restaurante: '🍕',
      pet: '🐾',
      fitness: '💪',
      beleza: '💅',
      saude: '🏥',
      vestuario: '👕',
      imovel: '🏠',
      doces: '🍰',
      acessorios: '👜',
      servicos: '🔧'
    }
    return emojis[category] || '🏪'
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      restaurante: 'Restaurante',
      pet: 'Pet Shop',
      fitness: 'Fitness',
      beleza: 'Beleza',
      saude: 'Saúde',
      vestuario: 'Vestuário',
      imovel: 'Imóvel',
      doces: 'Doces & Bolos',
      acessorios: 'Acessórios',
      servicos: 'Serviços'
    }
    return labels[category] || category
  }

  return (
    <Card variant={variant === 'featured' ? 'feature' : 'business'}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="text-3xl">{getCategoryEmoji(business.category_main)}</div>
          {business.plan_type === 'premium' && (
            <span className="bg-gradient-to-r from-[#C2227A] to-[#A01860] text-white text-xs font-semibold px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>
        <CardTitle className="line-clamp-1">{business.name}</CardTitle>
        <CardDescription>{getCategoryLabel(business.category_main)}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {business.description && (
          <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
            {business.description}
          </p>
        )}

        {business.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(business.rating!) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs text-[#6B7280]">
              {business.rating} ({business.total_reviews || 0})
            </span>
          </div>
        )}

        {business.address && (
          <div className="flex items-start gap-1 text-xs text-[#6B7280]">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {business.address}
              {business.address_number && `, ${business.address_number}`}
              {business.neighborhood && ` - ${business.neighborhood}`}
            </span>
          </div>
        )}

        {business.phone && (
          <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-1">
            <Phone size={14} />
            <span>{business.phone}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        {business.whatsapp && (
          <Button
            size="sm"
            variant="whatsapp"
            onClick={handleWhatsApp}
          >
            WhatsApp
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.location.href = `/empresas/${business.slug}`}
        >
          Ver mais
        </Button>
      </CardFooter>
    </Card>
  )
}