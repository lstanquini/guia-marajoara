'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, Calendar, Store, ChevronDown } from 'lucide-react'
import Link from 'next/link'

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

export default function CuponsPublicPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadCoupons()
    loadCategories()
  }, [])

  useEffect(() => {
    filterCoupons()
  }, [searchTerm, selectedCategory, coupons])

  async function loadCategories() {
    try {
      const { data } = await supabase
        .from('businesses')
        .select('category_main')
        .eq('status', 'approved')
        .not('category_main', 'is', null)

      if (data) {
        const uniqueCategories = [...new Set(data.map(b => b.category_main))]
          .filter(Boolean)
          .sort()
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

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

      if (error) throw error
      setCoupons(data || [])
      setFilteredCoupons(data || [])
    } catch (error) {
      console.error('Erro ao carregar cupons:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterCoupons() {
    let filtered = [...coupons]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => 
        c.business?.category_main === selectedCategory
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.business?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCoupons(filtered)
  }

  async function handleCouponClick(coupon: Coupon) {
    // Incrementar visualizações
    await supabase.rpc('increment_coupon_views', { coupon_id: coupon.id })
    
    // Abrir WhatsApp
    const whatsapp = coupon.business?.whatsapp || '5511999999999' // número padrão se não tiver
    const message = `Olá! Vi o cupom "${coupon.title}" no Guia Marajoara e gostaria de usá-lo.`
    const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando cupons...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com busca */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Cupons de Desconto</h1>
          <p className="text-gray-600 mb-6">Economize nas melhores empresas do Jardim Marajoara</p>
          
          {/* Busca e Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar cupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]"
              />
            </div>
            
            <div className="relative md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#C2227A]"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de cupons */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum cupom encontrado</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">{filteredCoupons.length} cupons disponíveis</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCoupons.map(coupon => (
                <div 
                  key={coupon.id} 
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCouponClick(coupon)}
                >
                  {/* Imagem do cupom */}
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={coupon.image_url}
                      alt={coupon.title}
                      className="w-full h-full object-cover"
                    />
                    {coupon.discount_text && (
                      <div className="absolute top-4 right-4 bg-[#C2227A] text-white px-3 py-1 rounded-full font-bold text-sm">
                        {coupon.discount_text}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    {/* Info da empresa */}
                    <div className="flex items-center gap-2 mb-3">
                      {coupon.business?.logo_url ? (
                        <img
                          src={coupon.business.logo_url}
                          alt={coupon.business.name || 'Logo'}
                          className="w-8 h-8 rounded object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'w-8 h-8 rounded bg-gray-200 flex items-center justify-center';
                            iconDiv.innerHTML = '<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-1 4h1m-1 4h1M9 15h1"></path></svg>';
                            target.parentElement?.appendChild(iconDiv);
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                          <Store size={16} className="text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {coupon.business?.name || 'Empresa'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {coupon.business?.category_main || 'Categoria'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Título e descrição */}
                    <h3 className="font-bold text-lg mb-1">{coupon.title}</h3>
                    {coupon.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {coupon.description}
                      </p>
                    )}
                    
                    {/* Validade e stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Até {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <span>{coupon.redemptions_count || 0} resgates</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}