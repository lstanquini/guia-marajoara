'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'

interface PartnerData {
  id: string
  businessId: string
  status: string
  maxCoupons: number
  planName: string
}

export function usePartner() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [partner, setPartner] = useState<PartnerData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (authLoading || adminLoading) return

    if (!user) {
      setPartner(null)
      setLoading(false)
      return
    }

    async function loadPartner() {
      try {
        // Se é admin, verifica se está visualizando uma empresa
        if (isAdmin) {
          const adminBusinessId = localStorage.getItem('admin_viewing_business')
          if (adminBusinessId) {
            // Buscar empresa com dados do plano
            const { data: business, error } = await supabase
              .from('businesses')
              .select('id, plan_type, max_coupons')
              .eq('id', adminBusinessId)
              .single()

            if (!error && business) {
              // Usar max_coupons do banco OU calcular baseado no plan_type
              const maxCoupons = business.max_coupons || (business.plan_type === 'premium' ? 10 : 5)
              const planName = business.plan_type === 'premium' ? 'Premium' : 'Básico'

              setPartner({
                id: 'admin-access',
                businessId: adminBusinessId,
                status: 'active',
                maxCoupons,
                planName
              })
              setLoading(false)
              return
            } else {
              console.error('Erro ao buscar empresa para admin:', error)
            }
          }
        }

        // Busca parceiro normal
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners')
          .select('id, business_id, status')
          .eq('user_id', user?.id)
          .eq('status', 'active')
          .single()

        if (!partnerError && partnerData) {
          // Buscar dados da empresa
          const { data: businessData } = await supabase
            .from('businesses')
            .select('plan_type, max_coupons')
            .eq('id', partnerData.business_id)
            .single()

          // Usar max_coupons do banco OU calcular baseado no plan_type
          const maxCoupons = businessData?.max_coupons || (businessData?.plan_type === 'premium' ? 10 : 5)
          const planName = businessData?.plan_type === 'premium' ? 'Premium' : 'Básico'

          setPartner({
            id: partnerData.id,
            businessId: partnerData.business_id,
            status: partnerData.status,
            maxCoupons,
            planName
          })
        } else {
          setPartner(null)
        }
      } catch (err) {
        console.error('Erro crítico no usePartner:', err)
        setPartner(null)
      } finally {
        setLoading(false)
      }
    }

    loadPartner()
  }, [user, authLoading, isAdmin, adminLoading, supabase])

  return {
    partner,
    isPartner: !!partner,
    loading: loading || authLoading || adminLoading
  }
}