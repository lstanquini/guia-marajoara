'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Phone, Globe, Instagram, MapPin, Mail, Star, Search } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
}

const STORAGE_KEY_PREFIX = 'editar-empresa-draft-'

export default function EditarEmpresaPage() {
  const { user, loading: authLoading } = useAuth()
  const { isPartner, partner, loading: partnerLoading } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingCep, setLoadingCep] = useState(false)
  const hasLoadedFromDB = useRef(false)
  const storageKey = useRef<string>('')

  // Estados para Google Places
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(null)
  const [googlePlaceData, setGooglePlaceData] = useState<GooglePlaceResult | null>(null)
  const [googleSearchQuery, setGoogleSearchQuery] = useState('')
  const [googleSearchResults, setGoogleSearchResults] = useState<GooglePlaceResult[]>([])
  const [loadingGoogleSearch, setLoadingGoogleSearch] = useState(false)
  const [syncingRatings, setSyncingRatings] = useState(false)
  const [notOnGoogle, setNotOnGoogle] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category_sub: '',
    description: '',
    email_business: '',
    phone: '',
    whatsapp: '',
    website: '',
    instagram: '',
    address: '',
    address_number: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    delivery: false
  })

  // Salvar dados no localStorage sempre que formData mudar (exceto na primeira carga)
  useEffect(() => {
    if (hasLoadedFromDB.current && businessId && storageKey.current) {
      try {
        localStorage.setItem(storageKey.current, JSON.stringify(formData))
      } catch (err) {
        console.error('Erro ao salvar dados:', err)
      }
    }
  }, [formData, businessId])

  // Carrega categorias
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')
      
      if (data) {
        setCategories(data)
      }
      setLoadingCategories(false)
    }
    
    loadCategories()
  }, [supabase])

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

      // Define a chave do localStorage para esta empresa
      storageKey.current = `${STORAGE_KEY_PREFIX}${partner.businessId}`

      // Verificar se há dados salvos no localStorage
      try {
        const saved = localStorage.getItem(storageKey.current)
        if (saved) {
          const parsedData = JSON.parse(saved)
          setBusinessId(partner.businessId)
          setFormData(parsedData)
          hasLoadedFromDB.current = true
          console.log('Dados restaurados do localStorage')
          return // Usar dados salvos ao invés de buscar do banco
        }
      } catch (err) {
        console.error('Erro ao carregar dados salvos:', err)
      }

      // Se não há dados salvos, buscar do banco
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', partner.businessId)
        .single()

      if (error) {
        console.error('Erro ao carregar business:', error)
        toast.error('Erro ao carregar dados da empresa')
        return
      }

      if (data) {
        setBusinessId(data.id)
        setFormData({
          name: data.name || '',
          category_sub: data.category_sub || '',
          description: data.description || '',
          email_business: data.email_business || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          website: data.website || '',
          instagram: data.instagram || '',
          address: data.address || '',
          address_number: data.address_number || '',
          neighborhood: data.neighborhood || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          delivery: data.delivery || false
        })

        // Carregar google_place_id
        if (data.google_place_id) {
          setGooglePlaceId(data.google_place_id)
          // Buscar dados do Google Place
          try {
            const response = await fetch(`/api/google-places?placeId=${data.google_place_id}`)
            if (response.ok) {
              const placeData = await response.json()
              setGooglePlaceData({
                place_id: data.google_place_id,
                name: placeData.name,
                formatted_address: placeData.formatted_address,
                rating: placeData.rating,
                user_ratings_total: placeData.user_ratings_total
              })
            }
          } catch (err) {
            console.error('Erro ao carregar dados do Google:', err)
          }
        } else if (data.google_place_id === 'not_on_google') {
          setNotOnGoogle(true)
        }

        hasLoadedFromDB.current = true
      }
    }

    loadBusiness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isPartner, partner, authLoading, partnerLoading, router])

  // Função para buscar no Google Places
  const handleGoogleSearch = async () => {
    if (!googleSearchQuery.trim()) {
      toast.error('Digite o nome da sua empresa para buscar')
      return
    }

    setLoadingGoogleSearch(true)
    setGoogleSearchResults([])

    try {
      const query = `${googleSearchQuery}, ${formData.neighborhood || formData.city}`
      const response = await fetch(`/api/google-places?query=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error('Erro ao buscar no Google')
      }

      const data = await response.json()

      if (data.place_id) {
        // Retornou um único resultado
        setGoogleSearchResults([{
          place_id: data.place_id,
          name: data.name,
          formatted_address: data.formatted_address,
          rating: data.rating,
          user_ratings_total: data.user_ratings_total
        }])
      } else if (Array.isArray(data)) {
        setGoogleSearchResults(data)
      } else {
        toast.error('Nenhum resultado encontrado')
      }
    } catch (error) {
      console.error('Erro ao buscar:', error)
      toast.error('Erro ao buscar no Google Places')
    } finally {
      setLoadingGoogleSearch(false)
    }
  }

  // Função para vincular ao Google Place
  const handleLinkGooglePlace = async (placeId: string, placeData: GooglePlaceResult) => {
    if (!businessId) return

    try {
      setLoading(true)

      // Salvar google_place_id no banco
      const { error } = await supabase
        .from('businesses')
        .update({ google_place_id: placeId })
        .eq('id', businessId)

      if (error) throw error

      setGooglePlaceId(placeId)
      setGooglePlaceData(placeData)
      setGoogleSearchResults([])
      setGoogleSearchQuery('')

      toast.success('Empresa vinculada ao Google com sucesso!')

      // Sincronizar avaliações automaticamente
      await handleSyncRatings(placeId)
    } catch (error) {
      console.error('Erro ao vincular:', error)
      toast.error('Erro ao vincular ao Google')
    } finally {
      setLoading(false)
    }
  }

  // Função para sincronizar avaliações
  const handleSyncRatings = async (placeId?: string) => {
    const idToSync = placeId || googlePlaceId
    if (!idToSync || !businessId) return

    setSyncingRatings(true)

    try {
      const response = await fetch(`/api/google-places?placeId=${idToSync}`)
      if (!response.ok) throw new Error('Erro ao buscar avaliações')

      const data = await response.json()

      const { error } = await supabase
        .from('businesses')
        .update({
          rating: data.rating || null,
          total_reviews: data.user_ratings_total || null
        })
        .eq('id', businessId)

      if (error) throw error

      // Atualizar dados locais
      if (googlePlaceData) {
        setGooglePlaceData({
          ...googlePlaceData,
          rating: data.rating,
          user_ratings_total: data.user_ratings_total
        })
      }

      toast.success('Avaliações sincronizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao sincronizar:', error)
      toast.error('Erro ao sincronizar avaliações')
    } finally {
      setSyncingRatings(false)
    }
  }

  // Função para marcar como "Não está no Google"
  const handleNotOnGoogle = async () => {
    if (!businessId) return

    try {
      setLoading(true)

      const { error } = await supabase
        .from('businesses')
        .update({ google_place_id: 'not_on_google' })
        .eq('id', businessId)

      if (error) throw error

      setNotOnGoogle(true)
      setGoogleSearchResults([])
      toast.success('Marcado como "Não está no Google"')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    
    setFormData(prev => ({ ...prev, zip_code: cleanCep }))
    
    if (cleanCep.length === 8) {
      setLoadingCep(true)
      
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar CEP')
        }
        
        const data = await response.json()
        
        if (data.erro) {
          toast.error('CEP não encontrado')
          return
        }
        
        // Aguarda um pouco para garantir que o estado do CEP foi atualizado
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Atualiza os campos de endereço
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }))
        
        toast.success('Endereço encontrado!')
        
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
        toast.error('Erro ao buscar CEP')
      } finally {
        setLoadingCep(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !businessId) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: formData.name,
          category_sub: formData.category_sub || null,
          description: formData.description || null,
          email_business: formData.email_business || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          website: formData.website || null,
          instagram: formData.instagram || null,
          address: formData.address,
          address_number: formData.address_number || null,
          neighborhood: formData.neighborhood || null,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code || null,
          delivery: formData.delivery,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)

      if (error) throw error

      // Limpar dados salvos do localStorage após salvar com sucesso
      try {
        if (storageKey.current) {
          localStorage.removeItem(storageKey.current)
        }
      } catch (err) {
        console.error('Erro ao limpar dados salvos:', err)
      }

      toast.success('Empresa atualizada com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar empresa')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || partnerLoading || loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#C2227A] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !isPartner) {
    return null
  }

  return (
    <>
      {/* ========== VERSÃO MOBILE (< md) ========== */}
      <div className="md:hidden min-h-screen bg-gray-50">
        <div className="bg-white shadow sticky top-0 z-10">
          <div className="px-4 py-3">
            <Link href="/dashboard" className="text-xs text-gray-500 mb-2 inline-block">← Dashboard</Link>
            <h1 className="text-lg font-bold">Editar Empresa</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold mb-3">Informações Básicas</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria *</label>
                <select 
                  value={formData.category_sub} 
                  onChange={(e) => setFormData(prev => ({ ...prev, category_sub: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                  rows={3} 
                  placeholder="Sobre sua empresa..." 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>

              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.delivery} 
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery: e.target.checked }))} 
                  className="rounded" 
                />
                <span className="text-sm">Oferece delivery</span>
              </label>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />Contato
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email_business} 
                  onChange={(e) => setFormData(prev => ({ ...prev, email_business: e.target.value }))} 
                  placeholder="contato@empresa.com" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
                  placeholder="(11) 5555-1234" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <input 
                  type="tel" 
                  value={formData.whatsapp} 
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))} 
                  placeholder="11955551234" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
                <p className="text-xs text-gray-500 mt-1">Só números</p>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold mb-3">Redes Sociais</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Instagram className="w-4 h-4" />Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="@suaempresa"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Globe className="w-4 h-4" />Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://seusite.com"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]"
                />
              </div>
            </div>
          </div>

          {/* Avaliações Google */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />Avaliações Google
            </h2>

            {googlePlaceId && googlePlaceId !== 'not_on_google' ? (
              // Já vinculado - mostrar informações
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-800 mb-1">✓ Vinculado ao Google</p>
                  {googlePlaceData && (
                    <>
                      <p className="text-xs text-gray-600 mb-2">{googlePlaceData.name}</p>
                      {googlePlaceData.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={14} fill="#FBBF24" className="text-yellow-400" />
                          <span className="text-sm font-bold">{googlePlaceData.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">
                            ({googlePlaceData.user_ratings_total || 0} avaliações)
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSyncRatings()}
                  disabled={syncingRatings}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {syncingRatings ? 'Sincronizando...' : 'Sincronizar Avaliações'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Uma vez vinculado, o score sempre ficará visível. Apenas administradores podem alterar o vínculo.
                </p>
              </div>
            ) : notOnGoogle ? (
              // Marcado como "não está no Google"
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">Empresa não está no Google</p>
              </div>
            ) : (
              // Não vinculado - mostrar busca
              <div className="space-y-3">
                <p className="text-xs text-gray-600">
                  Vincule sua empresa ao Google para exibir avaliações e aumentar a credibilidade.
                </p>

                <div>
                  <label className="block text-sm font-medium mb-1">Buscar no Google</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={googleSearchQuery}
                      onChange={(e) => setGoogleSearchQuery(e.target.value)}
                      placeholder="Nome da empresa"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGoogleSearch())}
                    />
                    <button
                      type="button"
                      onClick={handleGoogleSearch}
                      disabled={loadingGoogleSearch}
                      className="px-4 py-2 bg-[#C2227A] text-white rounded-lg text-sm disabled:opacity-50"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {loadingGoogleSearch && (
                  <p className="text-xs text-blue-600">Buscando...</p>
                )}

                {googleSearchResults.length > 0 && (
                  <div className="space-y-2">
                    {googleSearchResults.map((result) => (
                      <div key={result.place_id} className="border rounded-lg p-3">
                        <p className="text-sm font-semibold">{result.name}</p>
                        <p className="text-xs text-gray-600 mb-2">{result.formatted_address}</p>
                        {result.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            <Star size={12} fill="#FBBF24" className="text-yellow-400" />
                            <span className="text-xs font-bold">{result.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">
                              ({result.user_ratings_total || 0})
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleLinkGooglePlace(result.place_id, result)}
                          className="w-full px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium"
                        >
                          Vincular
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNotOnGoogle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600"
                >
                  Minha empresa não está no Google
                </button>
              </div>
            )}
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />Endereço
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">CEP *</label>
                <input 
                  type="text" 
                  value={formData.zip_code} 
                  onChange={(e) => handleCepChange(e.target.value)} 
                  placeholder="00000-000" 
                  maxLength={8}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]"
                  disabled={loadingCep}
                  required
                />
                {loadingCep && <p className="text-xs text-blue-600 mt-1">Buscando endereço...</p>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Rua *</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nº *</label>
                  <input 
                    type="text" 
                    value={formData.address_number} 
                    onChange={(e) => setFormData(prev => ({ ...prev, address_number: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bairro *</label>
                <input 
                  type="text" 
                  value={formData.neighborhood} 
                  onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))} 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Cidade *</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">UF *</label>
                  <input 
                    type="text" 
                    value={formData.state} 
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} 
                    placeholder="SP" 
                    maxLength={2} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A] uppercase" 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões Mobile */}
          <div className="flex flex-col gap-3 pb-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full px-6 py-3 bg-[#C2227A] text-white rounded-lg font-medium disabled:opacity-50 active:bg-[#A01860]"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="w-full px-6 py-3 border border-gray-300 rounded-lg font-medium active:bg-gray-50" 
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* ========== VERSÃO DESKTOP (≥ md) ========== */}
      <div className="hidden md:block min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Editar Dados da Empresa</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Informações Básicas</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Empresa *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoria *</label>
                  <select 
                    value={formData.category_sub} 
                    onChange={(e) => setFormData(prev => ({ ...prev, category_sub: e.target.value }))} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Escolha a categoria que melhor representa seu negócio</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                    rows={4} 
                    placeholder="Conte sobre sua empresa, diferenciais, especialidades..." 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.delivery} 
                      onChange={(e) => setFormData(prev => ({ ...prev, delivery: e.target.checked }))} 
                      className="rounded" 
                    />
                    <span className="text-sm font-medium">Oferece delivery</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Comercial</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={formData.email_business} 
                      onChange={(e) => setFormData(prev => ({ ...prev, email_business: e.target.value }))} 
                      placeholder="contato@empresa.com" 
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
                    placeholder="(11) 5555-1234" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">WhatsApp</label>
                  <input 
                    type="tel" 
                    value={formData.whatsapp} 
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))} 
                    placeholder="11955551234" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Apenas números, sem espaços ou caracteres</p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Redes Sociais e Web</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Instagram className="w-4 h-4" />Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="@suaempresa"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4" />Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://seusite.com"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                  />
                </div>
              </div>
            </div>

            {/* Avaliações Google */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />Avaliações Google
              </h2>

              {googlePlaceId && googlePlaceId !== 'not_on_google' ? (
                // Já vinculado - mostrar informações
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-800 mb-2">✓ Empresa vinculada ao Google</p>
                    {googlePlaceData && (
                      <>
                        <p className="text-sm text-gray-700 mb-3">{googlePlaceData.name}</p>
                        {googlePlaceData.rating && (
                          <div className="flex items-center gap-2">
                            <Star size={18} fill="#FBBF24" className="text-yellow-400" />
                            <span className="text-lg font-bold">{googlePlaceData.rating.toFixed(1)}</span>
                            <span className="text-sm text-gray-600">
                              ({googlePlaceData.user_ratings_total || 0} avaliações)
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSyncRatings()}
                    disabled={syncingRatings}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                  >
                    {syncingRatings ? 'Sincronizando...' : 'Sincronizar Avaliações'}
                  </button>

                  <p className="text-sm text-gray-500">
                    Uma vez vinculado, o score sempre ficará visível nos cards da sua empresa. Apenas administradores podem alterar o vínculo.
                  </p>
                </div>
              ) : notOnGoogle ? (
                // Marcado como "não está no Google"
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Sua empresa não está no Google</p>
                </div>
              ) : (
                // Não vinculado - mostrar busca
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Vincule sua empresa ao Google para exibir avaliações e aumentar a credibilidade com seus clientes.
                  </p>

                  <div>
                    <label className="block text-sm font-medium mb-2">Buscar no Google Places</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={googleSearchQuery}
                        onChange={(e) => setGoogleSearchQuery(e.target.value)}
                        placeholder="Digite o nome da sua empresa"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGoogleSearch())}
                      />
                      <button
                        type="button"
                        onClick={handleGoogleSearch}
                        disabled={loadingGoogleSearch}
                        className="px-6 py-2 bg-[#C2227A] text-white rounded-lg font-medium hover:bg-[#A01860] disabled:opacity-50 flex items-center gap-2"
                      >
                        <Search className="w-5 h-5" />
                        Buscar
                      </button>
                    </div>
                  </div>

                  {loadingGoogleSearch && (
                    <p className="text-sm text-blue-600">Buscando no Google...</p>
                  )}

                  {googleSearchResults.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Resultados encontrados:</p>
                      {googleSearchResults.map((result) => (
                        <div key={result.place_id} className="border rounded-lg p-4 hover:border-[#C2227A] transition-colors">
                          <p className="font-semibold mb-1">{result.name}</p>
                          <p className="text-sm text-gray-600 mb-3">{result.formatted_address}</p>
                          {result.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <Star size={16} fill="#FBBF24" className="text-yellow-400" />
                              <span className="text-sm font-bold">{result.rating.toFixed(1)}</span>
                              <span className="text-sm text-gray-500">
                                ({result.user_ratings_total || 0} avaliações)
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleLinkGooglePlace(result.place_id, result)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                          >
                            Vincular esta empresa
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <button
                      type="button"
                      onClick={handleNotOnGoogle}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Minha empresa não está no Google
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />Endereço
              </h2>
              <div className="space-y-4">
                <div className="max-w-xs">
                  <label className="block text-sm font-medium mb-1">CEP *</label>
                  <input 
                    type="text" 
                    value={formData.zip_code} 
                    onChange={(e) => handleCepChange(e.target.value)} 
                    placeholder="00000-000" 
                    maxLength={8}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                    disabled={loadingCep}
                    required
                  />
                  {loadingCep && <p className="text-xs text-blue-600 mt-1">Buscando endereço...</p>}
                  <p className="text-xs text-gray-500 mt-1">Digite o CEP para preencher automaticamente</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Rua/Avenida *</label>
                    <input 
                      type="text" 
                      value={formData.address} 
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número *</label>
                    <input 
                      type="text" 
                      value={formData.address_number} 
                      onChange={(e) => setFormData(prev => ({ ...prev, address_number: e.target.value }))} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bairro *</label>
                  <input 
                    type="text" 
                    value={formData.neighborhood} 
                    onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Cidade *</label>
                    <input 
                      type="text" 
                      value={formData.city} 
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado *</label>
                    <input 
                      type="text" 
                      value={formData.state} 
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} 
                      placeholder="SP" 
                      maxLength={2} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A] uppercase" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões Desktop */}
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => router.back()} 
                className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50" 
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}