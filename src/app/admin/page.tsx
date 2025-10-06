'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Building2, CheckCircle, XCircle, Clock, Eye, Ban, Copy, Check, Info, MapPin, Phone, Mail, Globe, Instagram as InstagramIcon, MoreVertical, Edit, Settings, LogOut, ExternalLink } from 'lucide-react'

interface Business {
  id: string
  name: string
  slug: string
  category_main: string
  category_sub: string | null
  description: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  email_business: string | null
  phone: string | null
  whatsapp: string | null
  website: string | null
  instagram: string | null
  address: string
  address_number: string | null
  neighborhood: string | null
  city: string
  state: string
  logo_url: string | null
  banner_url: string | null
  plan_type: string
  max_coupons: number | null
  max_photos: number | null
  featured_until: string | null
}

interface ApprovalCredentials {
  email: string
  password: string
  loginUrl: string
}

interface EditPlanModal {
  business: Business
  max_coupons: number
  max_photos: number
  featured_until: string | null
  plan_type: string
}

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [credentials, setCredentials] = useState<ApprovalCredentials | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)
  const [showEditPlanModal, setShowEditPlanModal] = useState(false)
  const [editPlanData, setEditPlanData] = useState<EditPlanModal | null>(null)
  const [savingPlan, setSavingPlan] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<'all' | 'basic' | 'premium'>('all')

  useEffect(() => {
    if (authLoading || adminLoading) return

    if (!user || !isAdmin) {
      router.push('/login')
    }
  }, [user, isAdmin, authLoading, adminLoading, router])

  useEffect(() => {
    if (!isAdmin) return

    async function loadBusinesses() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setBusinesses(data || [])
      } catch (error) {
        console.error('Erro ao carregar empresas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBusinesses()
  }, [isAdmin, supabase])

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionsMenu) {
        const target = event.target as HTMLElement
        if (!target.closest('.actions-menu-container')) {
          setShowActionsMenu(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showActionsMenu])

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let password = ''
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const approveBusiness = async (business: Business) => {
    if (!business.email_business) {
      alert('Esta empresa não tem email cadastrado. Não é possível criar acesso.')
      return
    }

    const confirmed = confirm(`Aprovar empresa "${business.name}"?\n\nIsso irá criar as credenciais de acesso para o parceiro.`)
    if (!confirmed) return

    try {
      const tempPassword = generateRandomPassword()

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: business.email_business,
        password: tempPassword,
        email_confirm: true
      })

      if (authError) throw authError

      const { error: partnerError } = await supabase
        .from('partners')
        .insert({
          user_id: authData.user.id,
          business_id: business.id,
          status: 'active',
          approved_by: user?.id
        })

      if (partnerError) throw partnerError

      const { error: businessError } = await supabase
        .from('businesses')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user?.id
        })
        .eq('id', business.id)

      if (businessError) throw businessError

      setBusinesses(businesses.map(b =>
        b.id === business.id ? { ...b, status: 'approved' } : b
      ))

      setCredentials({
        email: business.email_business,
        password: tempPassword,
        loginUrl: `${window.location.origin}/login`
      })
      setShowDetailsModal(false)
      setShowCredentialsModal(true)
      setShowActionsMenu(null)

    } catch (error: any) {
      console.error('Erro ao aprovar empresa:', error)
      alert(`Erro ao aprovar empresa: ${error.message}`)
    }
  }

  const rejectBusiness = async (businessId: string, businessName: string) => {
    const confirmed = confirm(`Rejeitar empresa "${businessName}"?`)
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status: 'rejected' })
        .eq('id', businessId)

      if (error) throw error

      setBusinesses(businesses.map(b =>
        b.id === businessId ? { ...b, status: 'rejected' } : b
      ))

      setShowDetailsModal(false)
      setShowActionsMenu(null)
      alert('Empresa rejeitada')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao rejeitar empresa')
    }
  }

  const deactivateBusiness = async (businessId: string, businessName: string) => {
    const confirmed = confirm(`Desativar empresa "${businessName}"?\n\nO parceiro não terá mais acesso ao dashboard.`)
    if (!confirmed) return

    try {
      const { error: partnerError } = await supabase
        .from('partners')
        .update({ status: 'inactive' })
        .eq('business_id', businessId)

      if (partnerError) throw partnerError

      const { error: businessError } = await supabase
        .from('businesses')
        .update({ status: 'rejected' })
        .eq('id', businessId)

      if (businessError) throw businessError

      setBusinesses(businesses.map(b =>
        b.id === businessId ? { ...b, status: 'rejected' } : b
      ))

      setShowActionsMenu(null)
      alert('Empresa desativada com sucesso')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao desativar empresa')
    }
  }

  const editAsAdmin = (businessId: string) => {
    localStorage.setItem('admin_viewing_business', businessId)
    window.location.href = '/dashboard'
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const openDetailsModal = (business: Business) => {
    setSelectedBusiness(business)
    setShowDetailsModal(true)
    setShowActionsMenu(null)
  }

  const openEditPlanModal = (business: Business) => {
    setEditPlanData({
      business,
      max_coupons: business.max_coupons || 3,
      max_photos: business.max_photos || 3,
      featured_until: business.featured_until || null,
      plan_type: business.plan_type || 'basic'
    })
    setShowEditPlanModal(true)
    setShowActionsMenu(null)
  }

  const savePlanChanges = async () => {
    if (!editPlanData) return

    setSavingPlan(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          plan_type: editPlanData.plan_type,
          max_coupons: editPlanData.max_coupons,
          max_photos: editPlanData.max_photos,
          featured_until: editPlanData.featured_until,
          updated_at: new Date().toISOString()
        })
        .eq('id', editPlanData.business.id)

      if (error) throw error

      setBusinesses(businesses.map(b =>
        b.id === editPlanData.business.id
          ? { ...b, plan_type: editPlanData.plan_type, max_coupons: editPlanData.max_coupons, max_photos: editPlanData.max_photos, featured_until: editPlanData.featured_until }
          : b
      ))

      setShowEditPlanModal(false)
      alert('Plano atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao atualizar plano')
    } finally {
      setSavingPlan(false)
    }
  }

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user || !isAdmin) {
    return null
  }

  const businessesForStats = planFilter === 'all' 
    ? businesses 
    : businesses.filter(b => b.plan_type === planFilter)

  const stats = {
    total: businessesForStats.length,
    pending: businessesForStats.filter(b => b.status === 'pending').length,
    approved: businessesForStats.filter(b => b.status === 'approved').length,
    rejected: businessesForStats.filter(b => b.status === 'rejected').length
  }

  const filteredBusinesses = businesses.filter(b => {
    const matchesStatus = filter === 'all' || b.status === filter
    const matchesSearch = searchQuery.trim() === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlan = planFilter === 'all' || b.plan_type === planFilter
    return matchesStatus && matchesSearch && matchesPlan
  })

  return (
    <>
      {/* Header Mobile - Sticky */}
      <div className="sticky top-0 z-20 bg-white shadow md:hidden">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Administração</h1>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Link href="/admin/categorias" className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center text-xs font-medium">
              Categorias
            </Link>
            <Link href="/admin/planos" className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center text-xs font-medium">
              Planos
            </Link>
            <Link href="/admin/destaques" className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-center text-xs font-medium">
              Destaques
            </Link>
            <Link href="/admin/mari" className="px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-center text-xs font-medium">
              Mari
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/" className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-center text-xs font-medium flex items-center justify-center gap-1">
              <ExternalLink size={14} />
              Ver Site
            </Link>
            <button onClick={signOut} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-medium flex items-center justify-center gap-1">
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:block bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
              <p className="text-gray-500 mt-1">Gerenciar empresas do Guia Marajoara</p>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/categorias" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                Categorias
              </Link>
              <Link href="/admin/planos" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                Planos
              </Link>
              <Link href="/admin/destaques" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                Destaques
              </Link>
              <Link href="/admin/mari" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm">
                Mari
              </Link>
              <Link href="/" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Ver Site
              </Link>
              <button onClick={signOut} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">TOTAL</h3>
                <Building2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">PENDENTES</h3>
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">APROVADAS</h3>
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-500">REJEITADAS</h3>
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6 space-y-3 md:space-y-4">
            {/* Busca */}
            <div>
              <input
                type="text"
                placeholder="Buscar empresa por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-sm md:text-base"
              />
            </div>

            {/* Filtros Status e Plano */}
            <div className="space-y-3">
              {/* Filtro Status - SEM SCROLL */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setFilter('all')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-[#C2227A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                  Todas
                </button>
                <button onClick={() => setFilter('pending')} className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1 ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <span className="hidden sm:inline">Pendentes</span>
                  <span className="sm:hidden flex items-center gap-1">
                    <Clock size={14} />
                    {stats.pending}
                  </span>
                </button>
                <button onClick={() => setFilter('approved')} className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1 ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <span className="hidden sm:inline">Aprovadas</span>
                  <span className="sm:hidden flex items-center gap-1">
                    <CheckCircle size={14} />
                    {stats.approved}
                  </span>
                </button>
                <button onClick={() => setFilter('rejected')} className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1 ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <span className="hidden sm:inline">Rejeitadas</span>
                  <span className="sm:hidden flex items-center gap-1">
                    <XCircle size={14} />
                    {stats.rejected}
                  </span>
                </button>
              </div>

              {/* Filtro Plano */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setPlanFilter('all')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap ${planFilter === 'all' ? 'bg-[#C2227A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                  Todos
                </button>
                <button onClick={() => setPlanFilter('basic')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap ${planFilter === 'basic' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  Básico
                </button>
                <button onClick={() => setPlanFilter('premium')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap ${planFilter === 'premium' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  Premium
                </button>
              </div>
            </div>

            {/* Contador */}
            <div className="text-xs md:text-sm text-gray-500">
              Mostrando {filteredBusinesses.length} de {businesses.length} empresas
            </div>
          </div>

          {/* Tabela Desktop */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Carregando...</div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nenhuma empresa encontrada</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBusinesses.map(business => (
                    <tr key={business.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{business.name}</div>
                        <div className="text-sm text-gray-500">{business.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{business.category_main}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {business.email_business && <div className="truncate max-w-[200px]">{business.email_business}</div>}
                        {business.phone && <div>{business.phone}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(business.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        {business.status === 'pending' && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pendente</span>}
                        {business.status === 'approved' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Aprovada</span>}
                        {business.status === 'rejected' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Rejeitada</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openDetailsModal(business)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Ver detalhes">
                            <Info size={18} />
                          </button>
                          <button onClick={() => editAsAdmin(business.id)} className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="Editar como admin">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => openEditPlanModal(business)} className="p-2 text-orange-600 hover:bg-orange-50 rounded" title="Editar plano">
                            <Settings size={18} />
                          </button>
                          <Link href={`/empresas/${business.slug}`} target="_blank" className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Ver página">
                            <Eye size={18} />
                          </Link>
                          {business.status === 'approved' && (
                            <button onClick={() => deactivateBusiness(business.id, business.name)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Desativar">
                              <Ban size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Cards Mobile */}
          <div className="lg:hidden space-y-3">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Carregando...</div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Nenhuma empresa encontrada</div>
            ) : (
              filteredBusinesses.map(business => (
                <div key={business.id} className="bg-white rounded-lg shadow p-4 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{business.name}</h3>
                      <p className="text-xs text-gray-500">{business.category_main}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {business.status === 'pending' && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full whitespace-nowrap">Pendente</span>}
                      {business.status === 'approved' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">Aprovada</span>}
                      {business.status === 'rejected' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">Rejeitada</span>}
                      
                      {/* Container do menu com classe para detectar cliques fora */}
                      <div className="actions-menu-container relative">
                        <button onClick={() => setShowActionsMenu(showActionsMenu === business.id ? null : business.id)} className="p-2 hover:bg-gray-100 rounded">
                          <MoreVertical size={18} />
                        </button>
                        
                        {showActionsMenu === business.id && (
                          <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                            <button onClick={() => openDetailsModal(business)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                              <Info size={16} /> Ver detalhes
                            </button>
                            <button onClick={() => editAsAdmin(business.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-purple-600">
                              <Edit size={16} /> Editar como admin
                            </button>
                            <button onClick={() => openEditPlanModal(business)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-orange-600">
                              <Settings size={16} /> Editar Plano
                            </button>
                            <Link href={`/empresas/${business.slug}`} target="_blank" className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                              <Eye size={16} /> Ver página
                            </Link>
                            {business.status === 'pending' && (
                              <>
                                <button onClick={() => approveBusiness(business)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600">
                                  <CheckCircle size={16} /> Aprovar
                                </button>
                                <button onClick={() => rejectBusiness(business.id, business.name)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                  <XCircle size={16} /> Rejeitar
                                </button>
                              </>
                            )}
                            {business.status === 'approved' && (
                              <button onClick={() => deactivateBusiness(business.id, business.name)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                <Ban size={16} /> Desativar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {business.email_business && (
                    <p className="text-xs text-gray-600 mb-1 truncate">{business.email_business}</p>
                  )}
                  <p className="text-xs text-gray-500">{new Date(business.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Detalhes */}
      {showDetailsModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full p-4 md:p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div className="flex-1 pr-2">
                <h2 className="text-lg md:text-2xl font-bold">{selectedBusiness.name}</h2>
                <p className="text-sm md:text-base text-gray-500">{selectedBusiness.category_sub || selectedBusiness.category_main}</p>
              </div>
              <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${
                selectedBusiness.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                selectedBusiness.status === 'approved' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedBusiness.status === 'pending' ? 'Pendente' :
                 selectedBusiness.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
              </span>
            </div>

            <div className="space-y-4 md:space-y-6">
              {selectedBusiness.description && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Descrição</h3>
                  <p className="text-sm md:text-base text-gray-600">{selectedBusiness.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Informações de Contato</h3>
                <div className="space-y-2">
                  {selectedBusiness.email_business && (
                    <div className="flex items-center gap-2 text-xs md:text-base text-gray-600">
                      <Mail size={16} className="flex-shrink-0" />
                      <span className="break-all">{selectedBusiness.email_business}</span>
                    </div>
                  )}
                  {selectedBusiness.phone && (
                    <div className="flex items-center gap-2 text-xs md:text-base text-gray-600">
                      <Phone size={16} className="flex-shrink-0" />
                      <span>{selectedBusiness.phone}</span>
                    </div>
                  )}
                  {selectedBusiness.whatsapp && (
                    <div className="flex items-center gap-2 text-xs md:text-base text-gray-600">
                      <Phone size={16} className="flex-shrink-0" />
                      <span>WhatsApp: {selectedBusiness.whatsapp}</span>
                    </div>
                  )}
                  {selectedBusiness.website && (
                    <div className="flex items-center gap-2 text-xs md:text-base text-gray-600">
                      <Globe size={16} className="flex-shrink-0" />
                      <a href={selectedBusiness.website} target="_blank" className="text-blue-600 hover:underline break-all">{selectedBusiness.website}</a>
                    </div>
                  )}
                  {selectedBusiness.instagram && (
                    <div className="flex items-center gap-2 text-xs md:text-base text-gray-600">
                      <InstagramIcon size={16} className="flex-shrink-0" />
                      <span>{selectedBusiness.instagram}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Endereço</h3>
                <div className="flex items-start gap-2 text-xs md:text-base text-gray-600">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span>
                    {selectedBusiness.address}{selectedBusiness.address_number && `, ${selectedBusiness.address_number}`}
                    {selectedBusiness.neighborhood && ` - ${selectedBusiness.neighborhood}`}
                    <br />
                    {selectedBusiness.city}, {selectedBusiness.state}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Informações Adicionais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-500">Plano:</span>
                    <span className="ml-2 font-medium">{selectedBusiness.plan_type === 'premium' ? 'Premium' : 'Básico'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cadastrado em:</span>
                    <span className="ml-2 font-medium">{new Date(selectedBusiness.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:gap-3 mt-6 md:mt-8">
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <button onClick={() => setShowDetailsModal(false)} className="flex-1 px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-base">
                  Fechar
                </button>
                <button onClick={() => editAsAdmin(selectedBusiness.id)} className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm md:text-base">
                  Editar como Admin
                </button>
              </div>
              {selectedBusiness.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <button onClick={() => rejectBusiness(selectedBusiness.id, selectedBusiness.name)} className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm md:text-base">
                    Rejeitar
                  </button>
                  <button onClick={() => approveBusiness(selectedBusiness)} className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm md:text-base">
                    Aprovar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Credenciais */}
      {showCredentialsModal && credentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-2xl font-bold mb-4 text-green-600">Empresa Aprovada!</h2>
            <p className="text-xs md:text-base text-gray-600 mb-6">As credenciais de acesso foram criadas. Copie e envie para o parceiro:</p>

            <div className="space-y-4 bg-gray-50 p-3 md:p-4 rounded-lg">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email de acesso:</label>
                <div className="flex gap-2">
                  <input type="text" value={credentials.email} readOnly className="flex-1 px-3 md:px-4 py-2 border rounded-lg bg-white text-xs md:text-sm" />
                  <button onClick={() => copyToClipboard(credentials.email, 'email')} className="px-3 md:px-4 py-2 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
                    {copiedField === 'email' ? <Check size={16} /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{copiedField === 'email' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Senha temporária:</label>
                <div className="flex gap-2">
                  <input type="text" value={credentials.password} readOnly className="flex-1 px-3 md:px-4 py-2 border rounded-lg bg-white font-mono text-xs md:text-sm" />
                  <button onClick={() => copyToClipboard(credentials.password, 'password')} className="px-3 md:px-4 py-2 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
                    {copiedField === 'password' ? <Check size={16} /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{copiedField === 'password' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Link de acesso:</label>
                <div className="flex gap-2">
                  <input type="text" value={credentials.loginUrl} readOnly className="flex-1 px-3 md:px-4 py-2 border rounded-lg bg-white text-xs md:text-sm" />
                  <button onClick={() => copyToClipboard(credentials.loginUrl, 'url')} className="px-3 md:px-4 py-2 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
                    {copiedField === 'url' ? <Check size={16} /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{copiedField === 'url' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
              <p className="text-xs md:text-sm text-yellow-800"><strong>Importante:</strong> Guarde essas credenciais. O parceiro deve fazer login e trocar a senha no primeiro acesso.</p>
            </div>

            <button onClick={() => setShowCredentialsModal(false)} className="mt-6 w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm md:text-base">
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal Editar Plano */}
      {showEditPlanModal && editPlanData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-2xl font-bold mb-4">Editar Plano - {editPlanData.business.name}</h2>
            <p className="text-xs md:text-sm text-gray-600 mb-6">Ajuste as características do plano desta empresa específica</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Tipo de Plano</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setEditPlanData({ ...editPlanData, plan_type: 'basic' })}
                    className={`p-3 md:p-4 border-2 rounded-lg text-center transition-all ${
                      editPlanData.plan_type === 'basic'
                        ? 'border-[#C2227A] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm md:text-base">Básico</div>
                    <div className="text-xs text-gray-500 mt-1">Funcionalidades essenciais</div>
                  </button>
                  <button
                    onClick={() => setEditPlanData({ ...editPlanData, plan_type: 'premium' })}
                    className={`p-3 md:p-4 border-2 rounded-lg text-center transition-all ${
                      editPlanData.plan_type === 'premium'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm md:text-base">Premium</div>
                    <div className="text-xs text-gray-500 mt-1">Todas as funcionalidades</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Máximo de Cupons
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editPlanData.max_coupons}
                    onChange={(e) => setEditPlanData({ ...editPlanData, max_coupons: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Máximo de Fotos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editPlanData.max_photos}
                    onChange={(e) => setEditPlanData({ ...editPlanData, max_photos: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Em Destaque Até
                </label>
                <input
                  type="date"
                  value={editPlanData.featured_until ? editPlanData.featured_until.split('T')[0] : ''}
                  onChange={(e) => setEditPlanData({ ...editPlanData, featured_until: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-sm md:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">Deixe em branco para remover destaque</p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Nota:</strong> Estas configurações são específicas para esta empresa e substituem os valores padrão do plano.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowEditPlanModal(false)}
                disabled={savingPlan}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={savePlanChanges}
                disabled={savingPlan}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 font-semibold text-sm md:text-base"
              >
                {savingPlan ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}