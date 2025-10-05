'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'

interface PartnerData {
  id: string
  businessId: string
  status: string
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
      // Se é admin, verifica se está visualizando uma empresa
      if (isAdmin) {
        const adminBusinessId = localStorage.getItem('admin_viewing_business')
        if (adminBusinessId) {
          // Verificar se a empresa existe
          const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('id', adminBusinessId)
            .single()

          if (business) {
            setPartner({
              id: 'admin-access',
              businessId: adminBusinessId,
              status: 'active'
            })
            setLoading(false)
            return
          }
        }
      }

      // Busca parceiro normal
      const { data } = await supabase
        .from('partners')
        .select('id, business_id, status')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single()

      setPartner(data ? {
        id: data.id,
        businessId: data.business_id,
        status: data.status
      } : null)
      setLoading(false)
    }

    loadPartner()
  }, [user, authLoading, isAdmin, adminLoading, supabase])

  return {
    partner,
    isPartner: !!partner,
    loading: loading || authLoading || adminLoading
  }
}