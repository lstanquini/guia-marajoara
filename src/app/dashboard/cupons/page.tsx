'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, MoreVertical, Eye, Tag as TagIcon, Copy, Archive, Trash2, Power, ChevronDown } from 'lucide-react'

interface Coupon {
  id: string
  title: string
  description: string
  discount_text: string | null
  image_url: string
  expires_at: string
  status: 'active' | 'inactive' | 'expired' | 'archived'
  redemptions_count: number
  views_count: number
  created_at: string
  activated_at: string | null
  deactivated_at: string | null
}

export default function CuponsPage() {
  const { user, loading: authLoading } = useAuth()
  const { partner, loading: partnerLoading } = usePartner()
  const toast = useToast()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState({
    active: true,
    inactive: true,
    expired: false,
    archived: false
  })
  const [showFilters, setShowFilters] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!partner) {
      setLoading(false)
      return
    }

    async function loadCoupons() {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('business_id', partner?.businessId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setCoupons(data || [])
      } catch (error) {
        console.error('Erro ao carregar cupons:', error)
        toast.error('Erro ao carregar cupons')
      } finally {
        setLoading(false)
      }
    }

    loadCoupons()
  }, [partner, supabase, toast])

  const toggleStatus = async (couponId: string, currentStatus: string, activatedAt: string | null) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const updates: any = { status: newStatus }

      if (newStatus === 'active' && !activatedAt) {
        updates.activated_at = new Date().toISOString()
      }

      if (newStatus === 'inactive') {
        updates.deactivated_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', couponId)

      if (error) throw error

      setCoupons(coupons.map(c => 
        c.id === couponId ? { ...c, ...updates } : c
      ))

      setOpenMenuId(null)
      toast.success(newStatus === 'active' ? 'Cupom ativado' : 'Cupom desativado')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const archiveCoupon = async (couponId: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ status: 'archived' })
        .eq('id', couponId)

      if (error) throw error

      setCoupons(coupons.map(c => 
        c.id === couponId ? { ...c, status: 'archived' as any } : c
      ))

      setOpenMenuId(null)
      toast.success('Cupom arquivado')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao arquivar')
    }
  }

  const deleteCoupon = async (couponId: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId)

      if (error) throw error

      setCoupons(coupons.filter(c => c.id !== couponId))
      setOpenMenuId(null)
      toast.success('Cupom excluído')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao excluir')
    }
  }

  const cloneCoupon = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          business_id: partner?.businessId,
          title: `${coupon.title} (Cópia)`,
          description: coupon.description,
          discount_text: coupon.discount_text,
          image_url: coupon.image_url,
          expires_at: coupon.expires_at,
          status: 'inactive'
        })

      if (error) throw error

      setOpenMenuId(null)
      toast.success('Cupom clonado')
      window.location.reload()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao clonar')
    }
  }

  if (authLoading || partnerLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user || !partner) return null

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus[c.status as keyof typeof filterStatus]
    return matchesSearch && matchesFilter
  })

  const activeCoupons = coupons.filter(c => c.status === 'active').length
  const canCreateMore = activeCoupons < partner?.maxCoupons

  const getStatusBadge = (status: string) => {
    const badges = {
      active: <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">🟢 Ativo</span>,
      inactive: <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">⚪ Inativo</span>,
      expired: <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">🔴 Expirado</span>,
      archived: <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-500 rounded-full">📦 Arquivado</span>
    }
    return badges[status as keyof typeof badges]
  }

  const activeFiltersCount = Object.values(filterStatus).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">← Voltar</Link>
              <h1 className="text-2xl font-bold">Meus Cupons</h1>
              <p className="text-sm text-gray-500">Cupons ativos: {activeCoupons}/{partner?.maxCoupons}</p>
            </div>
            {canCreateMore ? (
              <Link href="/dashboard/cupons/novo" className="px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] font-semibold">+ Novo Cupom</Link>
            ) : (
              <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">Limite atingido</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow px-4 py-3 mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar cupons..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Filtros</span>
              {activeFiltersCount < 4 && <span className="px-2 py-0.5 bg-[#C2227A] text-white text-xs rounded-full">{activeFiltersCount}</span>}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-4 w-48 z-20">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"><input type="checkbox" checked={filterStatus.active} onChange={(e) => setFilterStatus({...filterStatus, active: e.target.checked})} className="rounded" /><span className="text-sm">Ativos</span></label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"><input type="checkbox" checked={filterStatus.inactive} onChange={(e) => setFilterStatus({...filterStatus, inactive: e.target.checked})} className="rounded" /><span className="text-sm">Inativos</span></label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"><input type="checkbox" checked={filterStatus.expired} onChange={(e) => setFilterStatus({...filterStatus, expired: e.target.checked})} className="rounded" /><span className="text-sm">Expirados</span></label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"><input type="checkbox" checked={filterStatus.archived} onChange={(e) => setFilterStatus({...filterStatus, archived: e.target.checked})} className="rounded" /><span className="text-sm">Arquivados</span></label>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div>Carregando...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center"><div className="text-6xl mb-4">🎫</div><h3 className="text-xl font-semibold mb-2">Nenhum cupom encontrado</h3><p className="text-gray-600">Ajuste os filtros ou crie seu primeiro cupom</p></div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagem</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cupom</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desconto</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validade</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-24">Ações</th></tr>
              </thead>
              <tbody className="divide-y">
                {filteredCoupons.map(coupon => {
                  const neverActivated = !coupon.activated_at
                  const canEdit = neverActivated
                  const canDelete = neverActivated
                  
                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4"><img src={coupon.image_url} alt={coupon.title} className="w-16 h-16 object-cover rounded-lg" /></td>
                      <td className="px-6 py-4"><div className="font-semibold text-gray-900">{coupon.title}</div><div className="text-sm text-gray-500">{coupon.description?.substring(0, 60)}...</div><div className="flex items-center gap-3 mt-2 text-xs text-gray-500"><span className="flex items-center gap-1"><Eye size={14} />{coupon.views_count}</span><span className="flex items-center gap-1"><TagIcon size={14} />{coupon.redemptions_count}</span></div></td>
                      <td className="px-6 py-4"><span className="font-bold text-[#C2227A]">{coupon.discount_text || '-'}</span></td>
                      <td className="px-6 py-4"><div className="text-sm">{new Date(coupon.expires_at).toLocaleDateString('pt-BR')}</div><div className="mt-1">{getStatusBadge(coupon.status)}</div></td>
                      <td className="px-6 py-4 text-right relative">
                        <button onClick={() => setOpenMenuId(openMenuId === coupon.id ? null : coupon.id)} className="p-2 hover:bg-gray-100 rounded-lg inline-block"><MoreVertical size={20} /></button>
                        {openMenuId === coupon.id && (
                          <div ref={menuRef} className="fixed mt-2 w-48 bg-white rounded-lg shadow-2xl border-2 border-gray-200 z-50" style={{ transform: 'translateX(-100%) translateX(-8px) translateY(-100%)' }}>
                            {canEdit && <Link href={`/dashboard/cupons/${coupon.id}/editar`} onClick={() => setOpenMenuId(null)} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm border-b">✏️ Editar</Link>}
                            <button onClick={() => cloneCoupon(coupon)} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm border-b text-left"><Copy size={16} />Clonar</button>
                            <button onClick={() => toggleStatus(coupon.id, coupon.status, coupon.activated_at)} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm border-b text-left"><Power size={16} />{coupon.status === 'active' ? 'Desativar' : 'Ativar'}</button>
                            {coupon.status === 'inactive' && <button onClick={() => archiveCoupon(coupon.id)} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm border-b text-left"><Archive size={16} />Arquivar</button>}
                            {canDelete && <button onClick={() => deleteCoupon(coupon.id)} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 text-sm text-left"><Trash2 size={16} />Excluir</button>}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}