'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/auth-context'

interface AdminData {
  id: string
  name: string
}

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setAdmin(null)
      setLoading(false)
      return
    }

    async function loadAdmin() {
      const { data } = await supabase
        .from('admins')
        .select('id, name')
        .eq('user_id', user?.id)
        .single()

      setAdmin(data)
      setLoading(false)
    }

    loadAdmin()
  }, [user, authLoading, supabase])

  return {
    admin,
    isAdmin: !!admin,
    loading: loading || authLoading
  }
}