'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Clock, ArrowLeft, Copy } from 'lucide-react'

interface DaySchedule {
  open: string
  close: string
  closed: boolean
}

interface Schedule {
  [key: string]: DaySchedule
}

const DAYS = [
  { key: 'monday', label: 'Segunda-feira', short: 'Seg' },
  { key: 'tuesday', label: 'Terça-feira', short: 'Ter' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'Qua' },
  { key: 'thursday', label: 'Quinta-feira', short: 'Qui' },
  { key: 'friday', label: 'Sexta-feira', short: 'Sex' },
  { key: 'saturday', label: 'Sábado', short: 'Sáb' },
  { key: 'sunday', label: 'Domingo', short: 'Dom' }
]

const STORAGE_KEY = 'editar-horarios-draft'

export default function HorariosPage() {
  const { user, loading: authLoading } = useAuth()
  const { isPartner, partner, loading: partnerLoading } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  const hasLoadedFromStorage = useRef(false)

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

    if (!user || !isPartner || !partner) {
      router.push('/login')
      return
    }

    async function loadBusiness() {
      if (!partner?.businessId) {
        console.error('Business ID não encontrado')
        toast.error('Empresa não encontrada')
        return
      }

      const { data, error } = await supabase
        .from('businesses')
        .select('id, opening_hours')
        .eq('id', partner.businessId)
        .single()

      if (error) {
        console.error('Erro ao carregar business:', error)
        toast.error('Erro ao carregar horários da empresa')
        return
      }

      if (data) {
        setBusinessId(data.id)

        const dbData = data.opening_hours && Object.keys(data.opening_hours).length > 0
          ? data.opening_hours
          : schedule

        // Verificar se há rascunho salvo no localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved && !hasLoadedFromStorage.current) {
            const parsedData = JSON.parse(saved)
            setSchedule(parsedData)
            console.log('Horários restaurados do localStorage')
          } else {
            setSchedule(dbData)
          }
        } catch (err) {
          console.error('Erro ao carregar dados salvos:', err)
          setSchedule(dbData)
        }

        hasLoadedFromStorage.current = true
      }
    }

    loadBusiness()
  }, [user, isPartner, partner, router, supabase, authLoading, partnerLoading, toast])

  // Salvar dados no localStorage sempre que schedule mudar
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule))
    } catch (err) {
      console.error('Erro ao salvar dados:', err)
    }
  }, [schedule])

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

      // Limpar rascunho salvo após sucesso
      localStorage.removeItem(STORAGE_KEY)

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
    <>
      {/* Header Mobile - Sticky */}
      <div className="sticky top-0 z-10 bg-white shadow md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C2227A]" />
              <h1 className="text-lg font-bold">Horários</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:block bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Horários de Funcionamento</h1>
        </div>
      </div>

      {/* Formulário */}
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            
            {/* Card Principal */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              
              {/* Título Desktop */}
              <div className="hidden md:flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-[#C2227A]" />
                <h2 className="text-lg font-bold">Configurar Horários</h2>
              </div>

              {/* Lista de Dias */}
              <div className="space-y-3 md:space-y-4">
                {DAYS.map(day => (
                  <div key={day.key} className="border rounded-lg p-3 md:p-4">
                    
                    {/* Cabeçalho do Dia */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!schedule[day.key].closed}
                          onChange={(e) => handleDayChange(day.key, 'closed', !e.target.checked)}
                          className="rounded w-4 h-4"
                        />
                        <span className="font-medium text-sm md:text-base">
                          <span className="md:hidden">{day.short}</span>
                          <span className="hidden md:inline">{day.label}</span>
                        </span>
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => copyToAll(day.key)}
                        className="flex items-center gap-1 text-xs md:text-sm text-blue-600 hover:text-blue-700 hover:underline self-start sm:self-auto"
                      >
                        <Copy className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="md:hidden">Copiar</span>
                        <span className="hidden md:inline">Copiar para todos</span>
                      </button>
                    </div>

                    {/* Horários ou Fechado */}
                    {!schedule[day.key].closed ? (
                      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 ml-0 md:ml-6">
                        <div>
                          <label className="block text-xs md:text-sm text-gray-600 mb-1">Abertura</label>
                          <input
                            type="time"
                            value={schedule[day.key].open}
                            onChange={(e) => handleDayChange(day.key, 'open', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A] text-sm md:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm text-gray-600 mb-1">Fechamento</label>
                          <input
                            type="time"
                            value={schedule[day.key].close}
                            onChange={(e) => handleDayChange(day.key, 'close', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A] text-sm md:text-base"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 ml-0 md:ml-6">Fechado</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Botões Mobile - Empilhados */}
            <div className="flex flex-col gap-3 md:hidden">
              <button 
                type="button" 
                onClick={() => router.back()} 
                className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50" 
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 font-semibold"
              >
                {loading ? 'Salvando...' : 'Salvar Horários'}
              </button>
            </div>

            {/* Botões Desktop - Lado a Lado */}
            <div className="hidden md:flex gap-4">
              <button 
                type="button" 
                onClick={() => router.back()} 
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50" 
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 font-semibold"
              >
                {loading ? 'Salvando...' : 'Salvar Horários'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}