'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CreditCard, Check, Tag, Image as ImageIcon, Calendar } from 'lucide-react'

export default function PlanoPage() {
  const { user, loading: authLoading } = useAuth()
  const { partner, isPartner, loading: partnerLoading } = usePartner()
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)

  useEffect(() => {
    if (authLoading || partnerLoading) return
    
    if (!user || !isPartner) {
      router.push('/login')
      return
    }

    if (!partner?.businessId) return

    async function loadPlanInfo() {
      const { data } = await supabase
        .from('businesses')
        .select('plan_type, max_coupons, max_photos, featured_until, created_at')
        .eq('id', partner?.businessId)
        .single()

      if (data) {
        setPlanInfo(data)
      }
      setLoadingPlan(false)
    }

    loadPlanInfo()
  }, [user, isPartner, partner, router, supabase, authLoading, partnerLoading])

  if (authLoading || partnerLoading || loadingPlan) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user || !isPartner || !planInfo) {
    return null
  }

  const isPremium = planInfo.plan_type === 'premium'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">← Voltar ao Dashboard</Link>
          <h1 className="text-2xl font-bold">Meu Plano</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${isPremium ? 'bg-purple-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                <CreditCard className={`w-6 h-6 ${isPremium ? 'text-purple-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Plano {isPremium ? 'Premium' : 'Básico'}</h2>
                <p className="text-sm text-gray-500">Ativo desde {new Date(planInfo.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            <span className={`px-4 py-2 ${isPremium ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'} rounded-full font-semibold`}>
              {isPremium ? 'Premium' : 'Básico'}
            </span>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Recursos incluídos:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  Até {planInfo.max_coupons} cupons ativos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                  Até {planInfo.max_photos} fotos na galeria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>Perfil completo com descrição e contatos</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>Estatísticas de visualizações e resgates</span>
              </div>
              {isPremium && (
                <>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Destaque na página inicial
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Selo Premium no perfil</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {!isPremium && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Upgrade para Premium</h3>
              <p className="text-gray-600">Aumente sua visibilidade e atraia mais clientes</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h4 className="font-bold mb-4">Benefícios Premium:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Mais cupons</p>
                    <p className="text-sm text-gray-600">De {planInfo.max_coupons} para 10 cupons ativos simultaneamente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Destaque na home</p>
                    <p className="text-sm text-gray-600">Apareça em posição de destaque para milhares de visitantes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Galeria ampliada</p>
                    <p className="text-sm text-gray-600">De {planInfo.max_photos} para 20 fotos para mostrar seus produtos e ambiente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Selo Premium</p>
                    <p className="text-sm text-gray-600">Badge especial que gera mais confiança</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all">
                Fazer Upgrade Agora
              </button>
              <p className="text-sm text-gray-600 mt-3">Entre em contato para mais informações</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="font-bold mb-4">Precisa de ajuda?</h3>
          <p className="text-gray-600 mb-4">Entre em contato com nosso suporte para dúvidas sobre seu plano, pagamento ou upgrade.</p>
          <div className="flex gap-4">
            <a href="mailto:contato@guiamarajoara.com.br" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Email</a>
            <a href="https://wa.me/5511999999999" target="_blank" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  )
}