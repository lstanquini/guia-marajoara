'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Star, MapPin, Tag } from 'lucide-react'
import { capitalizeCategory } from '@/lib/utils'
import { type BusinessSearchResult } from '@/lib/services/search'

interface BusinessCardProps {
  business: BusinessSearchResult
  variant?: 'default' | 'featured'
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

export function BusinessCard({ business, variant = 'default' }: BusinessCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', whatsapp: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name || !formData.whatsapp) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const phone = business.whatsapp?.replace(/\D/g, '')
      const message = `Olá! Sou ${formData.name}, vi vocês no MarajoaraON e gostaria de mais informações.`

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

  const bannerUrl = getValidImageUrl(business.banner_mobile_url || business.banner_url)
  const logoUrl = getValidImageUrl(business.logo_url)

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Banner - igual ao da home */}
        <Link href={`/empresas/${business.slug}`} className="block">
          <div className={`relative h-48 flex-shrink-0 ${
            !bannerUrl ? generateGradient(business.slug) : 'bg-gray-200'
          }`}>
            {bannerUrl && (
              <Image
                src={bannerUrl}
                alt={`Banner de ${business.name}`}
                fill
                className="object-cover"
              />
            )}

            {/* Badges no canto superior direito */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {business.plan_type === 'premium' && (
                <span className="bg-gradient-to-r from-[#C2227A] to-[#A01860] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                  Premium
                </span>
              )}
              {business.has_active_coupons && (
                <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Tag size={12} />
                  Cupom
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Informações - igual ao da home */}
        <div className="p-5 flex-1 flex flex-col">
          <Link href={`/empresas/${business.slug}`} className="block">
            <div className="flex items-start gap-3 mb-3">
              {/* Logo */}
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative overflow-hidden ${
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

              {/* Nome e categoria */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-lg truncate mb-1">
                  {business.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {business.category_sub
                    ? capitalizeCategory(business.category_sub)
                    : capitalizeCategory(business.category_main)}
                </p>
              </div>
            </div>
          </Link>

          {/* Descrição */}
          {business.description && (
            <Link href={`/empresas/${business.slug}`} className="block">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {business.description}
              </p>
            </Link>
          )}

          {/* Rating */}
          <Link href={`/empresas/${business.slug}`} className="block mb-3">
            <div className="flex items-center gap-1">
              {business.rating && business.rating > 0 ? (
                <>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(business.rating!) ? '#FBBF24' : 'none'}
                        className={i < Math.floor(business.rating!) ? 'text-yellow-400' : 'text-gray-300'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 ml-1">
                    {business.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({business.total_reviews || 0})
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-gray-300"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-1">0 avaliações</span>
                </div>
              )}
            </div>
          </Link>

          {/* Endereço */}
          {business.address && (
            <Link href={`/empresas/${business.slug}`} className="block mb-4">
              <div className="flex items-start gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <p className="line-clamp-1">
                  {business.neighborhood ? `${business.neighborhood}, ` : ''}{business.city}
                </p>
              </div>
            </Link>
          )}

          {/* Botões */}
          <div className="mt-auto flex gap-2">
            {business.whatsapp && (
              <Button
                size="sm"
                variant="whatsapp"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setModalOpen(true)
                }}
                className="flex-1"
              >
                WhatsApp
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.location.href = `/empresas/${business.slug}`
              }}
              className={business.whatsapp ? 'flex-1' : 'w-full'}
            >
              Ver mais
            </Button>
          </div>
        </div>
      </div>

      {/* Modal WhatsApp */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Entrar em contato"
        description={`Enviaremos sua mensagem para ${business.name} via WhatsApp.`}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
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
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-900 mb-1">
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
