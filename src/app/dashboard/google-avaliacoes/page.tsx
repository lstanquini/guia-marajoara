'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Search, MapPin, Star, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export default function GoogleAvaliacoesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { partner, loading: partnerLoading } = usePartner(user?.id)
  const supabase = createClientComponentClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<GooglePlaceResult[]>([])
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [businessInfo, setBusinessInfo] = useState<any>(null)

  // Carregar informações da empresa
  useEffect(() => {
    if (partner?.businessId) {
      loadBusinessInfo()
    }
  }, [partner])

  const loadBusinessInfo = async () => {
    if (!partner?.businessId) return

    const { data, error } = await supabase
      .from('businesses')
      .select('name, address, address_number, neighborhood, city, state, google_place_id, rating, total_reviews')
      .eq('id', partner.businessId)
      .single()

    if (!error && data) {
      setBusinessInfo(data)
      setCurrentPlaceId(data.google_place_id)

      // Pré-preencher busca com nome + cidade
      const fullAddress = `${data.name}, ${data.address}${data.address_number ? `, ${data.address_number}` : ''}, ${data.city} - ${data.state}`
      setSearchQuery(fullAddress)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage({ type: 'error', text: 'Digite o nome ou endereço da empresa' })
      return
    }

    setSearching(true)
    setMessage(null)
    setResults([])

    try {
      const response = await fetch(`/api/google-places?query=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error('Erro ao buscar no Google')
      }

      const data = await response.json()

      // A API retorna um único resultado, vamos colocar em array
      setResults([data])

    } catch (error) {
      console.error('Erro na busca:', error)
      setMessage({ type: 'error', text: 'Não foi possível encontrar a empresa no Google. Tente com um nome ou endereço diferente.' })
    } finally {
      setSearching(false)
    }
  }

  const handleSavePlace = async () => {
    if (!selectedPlaceId || !partner?.businessId) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('businesses')
        .update({ google_place_id: selectedPlaceId })
        .eq('id', partner.businessId)

      if (error) throw error

      setCurrentPlaceId(selectedPlaceId)
      setMessage({ type: 'success', text: 'Google Place vinculado com sucesso!' })

      // Sincronizar avaliações automaticamente
      await handleSyncRatings(selectedPlaceId)

    } catch (error) {
      console.error('Erro ao salvar:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  const handleSyncRatings = async (placeId?: string) => {
    const idToSync = placeId || currentPlaceId
    if (!idToSync || !partner?.businessId) return

    setSyncing(true)
    setMessage(null)

    try {
      // Buscar dados atualizados do Google
      const response = await fetch(`/api/google-places?placeId=${idToSync}`)

      if (!response.ok) {
        throw new Error('Erro ao buscar avaliações')
      }

      const data = await response.json()

      // Atualizar rating e total_reviews no banco
      const { error } = await supabase
        .from('businesses')
        .update({
          rating: data.rating || null,
          total_reviews: data.user_ratings_total || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', partner.businessId)

      if (error) throw error

      // Recarregar informações
      await loadBusinessInfo()

      setMessage({
        type: 'success',
        text: `Avaliações sincronizadas! ${data.rating ? `Rating: ${data.rating} (${data.user_ratings_total} avaliações)` : 'Nenhuma avaliação encontrada'}`
      })

    } catch (error) {
      console.error('Erro ao sincronizar:', error)
      setMessage({ type: 'error', text: 'Erro ao sincronizar avaliações. Tente novamente.' })
    } finally {
      setSyncing(false)
    }
  }

  if (partnerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2227A] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!partner?.businessId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso negado</h2>
          <p className="text-gray-600 mb-4">Você precisa ser parceiro para acessar esta página.</p>
          <Button onClick={() => router.push('/dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Avaliações do Google</h1>
          <p className="text-gray-600">
            Vincule sua empresa ao Google para exibir avaliações reais dos clientes
          </p>
        </div>

        {/* Status atual */}
        {businessInfo && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Atual</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Empresa:</span>
                <span className="font-medium text-gray-900">{businessInfo.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Google Place ID:</span>
                <span className="font-medium text-gray-900">
                  {currentPlaceId ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={16} />
                      Vinculado
                    </span>
                  ) : (
                    <span className="text-orange-600">Não vinculado</span>
                  )}
                </span>
              </div>

              {currentPlaceId && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avaliação:</span>
                    <span className="font-medium text-gray-900 flex items-center gap-2">
                      {businessInfo.rating ? (
                        <>
                          <Star size={16} className="text-yellow-400" fill="currentColor" />
                          {businessInfo.rating.toFixed(1)} ({businessInfo.total_reviews || 0} avaliações)
                        </>
                      ) : (
                        'Sem avaliações'
                      )}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => handleSyncRatings()}
                      disabled={syncing}
                      className="w-full"
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="animate-spin mr-2" size={18} />
                          Sincronizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2" size={18} />
                          Sincronizar Avaliações
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mensagens */}
        {message && (
          <div className={`rounded-xl p-4 mb-6 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {/* Busca */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentPlaceId ? 'Alterar Vinculação' : 'Vincular ao Google'}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Busque sua empresa no Google Maps para vincular as avaliações
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Nome da empresa, endereço..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
              disabled={searching}
            />
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="px-6"
            >
              {searching ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={18} />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2" size={18} />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados</h3>

            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.place_id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPlaceId === result.place_id
                      ? 'border-[#C2227A] bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlaceId(result.place_id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">
                        {result.name}
                      </h4>

                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{result.formatted_address}</span>
                      </div>

                      {result.rating && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star size={16} className="text-yellow-400" fill="currentColor" />
                          <span className="font-medium text-gray-900">
                            {result.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-600">
                            ({result.user_ratings_total || 0} avaliações)
                          </span>
                        </div>
                      )}
                    </div>

                    {selectedPlaceId === result.place_id && (
                      <CheckCircle className="text-[#C2227A] flex-shrink-0" size={24} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedPlaceId && (
              <div className="mt-6 pt-6 border-t">
                <Button
                  onClick={handleSavePlace}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? 'Salvando...' : 'Vincular esta Empresa'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Informações */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Como funciona?</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Busque sua empresa pelo nome ou endereço</li>
            <li>• Selecione o resultado correto (verifique endereço e avaliações)</li>
            <li>• Clique em "Vincular esta Empresa"</li>
            <li>• As avaliações serão sincronizadas automaticamente</li>
            <li>• Use o botão "Sincronizar" para atualizar as avaliações quando quiser</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
