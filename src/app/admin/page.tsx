'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Building2, CheckCircle, XCircle, Clock, Eye, Ban, Copy, Check, Info, MapPin, Phone, Mail, Globe, Instagram as InstagramIcon, MoreVertical, Edit, Settings, LogOut, ExternalLink, User, FileText } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'

interface Business {
  id: string
  name: string
  slug: string
  category_main: string
  category_sub: string | null
  description: string | null
  status: 'pending' | 'approved' | 'suspended' | 'cancelled'
  created_at: string
  
  // NOVOS: Dados do responsável
  responsible_name: string | null
  responsible_email: string | null
  responsible_phone: string | null
  cpf_cnpj: string | null
  document_type: string | null
  profile_complete: boolean
  
  // Contatos da empresa (podem ser diferentes do responsável)
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
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'suspended' | 'cancelled'>('all')
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
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [businessToApprove, setBusinessToApprove] = useState<Business | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic')
  const [approving, setApproving] = useState(false)

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

  const openApprovalModal = (business: Business) => {
  if (!business.responsible_email) {
    alert(
      'Esta empresa não tem email do responsável cadastrado.\n\n' +
      'Edite os dados da empresa e adicione o email do responsável antes de aprovar.'
    )
    return
  }

  setBusinessToApprove(business)
  setSelectedPlan(business.plan_type as 'basic' | 'premium' || 'basic')
  setShowApprovalModal(true)
  setShowDetailsModal(false)
  setShowActionsMenu(null)
}

const approveBusiness = async () => {
  if (!businessToApprove) return

  setApproving(true)

  try {
    // ✅ Primeiro, atualizar o plano
    const { error: planError } = await supabase
      .from('businesses')
      .update({ 
        plan_type: selectedPlan,
        max_coupons: selectedPlan === 'premium' ? 999 : 3,
        max_photos: selectedPlan === 'premium' ? 999 : 3
      })
      .eq('id', businessToApprove.id)

    if (planError) {
      throw new Error('Erro ao atualizar plano')
    }

    console.log('✅ Plano atualizado:', selectedPlan)

    // ✅ Pegar session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      alert('Sessão expirada. Faça login novamente.')
      window.location.href = '/login'
      return
    }

    console.log('🔑 Token obtido, enviando requisição...')

    // ✅ Aprovar empresa
    const response = await fetch('/api/admin/approve-business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        businessId: businessToApprove.id,
        planType: selectedPlan
      })
    })

    // Verificar se a resposta é JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('❌ Resposta não é JSON:', text.substring(0, 200))
      throw new Error('Erro no servidor. A API retornou HTML em vez de JSON. Verifique os logs do servidor.')
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao aprovar empresa')
    }

    console.log('✅ Empresa aprovada com sucesso!')

    // Atualizar lista local
    setBusinesses(businesses.map(b =>
      b.id === businessToApprove.id ? { ...b, status: 'approved' as const, plan_type: selectedPlan } : b
    ))

    // Mostrar credenciais
    setCredentials(data.credentials)
    setShowApprovalModal(false)
    setShowCredentialsModal(true)

  } catch (error: any) {
    console.error('❌ Erro ao aprovar empresa:', error)
    alert(`Erro ao aprovar empresa: ${error.message}`)
  } finally {
    setApproving(false)
  }
}

  const rejectBusiness = async (businessId: string, businessName: string) => {
    const confirmed = confirm(`Rejeitar empresa "${businessName}"?`)
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status: 'cancelled' })
        .eq('id', businessId)

      if (error) throw error

      setBusinesses(businesses.map(b =>
        b.id === businessId ? { ...b, status: 'cancelled' as const } : b
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
      console.log('🔄 Desativando empresa:', businessId)

      // Primeiro, atualizar status da empresa para suspended (suspenso)
      const { error: businessError, data: businessData } = await supabase
        .from('businesses')
        .update({
          status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)
        .select()

      if (businessError) {
        console.error('❌ Erro ao desativar business:', businessError)
        throw new Error(`Erro ao desativar empresa: ${businessError.message}`)
      }

      console.log('✅ Empresa desativada:', businessData)

      // Depois, tentar desativar o partner (pode não existir ainda)
      const { error: partnerError, data: partnerData, count } = await supabase
        .from('partners')
        .update({ is_active: false })
        .eq('business_id', businessId)
        .select()

      if (partnerError) {
        console.warn('⚠️ Aviso ao desativar partner:', partnerError)
        // Não bloqueia o fluxo se partner não existir ou der erro
      } else {
        console.log('✅ Partner desativado:', partnerData)
      }

      // Atualizar estado local
      setBusinesses(businesses.map(b =>
        b.id === businessId ? { ...b, status: 'suspended' as const } : b
      ))

      setShowActionsMenu(null)
      setShowDetailsModal(false)
      alert('✅ Empresa desativada com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro completo ao desativar:', error)
      alert(`❌ Erro ao desativar empresa: ${error.message || 'Erro desconhecido'}`)
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
    suspended: businessesForStats.filter(b => b.status === 'suspended').length,
    cancelled: businessesForStats.filter(b => b.status === 'cancelled').length
  }

  const filteredBusinesses = businesses.filter(b => {
    const matchesStatus = filter === 'all' || b.status === filter
    const matchesSearch = searchQuery.trim() === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.responsible_name && b.responsible_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.responsible_email && b.responsible_email.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPlan = planFilter === 'all' || b.plan_type === planFilter
    return matchesStatus && matchesSearch && matchesPlan
  })

  return (
    <AdminLayout>
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
                <h3 className="text-xs md:text-sm font-medium text-gray-500">INATIVAS</h3>
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-red-600">{stats.suspended + stats.cancelled}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6 space-y-3 md:space-y-4">
            {/* Busca */}
            <div>
              <input
                type="text"
                placeholder="Buscar empresa ou responsável..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-sm md:text-base"
              />
            </div>

            {/* Filtros Status e Plano */}
            <div className="space-y-3">
              {/* Filtro Status */}
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
                <button onClick={() => setFilter('suspended')} className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1 ${filter === 'suspended' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <span className="hidden sm:inline">Suspensas</span>
                  <span className="sm:hidden flex items-center gap-1">
                    <Ban size={14} />
                    {stats.suspended}
                  </span>
                </button>
                <button onClick={() => setFilter('cancelled')} className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1 ${filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <span className="hidden sm:inline">Canceladas</span>
                  <span className="sm:hidden flex items-center gap-1">
                    <XCircle size={14} />
                    {stats.cancelled}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
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
                        {!business.profile_complete && (
                          <div className="text-xs text-orange-600 mt-1">⚠️ Cadastro incompleto</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {business.responsible_name && (
                          <div className="font-medium text-gray-900 flex items-center gap-1">
                            <User size={14} />
                            {business.responsible_name}
                          </div>
                        )}
                        {business.responsible_email && (
                          <div className="truncate max-w-[200px] text-blue-600 flex items-center gap-1">
                            <Mail size={14} />
                            {business.responsible_email}
                          </div>
                        )}
                        {business.responsible_phone && (
                          <div className="text-gray-600 flex items-center gap-1">
                            <Phone size={14} />
                            {business.responsible_phone}
                          </div>
                        )}
                        {business.cpf_cnpj && (
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <FileText size={12} />
                            {business.document_type}: {business.cpf_cnpj}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{business.category_main}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(business.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        {business.status === 'pending' && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pendente</span>}
                        {business.status === 'approved' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Aprovada</span>}
                        {business.status === 'suspended' && <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">Suspensa</span>}
                        {business.status === 'cancelled' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Cancelada</span>}
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
                          {business.status === 'pending' && (
                            <>
                              <button onClick={() => openApprovalModal(business)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Aprovar">
                                <CheckCircle size={18} />
                              </button>
                              <button onClick={() => rejectBusiness(business.id, business.name)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Rejeitar">
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
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
                      {business.responsible_name && (
                        <p className="text-xs text-gray-600 mt-1">👤 {business.responsible_name}</p>
                      )}
                      {!business.profile_complete && (
                        <p className="text-xs text-orange-600 mt-1">⚠️ Cadastro incompleto</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {business.status === 'pending' && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full whitespace-nowrap">Pendente</span>}
                      {business.status === 'approved' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">Aprovada</span>}
                      {business.status === 'suspended' && <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full whitespace-nowrap">Suspensa</span>}
                      {business.status === 'cancelled' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">Cancelada</span>}
                      
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
                                <button onClick={() => openApprovalModal(business)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600">
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

                  {business.responsible_email && (
                    <p className="text-xs text-blue-600 mb-1 truncate">📧 {business.responsible_email}</p>
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
                selectedBusiness.status === 'suspended' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedBusiness.status === 'pending' ? 'Pendente' :
                 selectedBusiness.status === 'approved' ? 'Aprovada' :
                 selectedBusiness.status === 'suspended' ? 'Suspensa' :
                 selectedBusiness.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
              </span>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* NOVA SEÇÃO: Dados do Responsável */}
              {(selectedBusiness.responsible_name || selectedBusiness.responsible_email) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-sm md:text-base text-blue-900 flex items-center gap-2">
                    <User size={18} />
                    Responsável pelo Cadastro
                  </h3>
                  <div className="space-y-2">
                    {selectedBusiness.responsible_name && (
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="font-medium text-blue-800">Nome:</span>
                        <span className="text-gray-700">{selectedBusiness.responsible_name}</span>
                      </div>
                    )}
                    {selectedBusiness.responsible_email && (
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="font-medium text-blue-800">Email (Login):</span>
                        <span className="text-gray-700">{selectedBusiness.responsible_email}</span>
                      </div>
                    )}
                    {selectedBusiness.responsible_phone && (
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="font-medium text-blue-800">Telefone:</span>
                        <span className="text-gray-700">{selectedBusiness.responsible_phone}</span>
                      </div>
                    )}
                    {selectedBusiness.cpf_cnpj && (
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="font-medium text-blue-800">{selectedBusiness.document_type}:</span>
                        <span className="text-gray-700">{selectedBusiness.cpf_cnpj}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedBusiness.description && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Descrição</h3>
                  <p className="text-sm md:text-base text-gray-600">{selectedBusiness.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Informações de Contato da Empresa</h3>
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
                  {!selectedBusiness.email_business && !selectedBusiness.phone && !selectedBusiness.whatsapp && (
                    <p className="text-xs text-gray-500 italic">Nenhum contato da empresa cadastrado ainda</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Endereço</h3>
                {selectedBusiness.address ? (
                  <div className="flex items-start gap-2 text-xs md:text-base text-gray-600">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <span>
                      {selectedBusiness.address}{selectedBusiness.address_number && `, ${selectedBusiness.address_number}`}
                      {selectedBusiness.neighborhood && ` - ${selectedBusiness.neighborhood}`}
                      <br />
                      {selectedBusiness.city}, {selectedBusiness.state}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-orange-600 italic">⚠️ Endereço não cadastrado (cadastro incompleto)</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Informações Adicionais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-500">Plano:</span>
                    <span className="ml-2 font-medium">{selectedBusiness.plan_type === 'premium' ? 'Premium' : 'Básico'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cadastro completo:</span>
                    <span className={`ml-2 font-medium ${selectedBusiness.profile_complete ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedBusiness.profile_complete ? '✓ Sim' : '✗ Não'}
                    </span>
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
                  <button onClick={approveBusiness} className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm md:text-base">
                    Aprovar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
       {/* Modal Aprovação com Seleção de Plano */}
      {showApprovalModal && businessToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-2xl font-bold mb-4 text-green-600">
              🎉 Aprovar Empresa
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{businessToApprove.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Responsável:</strong> {businessToApprove.responsible_name || 'Não informado'}</p>
                <p><strong>Email de login:</strong> {businessToApprove.responsible_email}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Selecione o Plano
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plano Básico */}
                <button
                  onClick={() => setSelectedPlan('basic')}
                  disabled={approving}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedPlan === 'basic'
                      ? 'border-[#C2227A] bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg">Plano Básico</h4>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'basic' ? 'border-[#C2227A]' : 'border-gray-300'
                    }`}>
                      {selectedPlan === 'basic' && (
                        <div className="w-3 h-3 rounded-full bg-[#C2227A]"></div>
                      )}
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Até 3 cupons ativos</li>
                    <li>✓ Até 3 fotos</li>
                    <li>✓ Perfil completo</li>
                    <li>✓ Contatos visíveis</li>
                  </ul>
                </button>

                {/* Plano Premium */}
                <button
                  onClick={() => setSelectedPlan('premium')}
                  disabled={approving}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedPlan === 'premium'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg text-purple-600">Plano Premium</h4>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'premium' ? 'border-purple-600' : 'border-gray-300'
                    }`}>
                      {selectedPlan === 'premium' && (
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      )}
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Cupons ilimitados</li>
                    <li>✓ Fotos ilimitadas</li>
                    <li>✓ Destaque na home</li>
                    <li>✓ Badge Premium</li>
                  </ul>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-6">
              <p className="text-xs md:text-sm text-blue-800">
                <strong>📧 Email automático:</strong> Após aprovar, o parceiro receberá um email com as credenciais de acesso e informações sobre o plano selecionado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                disabled={approving}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={approveBusiness}
                disabled={approving}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold text-sm md:text-base"
              >
                {approving ? 'Aprovando...' : '✓ Aprovar e Enviar Email'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Credenciais */}
      {showCredentialsModal && credentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-2xl font-bold mb-4 text-green-600">✅ Empresa Aprovada!</h2>
            <p className="text-xs md:text-base text-gray-600 mb-2">As credenciais de acesso foram criadas com sucesso.</p>
            <p className="text-xs md:text-sm text-blue-600 mb-6">📧 Um email de boas-vindas foi enviado automaticamente para o responsável.</p>

            <div className="space-y-4 bg-gray-50 p-3 md:p-4 rounded-lg">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email de acesso (Login):</label>
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

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <p className="text-xs md:text-sm text-blue-800">
                <strong>✉️ Email enviado!</strong> O parceiro já recebeu um email com as credenciais de acesso. Você pode copiar as informações acima caso precise enviar manualmente por WhatsApp.
              </p>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
              <p className="text-xs md:text-sm text-yellow-800">
                <strong>⚠️ Importante:</strong> O parceiro deve fazer login e completar o cadastro (adicionar endereço) para a empresa aparecer no site público.
              </p>
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
    </AdminLayout>
  )
}