'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tag, Eye, Calendar, FileText, Image as ImageIcon, Clock, ExternalLink, CreditCard } from 'lucide-react'

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
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [recentCoupons, setRecentCoupons] = useState<Coupon[]>([])
  const [loadingCoupons, setLoadingCoupons] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

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

  if (authLoading || partnerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!user) return null

  // Usuário comum (não é parceiro)
  if (!isPartner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <button onClick={signOut} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Sair</button>
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

            <Link href="/cadastro" className="inline-block px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860]">Cadastrar Empresa</Link>
            
            <div className="mt-6">
              <a href="/" className="text-blue-600 hover:underline">← Voltar ao site</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard do Parceiro
  if (!partner) return null

  const activeCoupons = recentCoupons.filter(c => c.status === 'active').length
  const totalViews = 1247 // TODO: pegar do banco
  const totalRedemptions = 89 // TODO: pegar do banco

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Voltar ao Site</Link>
            <button onClick={signOut} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Sair</button>
          </div>
        </div>
      </div>

      {/* Info do Parceiro */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{partner.businessName}</h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">Plano: {partner.planType === 'premium' ? 'Premium' : 'Básico'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">CUPONS</h3>
              <Tag className="w-5 h-5 text-[#C2227A]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeCoupons} / {partner.maxCoupons}</p>
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

        {/* Grid de Navegação */}
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

            <Link href={`/empresas/${partner.businessSlug}`} target="_blank" className="group border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all">
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

        {/* Cupons Recentes */}
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
                        {coupon.status === 'active' ? '🟢 Ativo' : 
                         coupon.status === 'expired' ? '🔴 Expirado' : '⚪ Inativo'}
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
                  <Link href={`/dashboard/cupons`} className="text-blue-600 hover:underline text-sm flex-shrink-0">Ver →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}