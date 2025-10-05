'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Save, Package } from 'lucide-react'

interface PlanTemplate {
  id: string
  plan_type: string
  max_coupons: number
  max_photos: number
  featured_days: number
  name: string
  description: string | null
}

export default function PlanosPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [plans, setPlans] = useState<PlanTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || adminLoading) return

    if (!user || !isAdmin) {
      router.push('/login')
    }
  }, [user, isAdmin, authLoading, adminLoading, router])

  useEffect(() => {
    if (!isAdmin) return

    async function loadPlans() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('plan_templates')
          .select('*')
          .order('plan_type')

        if (error) throw error
        setPlans(data || [])
      } catch (error) {
        console.error('Erro ao carregar planos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [isAdmin, supabase])

  const updatePlan = async (plan: PlanTemplate) => {
    setSaving(plan.id)
    try {
      const { error } = await supabase
        .from('plan_templates')
        .update({
          max_coupons: plan.max_coupons,
          max_photos: plan.max_photos,
          featured_days: plan.featured_days,
          name: plan.name,
          description: plan.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', plan.id)

      if (error) throw error

      alert('Plano atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
      alert('Erro ao atualizar plano')
    } finally {
      setSaving(null)
    }
  }

  const handleChange = (planId: string, field: keyof PlanTemplate, value: any) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, [field]: value } : p
    ))
  }

  if (authLoading || adminLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciar Planos</h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Definir características padrão dos planos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${plan.plan_type === 'premium' ? 'bg-gradient-to-r from-[#C2227A] to-[#A01860]' : 'bg-gray-100'}`}>
                  <Package className={`w-6 h-6 ${plan.plan_type === 'premium' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{plan.plan_type}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Plano
                  </label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handleChange(plan.id, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={plan.description || ''}
                    onChange={(e) => handleChange(plan.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de Cupons
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={plan.max_coupons}
                    onChange={(e) => handleChange(plan.id, 'max_coupons', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de Fotos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={plan.max_photos}
                    onChange={(e) => handleChange(plan.id, 'max_photos', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dias em Destaque
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={plan.featured_days}
                    onChange={(e) => handleChange(plan.id, 'featured_days', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Número de dias que a empresa fica em destaque após aprovação
                  </p>
                </div>
              </div>

              <button
                onClick={() => updatePlan(plan)}
                disabled={saving === plan.id}
                className="w-full mt-6 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving === plan.id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Sobre os Planos</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Máximo de Cupons:</strong> Quantos cupons simultâneos a empresa pode ter ativos</li>
            <li>• <strong>Máximo de Fotos:</strong> Quantas fotos a empresa pode fazer upload na galeria</li>
            <li>• <strong>Dias em Destaque:</strong> Quando aprovada, a empresa fica destacada na home por X dias</li>
          </ul>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Essas são as configurações padrão. Você pode personalizar limites específicos para cada empresa individualmente na página de administração.
          </p>
        </div>
      </div>
    </div>
  )
}