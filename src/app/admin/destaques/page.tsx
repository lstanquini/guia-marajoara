'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  ArrowLeft, Star, Plus, Edit2, Trash2, ChevronUp, ChevronDown, 
  AlertCircle, Search, X, Save
} from 'lucide-react'

interface Business {
  id: string
  name: string
  slug: string
  logo_url: string | null
  category_main: string
}

interface Coupon {
  id: string
  title: string
  business_id: string
}

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
  is_active: boolean
  created_at: string
  business: Business
  coupon: Coupon | null
}

interface FeaturedForm {
  business_id: string
  coupon_id: string | null
  custom_title: string
  custom_description: string
  custom_button_text: string
  custom_button_url: string
  video_url: string
  order_index: number
  is_active: boolean
}

export default function AdminDestaquesPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [featuredBusinesses, setFeaturedBusinesses] = useState<FeaturedBusiness[]>([])
  const [availableBusinesses, setAvailableBusinesses] = useState<Business[]>([])
  const [businessCoupons, setBusinessCoupons] = useState<Record<string, Coupon[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [editingFeatured, setEditingFeatured] = useState<FeaturedBusiness | null>(null)
  const [formData, setFormData] = useState<FeaturedForm>({
    business_id: '',
    coupon_id: null,
    custom_title: '',
    custom_description: '',
    custom_button_text: '',
    custom_button_url: '',
    video_url: '',
    order_index: 1,
    is_active: true
  })

  useEffect(() => {
    if (authLoading || adminLoading) return
    if (!user || !isAdmin) {
      router.push('/login')
    }
  }, [user, isAdmin, authLoading, adminLoading, router])

  useEffect(() => {
    if (!isAdmin) return
    loadData()
  }, [isAdmin])

  async function loadData() {
    setLoading(true)
    try {
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, slug, logo_url, category_main')
        .eq('status', 'approved')
        .order('name')

      if (businessError) throw businessError

      const { data: coupons, error: couponsError } = await supabase
        .from('coupons')
        .select('id, title, business_id')
        .eq('status', 'active')

      if (couponsError) console.warn('Aviso cupons:', couponsError)

      const couponsByBusiness: Record<string, Coupon[]> = {}
      if (coupons && Array.isArray(coupons)) {
        coupons.forEach((coupon: any) => {
          if (!couponsByBusiness[coupon.business_id]) {
            couponsByBusiness[coupon.business_id] = []
          }
          couponsByBusiness[coupon.business_id].push(coupon)
        })
      }

      const { data: featured, error: featuredError } = await supabase
        .from('featured_businesses')
        .select('*')
        .order('order_index')

      if (featuredError) console.warn('Aviso featured:', featuredError)

      const featuredWithRelations: FeaturedBusiness[] = []
      
      if (featured && featured.length > 0 && businesses) {
        for (const f of featured) {
          const business = businesses.find(b => b.id === f.business_id)
          let coupon = null
          
          if (f.coupon_id && coupons) {
            coupon = coupons.find(c => c.id === f.coupon_id) || null
          }
          
          if (business) {
            featuredWithRelations.push({
              ...f,
              business,
              coupon
            })
          }
        }
      }

      setFeaturedBusinesses(featuredWithRelations)
      setAvailableBusinesses(businesses || [])
      setBusinessCoupons(couponsByBusiness)
      
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  function openAddModal(business: Business) {
    const nextOrderIndex = featuredBusinesses.length > 0
      ? Math.max(...featuredBusinesses.map(f => f.order_index)) + 1
      : 1

    setEditingFeatured(null)
    setFormData({
      business_id: business.id,
      coupon_id: null,
      custom_title: '',
      custom_description: '',
      custom_button_text: 'Ver Ofertas',
      custom_button_url: '',
      video_url: '',
      order_index: nextOrderIndex,
      is_active: true
    })
    setShowConfigModal(true)
  }

  function openEditModal(featured: FeaturedBusiness) {
    setEditingFeatured(featured)
    setFormData({
      business_id: featured.business_id,
      coupon_id: featured.coupon_id,
      custom_title: featured.custom_title || '',
      custom_description: featured.custom_description || '',
      custom_button_text: featured.custom_button_text || 'Ver Ofertas',
      custom_button_url: featured.custom_button_url || '',
      video_url: featured.video_url || '',
      order_index: featured.order_index,
      is_active: featured.is_active
    })
    setShowConfigModal(true)
  }

  async function handleSave() {
    if (featuredBusinesses.filter(f => f.is_active).length >= 5 && !editingFeatured && formData.is_active) {
      alert('Você já tem 5 destaques ativos. Desative ou remova um antes de adicionar outro.')
      return
    }

    setSaving(true)
    try {
      const dataToSave = {
        business_id: formData.business_id,
        coupon_id: formData.coupon_id || null,
        custom_title: formData.custom_title || null,
        custom_description: formData.custom_description || null,
        custom_button_text: formData.custom_button_text || null,
        custom_button_url: formData.custom_button_url || null,
        video_url: formData.video_url || null,
        order_index: formData.order_index,
        is_active: formData.is_active
      }

      if (editingFeatured) {
        const { error } = await supabase
          .from('featured_businesses')
          .update(dataToSave)
          .eq('id', editingFeatured.id)

        if (error) throw error
        alert('Destaque atualizado!')
      } else {
        const { error } = await supabase
          .from('featured_businesses')
          .insert(dataToSave)

        if (error) throw error
        alert('Destaque adicionado!')
      }

      setShowConfigModal(false)
      await loadData()
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      alert(`Erro: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(featured: FeaturedBusiness) {
    const businessName = featured.business?.name || 'este destaque'
    const confirmed = confirm(`Remover "${businessName}" dos destaques?`)
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('featured_businesses')
        .delete()
        .eq('id', featured.id)

      if (error) throw error
      alert('Destaque removido!')
      await loadData()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao remover')
    }
  }

  async function toggleActive(featured: FeaturedBusiness) {
    try {
      const { error } = await supabase
        .from('featured_businesses')
        .update({ is_active: !featured.is_active })
        .eq('id', featured.id)

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao atualizar status')
    }
  }

  async function moveUp(index: number) {
    if (index === 0) return
    setReordering(true)
    
    const newFeatured = [...featuredBusinesses]
    const current = newFeatured[index]
    const previous = newFeatured[index - 1]
    
    const tempOrder = current.order_index
    current.order_index = previous.order_index
    previous.order_index = tempOrder
    
    newFeatured[index] = previous
    newFeatured[index - 1] = current
    
    setFeaturedBusinesses(newFeatured)

    try {
      await Promise.all([
        supabase.from('featured_businesses').update({ order_index: current.order_index }).eq('id', current.id),
        supabase.from('featured_businesses').update({ order_index: previous.order_index }).eq('id', previous.id)
      ])
    } catch (error) {
      console.error('Erro:', error)
      await loadData()
    } finally {
      setReordering(false)
    }
  }

  async function moveDown(index: number) {
    if (index === featuredBusinesses.length - 1) return
    setReordering(true)
    
    const newFeatured = [...featuredBusinesses]
    const current = newFeatured[index]
    const next = newFeatured[index + 1]
    
    const tempOrder = current.order_index
    current.order_index = next.order_index
    next.order_index = tempOrder
    
    newFeatured[index] = next
    newFeatured[index + 1] = current
    
    setFeaturedBusinesses(newFeatured)

    try {
      await Promise.all([
        supabase.from('featured_businesses').update({ order_index: current.order_index }).eq('id', current.id),
        supabase.from('featured_businesses').update({ order_index: next.order_index }).eq('id', next.id)
      ])
    } catch (error) {
      console.error('Erro:', error)
      await loadData()
    } finally {
      setReordering(false)
    }
  }

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user || !isAdmin) {
    return null
  }

  const filteredBusinesses = availableBusinesses.filter(b => {
    const alreadyFeatured = featuredBusinesses.some(f => f.business_id === b.id)
    if (alreadyFeatured) return false
    
    if (searchQuery.trim() === '') return true
    return b.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const activeFeaturedCount = featuredBusinesses.filter(f => f.is_active).length
  const withCouponCount = featuredBusinesses.filter(f => f.coupon_id && f.is_active).length

  return (
    <>
      {/* Header Mobile - Sticky */}
      <div className="sticky top-0 z-10 bg-white shadow md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Destaques</h1>
              <p className="text-xs text-gray-500">Gerenciar homepage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:block bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Destaques da Semana</h1>
              <p className="text-gray-500 mt-1">Gerenciar empresas em destaque na homepage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          
          {/* Dica */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs md:text-sm text-blue-800">
              <p className="font-semibold mb-1">Como funciona:</p>
              <p>Selecione até 5 parceiros para destacar na homepage. Você pode personalizar o título, descrição, botão e vincular cupons específicos.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-white rounded-lg shadow p-3 md:p-4">
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">ATIVOS</h3>
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" fill="currentColor" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{activeFeaturedCount}</p>
              <p className="text-xs text-gray-500 mt-1">de 5 máximo</p>
            </div>

            <div className="bg-white rounded-lg shadow p-3 md:p-4">
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">CUPOM</h3>
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{withCouponCount}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-3 md:p-4">
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">DISPONÍVEIS</h3>
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{filteredBusinesses.length}</p>
            </div>
          </div>

          {/* Destaques Ativos */}
          <div className="bg-white rounded-lg shadow mb-4 md:mb-6">
            <div className="p-3 md:p-4 border-b">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" fill="currentColor" />
                Destaques Ativos
              </h2>
              <p className="text-xs md:text-sm text-gray-500">Use as setas para reordenar</p>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500 text-sm">Carregando...</div>
            ) : featuredBusinesses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                <p>Nenhum destaque configurado ainda.</p>
                <p className="mt-2">Adicione parceiros da lista abaixo.</p>
              </div>
            ) : (
              <div className="divide-y">
                {featuredBusinesses.map((featured, index) => (
                  <div 
                    key={featured.id} 
                    className={`p-3 md:p-4 hover:bg-gray-50 flex items-center gap-2 md:gap-4 ${!featured.is_active ? 'opacity-60' : ''}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={() => moveUp(index)} 
                        disabled={index === 0 || reordering}
                        className="p-1 md:p-1.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={16} className="md:w-4 md:h-4" />
                      </button>
                      <button 
                        onClick={() => moveDown(index)} 
                        disabled={index === featuredBusinesses.length - 1 || reordering}
                        className="p-1 md:p-1.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={16} className="md:w-4 md:h-4" />
                      </button>
                    </div>

                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {featured.business?.logo_url ? (
                        <img 
                          src={featured.business.logo_url} 
                          alt={featured.business.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg md:text-2xl font-bold">
                          {featured.business?.name?.[0] || '?'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{featured.business?.name || 'Empresa não encontrada'}</h3>
                      <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                        {featured.coupon && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 md:py-1 rounded">
                            <span className="hidden sm:inline">Cupom: </span>{featured.coupon.title}
                          </span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 md:py-1 rounded">
                          #{featured.order_index}
                        </span>
                        {featured.video_url && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 md:py-1 rounded hidden sm:inline-block">
                            Com vídeo
                          </span>
                        )}
                        {!featured.is_active && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 md:py-1 rounded">
                            Inativo
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={featured.is_active}
                          onChange={() => toggleActive(featured)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C2227A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-[#C2227A]"></div>
                      </label>
                      <button 
                        onClick={() => openEditModal(featured)}
                        className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Editar"
                      >
                        <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                      <button 
                        onClick={() => handleDelete(featured)}
                        className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remover"
                      >
                        <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parceiros Disponíveis */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-3 md:p-4 border-b space-y-3 md:space-y-0 md:flex md:justify-between md:items-center">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-900">Parceiros Disponíveis</h2>
                <p className="text-xs md:text-sm text-gray-500">Clique em "Destacar" para adicionar à homepage</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input 
                  type="search" 
                  placeholder="Buscar parceiro..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500 text-sm">Carregando...</div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                {searchQuery ? 'Nenhum parceiro encontrado' : 'Todos os parceiros já estão em destaque'}
              </div>
            ) : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredBusinesses.map(business => (
                  <div key={business.id} className="p-3 md:p-4 hover:bg-gray-50 flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {business.logo_url ? (
                        <img 
                          src={business.logo_url} 
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg md:text-xl font-bold">
                          {business.name[0]}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{business.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500 truncate">
                        {business.category_main} • {businessCoupons[business.id]?.length || 0} cupons
                      </p>
                    </div>

                    <button 
                      onClick={() => openAddModal(business)}
                      disabled={activeFeaturedCount >= 5}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] text-xs md:text-sm flex items-center gap-1 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <Star size={14} className="md:w-4 md:h-4" />
                      <span className="hidden xs:inline">Destacar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" fill="currentColor" />
              Configurar Destaque
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
              {editingFeatured ? editingFeatured.business?.name : availableBusinesses.find(b => b.id === formData.business_id)?.name}
            </p>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Selecionar Cupom (opcional)
                </label>
                <select 
                  value={formData.coupon_id || ''} 
                  onChange={(e) => setFormData({ ...formData, coupon_id: e.target.value || null })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                >
                  <option value="">Sem cupom vinculado</option>
                  {businessCoupons[formData.business_id]?.map(coupon => (
                    <option key={coupon.id} value={coupon.id}>{coupon.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Título Customizado
                </label>
                <input 
                  type="text" 
                  value={formData.custom_title}
                  onChange={(e) => setFormData({ ...formData, custom_title: e.target.value })}
                  placeholder="Deixe vazio para usar o nome da empresa" 
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Descrição Customizada
                </label>
                <textarea 
                  rows={3} 
                  value={formData.custom_description}
                  onChange={(e) => setFormData({ ...formData, custom_description: e.target.value })}
                  placeholder="Descreva o que torna este parceiro especial" 
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Texto do Botão
                  </label>
                  <input 
                    type="text" 
                    value={formData.custom_button_text}
                    onChange={(e) => setFormData({ ...formData, custom_button_text: e.target.value })}
                    placeholder="Ver Ofertas" 
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    URL do Botão (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={formData.custom_button_url}
                    onChange={(e) => setFormData({ ...formData, custom_button_url: e.target.value })}
                    placeholder="/empresas/[slug]" 
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  URL do Vídeo (opcional)
                </label>
                <input 
                  type="text" 
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/..." 
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Ordem de Exibição
                </label>
                <input 
                  type="number" 
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                  min="1" 
                  max="5" 
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                <span className="text-xs md:text-sm font-medium text-gray-700">Ativo</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C2227A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C2227A]"></div>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-4 md:mt-6">
              <button 
                onClick={() => setShowConfigModal(false)}
                disabled={saving}
                className="flex-1 px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-xs md:text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 md:py-2.5 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 font-semibold flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                {saving ? (
                  <>
                    <span className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="md:w-[18px] md:h-[18px]" />
                    Salvar Destaque
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}