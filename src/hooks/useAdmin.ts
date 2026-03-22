'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { createClient } from '@/lib/supabase'

interface AdminData {
  id: string
  name: string
}

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

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
