'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Star, MapPin, Tag } from 'lucide-react'
import { capitalizeCategory } from '@/lib/utils'
import { getCategoryInfo, type BusinessSearchResult, type Category } from '@/lib/services/search'

interface BusinessCardProps {
  business: BusinessSearchResult
  variant?: 'default' | 'featured'
}

export function BusinessCard({ business, variant = 'default' }: BusinessCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', whatsapp: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null)

  // Buscar informações da categoria
  useEffect(() => {
    if (business.category_main) {
      getCategoryInfo(business.category_main).then(setCategoryInfo)
    }
  }, [business.category_main])

  const handleSubmit = async () => {
    if (!formData.name || !formData.whatsapp) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setIsSubmitting(true)
    
    setTimeout(() => {
      const phone = business.whatsapp?.replace(/\D/g, '')
      const message = `Olá! Sou ${formData.name}, vi vocês no Guia Marajoara e gostaria de mais informações.`
      
      if (phone) {
        window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank')
      }
      
      setIsSubmitting(false)
      setModalOpen(false)
      setFormData({ name: '', whatsapp: '' })
    }, 1000)
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      const match = numbers.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/)
      if (match) {
        return [
          match[1] && `(${match[1]}`,
          match[2] && `) ${match[2]}`,
          match[3] && `-${match[3]}`
        ].filter(Boolean).join('')
      }
    }
    return value
  }

  // Pegar emoji da categoria ou usar padrão
  const categoryEmoji = categoryInfo?.icon || '🏪'
  
  // Pegar nome da categoria ou usar o slug capitalizado
  const categoryName = categoryInfo?.name || capitalizeCategory(business.category_main)

  // Pegar banner (prioriza mobile, depois desktop)
  const bannerUrl = business.banner_mobile_url || business.banner_url

  return (
    <>
      <Card variant={variant === 'featured' ? 'feature' : 'business'}>
        {/* Banner no topo */}
        {bannerUrl && (
          <div className="w-full h-32 overflow-hidden rounded-t-2xl">
            <img
              src={bannerUrl}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="text-3xl">{business.logo_url || categoryEmoji}</div>
            <div className="flex flex-col gap-1 items-end">
              {business.plan_type === 'premium' && (
                <span className="bg-gradient-to-r from-[#C2227A] to-[#A01860] text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
              {business.has_active_coupons && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  <Tag size={12} />
                  Cupom
                </span>
              )}
            </div>
          </div>
          <CardTitle className="line-clamp-1">{business.name}</CardTitle>
          <CardDescription>
            {business.category_sub
              ? capitalizeCategory(business.category_sub)
              : categoryName}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {business.description && (
            <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
              {business.description}
            </p>
          )}

          {/* Sempre mostrar avaliações, mesmo quando 0 */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={business.rating && i < Math.floor(business.rating) ? '#FBBF24' : 'none'}
                  className={business.rating && i < Math.floor(business.rating) ? 'text-yellow-400' : 'text-gray-300'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-xs text-[#6B7280]">
              {business.rating ? `${business.rating} (${business.total_reviews || 0})` : '0 avaliações'}
            </span>
          </div>

          {business.address && (
            <div className="flex items-start gap-1 text-xs text-[#6B7280]">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {business.address}
                {business.neighborhood && ` - ${business.neighborhood}`}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-2">
          {business.whatsapp && (
            <Button
              size="sm"
              variant="whatsapp"
              onClick={() => setModalOpen(true)}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Entrar em contato"
        description={`Enviaremos sua mensagem para ${business.name} via WhatsApp.`}
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Seu nome
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite seu nome"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Seu WhatsApp
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="whatsapp"
              onClick={handleSubmit}
              loading={isSubmitting}
              className="flex-1"
            >
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}