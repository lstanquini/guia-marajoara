'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useAdmin } from '@/hooks/useAdmin'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tag, Eye, Calendar, FileText, Image as ImageIcon, Clock, ExternalLink, CreditCard, Star } from 'lucide-react'

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
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { partner, loading: partnerLoading, isPartner } = usePartner()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [recentCoupons, setRecentCoupons] = useState<Coupon[]>([])
  const [loadingCoupons, setLoadingCoupons] = useState(true)
  const [businessData, setBusinessData] = useState<{
    name: string
    slug: string
    plan_type: string
  } | null>(null)
  const [loadingBusiness, setLoadingBusiness] = useState(true)
  const [stats, setStats] = useState({
    totalViews: 0,
    totalRedemptions: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Redireciona admin para /admin (exceto se estiver editando uma empresa)
  useEffect(() => {
    if (!authLoading && !adminLoading && user && isAdmin) {
      const adminViewingBusiness = localStorage.getItem('admin_viewing_business')
      if (!adminViewingBusiness) {
        router.push('/admin')
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, router])

  useEffect(() => {
    if (!partner) return

    async function loadBusinessData() {
      const { data, error } = await supabase
        .from('businesses')
        .select('name, slug, plan_type')
        .eq('id', partner?.businessId)
        .single()

      if (!error && data) {
        setBusinessData(data)
      }
      setLoadingBusiness(false)
    }

    loadBusinessData()
  }, [partner, supabase])

  useEffect(() => {
    if (!partner) return

    async function loadRecentCoupons() {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('business_id', partner?.businessId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!error && data) {
        setRecentCoupons(data)
      }
      setLoadingCoupons(false)
    }

    loadRecentCoupons()
  }, [partner, supabase])

  // Carregar estatísticas (visitas e resgates)
  useEffect(() => {
    if (!partner) return

    async function loadStats() {
      const { data, error } = await supabase
        .from('coupons')
        .select('views_count, redemptions_count')
        .eq('business_id', partner?.businessId)

      if (!error && data) {
        const totalViews = data.reduce((sum, coupon) => sum + (coupon.views_count || 0), 0)
        const totalRedemptions = data.reduce((sum, coupon) => sum + (coupon.redemptions_count || 0), 0)

        setStats({
          totalViews,
          totalRedemptions
        })
      }
      setLoadingStats(false)
    }

    loadStats()
  }, [partner, supabase])

  if (authLoading || partnerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#C2227A] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (!isPartner) {
    return (
      <>
        {/* VERSÃO MOBILE */}
        <div className="md:hidden min-h-screen bg-gray-50">
          <div className="bg-white shadow">
            <div className="px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <button onClick={signOut} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
                  Sair
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-3">Bem-vindo!</h2>
              <p className="text-sm text-gray-600 mb-4 break-all">{user.email}</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
                <p className="text-sm text-yellow-800">Cadastre sua empresa no Guia Marajoara</p>
              </div>

              <Link href="/cadastro" className="block w-full text-center px-6 py-3 bg-[#C2227A] text-white rounded-lg font-medium">
                Cadastrar Empresa
              </Link>
              
              <div className="mt-5 text-center">
                <a href="/" className="text-sm text-blue-600">← Voltar ao site</a>
              </div>
            </div>
          </div>
        </div>

        {/* VERSÃO DESKTOP */}
        <div className="hidden md:block min-h-screen bg-gray-50">
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button onClick={signOut} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Sair
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Bem-vindo!</h2>
              <p className="text-gray-600 mb-4">Email: {user.email}</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">Você ainda não é um parceiro. Quer cadastrar sua empresa no Guia Marajoara?</p>
              </div>

              <Link href="/cadastro" className="inline-block px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860]">
                Cadastrar Empresa
              </Link>
              
              <div className="mt-6">
                <a href="/" className="text-blue-600 hover:underline">← Voltar ao site</a>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!partner || !businessData) {
    if (loadingBusiness) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#C2227A] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados da empresa...</p>
          </div>
        </div>
      )
    }
    return null
  }

  const activeCoupons = recentCoupons.filter(c => c.status === 'active').length
  const { totalViews, totalRedemptions } = stats

  const businessName = businessData.name
  const businessSlug = businessData.slug
  const planType = businessData.plan_type
  const maxCoupons = planType === 'premium' ? 10 : 5

  const exitAdminMode = () => {
    localStorage.removeItem('admin_viewing_business')
    router.push('/admin')
  }

  return (
    <>
      {/* Banner de Admin Editando */}
      {isAdmin && (
        <div className="bg-purple-600 text-white py-2 px-4 text-center">
          <p className="text-sm">
            <strong>Modo Admin:</strong> Você está editando esta empresa.
            <button
              onClick={exitAdminMode}
              className="ml-3 underline hover:no-underline font-semibold"
            >
              Voltar ao Painel Admin
            </button>
          </p>
        </div>
      )}

      {/* ========== VERSÃO MOBILE (< md) ========== */}
      <div className="md:hidden min-h-screen bg-gray-50">
        <div className="bg-white shadow sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <Link href="/" className="text-xs text-gray-500">← Site</Link>
              <button onClick={signOut} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg">
                Sair
              </button>
            </div>
            <h1 className="text-lg font-bold text-gray-900 truncate">{businessName}</h1>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500 truncate flex-1">{user.email}</p>
              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full whitespace-nowrap">
                {planType === 'premium' ? 'Premium' : 'Básico'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-gray-500">CUPONS</h3>
                <Tag className="w-4 h-4 text-[#C2227A]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{activeCoupons}/{maxCoupons}</p>
              <p className="text-xs text-gray-500 mt-0.5">ativos</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-gray-500">VISITAS</h3>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-0.5">+12% semana</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-gray-500">RESGATES</h3>
                <Tag className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalRedemptions}</p>
              <p className="text-xs text-green-600 mt-0.5">+5% semana</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-gray-500">VISITA</h3>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-base font-bold text-gray-900">Hoje</p>
              <p className="text-xs text-gray-500 mt-0.5">14:32</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-5">
            <h2 className="text-base font-bold mb-4">Gerenciar</h2>
            <div className="space-y-2">
              <Link href="/dashboard/cupons" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg active:bg-gray-50">
                <div className="w-10 h-10 bg-[#C2227A] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-[#C2227A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">Meus Cupons</h3>
                  <p className="text-xs text-gray-500 truncate">Criar e gerenciar</p>
                </div>
                <span className="text-[#C2227A] text-lg flex-shrink-0">→</span>
              </Link>

              <Link href="/dashboard/empresa" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg active:bg-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">Editar Empresa</h3>
                  <p className="text-xs text-gray-500 truncate">Atualizar dados</p>
                </div>
                <span className="text-blue-600 text-lg flex-shrink-0">→</span>
              </Link>

              <Link href="/dashboard/imagens" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg active:bg-gray-50">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">Logo & Banner</h3>
                  <p className="text-xs text-gray-500 truncate">Upload de imagens</p>
                </div>
                <span className="text-green-600 text-lg flex-shrink-0">→</span>
              </Link>

              <Link href="/dashboard/horarios" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg active:bg-gray-50">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">Horários</h3>
                  <p className="text-xs text-gray-500 truncate">Funcionamento</p>
                </div>
                <span className="text-purple-600 text-lg flex-shrink-0">→</span>
              </Link>

              <Link href="/dashboard/google-avaliacoes" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg active:bg-gray-50">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">Avaliações Google</h3>
                  <p className="text-xs text-gray-500 truncate">Vincular ao Google</p>
                </div>
                <span className="text-yellow-600 text-lg flex-shrink-0">→</span>
              </Link>

              <Link href={`/empresas/${businessSlug}`} target="_blank" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg active:bg-gray-50">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">Página Pública</h3>
                  <p className="text-xs text-gray-500 truncate">Ver como cliente</p>
                </div>
                <span className="text-indigo-600 text-lg flex-shrink-0">→</span>
              </Link>

              <Link href="/dashboard/plano" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg active:bg-gray-50">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">Meu Plano</h3>
                  <p className="text-xs text-gray-500 truncate">Assinatura</p>
                </div>
                <span className="text-yellow-600 text-lg flex-shrink-0">→</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold">Cupons Recentes</h2>
              <Link href="/dashboard/cupons" className="text-xs text-[#C2227A] font-medium">Ver Todos →</Link>
            </div>
            
            {loadingCoupons ? (
              <div className="text-center py-8 text-sm text-gray-500">Carregando...</div>
            ) : recentCoupons.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500 mb-4">Nenhum cupom criado</p>
                <Link href="/dashboard/cupons/novo" className="inline-block px-5 py-2 bg-[#C2227A] text-white rounded-lg text-sm">
                  + Criar Cupom
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCoupons.map(coupon => (
                  <div key={coupon.id} className="flex gap-3 p-3 border border-gray-200 rounded-lg">
                    <img src={coupon.image_url} alt={coupon.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{coupon.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                          coupon.status === 'active' ? 'bg-green-100 text-green-700' :
                          coupon.status === 'expired' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {coupon.status === 'active' ? 'Ativo' : coupon.status === 'expired' ? 'Expirado' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">Até {new Date(coupon.expires_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {coupon.views_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={12} /> {coupon.redemptions_count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== VERSÃO DESKTOP (≥ md) ========== */}
      <div className="hidden md:block min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Voltar ao Site</Link>
              <button onClick={signOut} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Sair</button>
            </div>
          </div>
        </div>

        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{businessName}</h1>
                <p className="text-gray-500 mt-1">{user.email}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">Plano: {planType === 'premium' ? 'Premium' : 'Básico'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">CUPONS</h3>
                <Tag className="w-5 h-5 text-[#C2227A]" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{activeCoupons} / {maxCoupons}</p>
              <p className="text-xs text-gray-500 mt-1">ativos</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">VISITAS</h3>
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+12% semana</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">RESGATES</h3>
                <Tag className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalRedemptions}</p>
              <p className="text-xs text-green-600 mt-1">+5% semana</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">ÚLTIMA VISITA</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-lg font-bold text-gray-900">Hoje</p>
              <p className="text-xs text-gray-500 mt-1">às 14:32</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Gerenciar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/dashboard/cupons" className="group border-2 border-gray-200 rounded-xl p-6 hover:border-[#C2227A] hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#C2227A] bg-opacity-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-all">
                    <Tag className="w-8 h-8 text-[#C2227A]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Meus Cupons</h3>
                  <p className="text-sm text-gray-500 mb-4">Criar e gerenciar cupons de desconto</p>
                  <span className="text-[#C2227A] font-medium">Gerenciar →</span>
                </div>
              </Link>

              <Link href="/dashboard/empresa" className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-600 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Editar Empresa</h3>
                  <p className="text-sm text-gray-500 mb-4">Atualizar dados e informações</p>
                  <span className="text-blue-600 font-medium">Editar →</span>
                </div>
              </Link>

              <Link href="/dashboard/imagens" className="group border-2 border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-all">
                    <ImageIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Logo & Banner</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload de imagens da empresa</p>
                  <span className="text-green-600 font-medium">Upload →</span>
                </div>
              </Link>

              <Link href="/dashboard/horarios" className="group border-2 border-gray-200 rounded-xl p-6 hover:border-purple-600 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-all">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Horários</h3>
                  <p className="text-sm text-gray-500 mb-4">Configurar horário de funcionamento</p>
                  <span className="text-purple-600 font-medium">Configurar →</span>
                </div>
              </Link>

              <Link href={`/empresas/${businessSlug}`} target="_blank" className="group border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-all">
                    <ExternalLink className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Página Pública</h3>
                  <p className="text-sm text-gray-500 mb-4">Ver como os clientes veem</p>
                  <span className="text-indigo-600 font-medium">Visualizar →</span>
                </div>
              </Link>

              <Link href="/dashboard/plano" className="group border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-600 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-all">
                    <CreditCard className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Meu Plano</h3>
                  <p className="text-sm text-gray-500 mb-4">Gerenciar assinatura e pagamento</p>
                  <span className="text-yellow-600 font-medium">Ver Plano →</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Cupons Recentes</h2>
              <Link href="/dashboard/cupons" className="text-[#C2227A] font-medium hover:underline">Ver Todos →</Link>
            </div>
            
            {loadingCoupons ? (
              <div className="text-center py-8 text-gray-500">Carregando...</div>
            ) : recentCoupons.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum cupom criado ainda</p>
                <Link href="/dashboard/cupons/novo" className="inline-block mt-4 px-6 py-2 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860]">+ Criar Primeiro Cupom</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCoupons.map(coupon => (
                  <div key={coupon.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <img src={coupon.image_url} alt={coupon.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                          coupon.status === 'active' ? 'bg-green-100 text-green-700' :
                          coupon.status === 'expired' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {coupon.status === 'active' ? 'Ativo' : 
                           coupon.status === 'expired' ? 'Expirado' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Válido até {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {coupon.views_count} visualizações
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={14} /> {coupon.redemptions_count} resgates
                        </span>
                      </div>
                    </div>
                    <Link href="/dashboard/cupons" className="text-blue-600 hover:underline text-sm flex-shrink-0">Ver →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}