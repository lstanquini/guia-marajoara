'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Clock } from 'lucide-react'

interface DaySchedule {
  open: string
  close: string
  closed: boolean
}

interface Schedule {
  [key: string]: DaySchedule
}

const DAYS = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
]

export default function HorariosPage() {
  const { user, loading: authLoading } = useAuth()
  const { isPartner, loading: partnerLoading } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  
  const [schedule, setSchedule] = useState<Schedule>({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: '09:00', close: '14:00', closed: true }
  })

  useEffect(() => {
    if (authLoading || partnerLoading) return
    
    if (!user || !isPartner) {
      router.push('/login')
      return
    }

    async function loadBusiness() {
      const { data } = await supabase
        .from('businesses')
        .select('id, opening_hours')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setBusinessId(data.id)
        if (data.opening_hours && Object.keys(data.opening_hours).length > 0) {
          setSchedule(data.opening_hours)
        }
      }
    }

    loadBusiness()
  }, [user, isPartner, router, supabase, authLoading, partnerLoading])

  const handleDayChange = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value
      }
    })
  }

  const copyToAll = (day: string) => {
    const daySchedule = schedule[day]
    const newSchedule: Schedule = {}
    
    DAYS.forEach(d => {
      newSchedule[d.key] = { ...daySchedule }
    })
    
    setSchedule(newSchedule)
    toast.info('Horário copiado para todos os dias')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          opening_hours: schedule,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)

      if (error) throw error

      toast.success('Horários atualizados com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar horários')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || partnerLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user || !isPartner) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">← Voltar ao Dashboard</Link>
          <h1 className="text-2xl font-bold">Horários de Funcionamento</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#C2227A]" />
              <h2 className="text-lg font-bold">Configurar Horários</h2>
            </div>

            <div className="space-y-4">
              {DAYS.map(day => (
                <div key={day.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!schedule[day.key].closed}
                        onChange={(e) => handleDayChange(day.key, 'closed', !e.target.checked)}
                        className="rounded"
                      />
                      <span className="font-medium">{day.label}</span>
                    </label>
                    
                    <button
                      type="button"
                      onClick={() => copyToAll(day.key)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Copiar para todos
                    </button>
                  </div>

                  {!schedule[day.key].closed ? (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Abertura</label>
                        <input
                          type="time"
                          value={schedule[day.key].open}
                          onChange={(e) => handleDayChange(day.key, 'open', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Fechamento</label>
                        <input
                          type="time"
                          value={schedule[day.key].close}
                          onChange={(e) => handleDayChange(day.key, 'close', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 ml-6">Fechado</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => router.back()} className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar Horários'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}