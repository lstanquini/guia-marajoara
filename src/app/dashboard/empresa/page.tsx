'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Phone, Globe, Instagram, MapPin, Mail } from 'lucide-react'

export default function EditarEmpresaPage() {
  const { user, loading: authLoading } = useAuth()
  const { isPartner, loading: partnerLoading } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)

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

  useEffect(() => {
    if (authLoading || partnerLoading) return

    if (!user || !isPartner) {
      router.push('/login')
      return
    }

    async function loadBusiness() {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user?.id)
        .single()

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
      }
    }

    loadBusiness()
  }, [user, isPartner, authLoading, partnerLoading, router, supabase])

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

      toast.success('Empresa atualizada com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar empresa')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || partnerLoading) {
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <input 
                  type="text" 
                  value={formData.category_sub} 
                  onChange={(e) => setFormData({ ...formData, category_sub: e.target.value })} 
                  placeholder="Pizza • Italiana" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={3} 
                  placeholder="Sobre sua empresa..." 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>

              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.delivery} 
                  onChange={(e) => setFormData({ ...formData, delivery: e.target.checked })} 
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
                  onChange={(e) => setFormData({ ...formData, email_business: e.target.value })} 
                  placeholder="contato@empresa.com" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  placeholder="(11) 5555-1234" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <input 
                  type="tel" 
                  value={formData.whatsapp} 
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} 
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
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} 
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
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
                  placeholder="https://seusite.com" 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />Endereço
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Rua *</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nº</label>
                  <input 
                    type="text" 
                    value={formData.address_number} 
                    onChange={(e) => setFormData({ ...formData, address_number: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Bairro</label>
                  <input 
                    type="text" 
                    value={formData.neighborhood} 
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CEP</label>
                  <input 
                    type="text" 
                    value={formData.zip_code} 
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })} 
                    placeholder="00000-000" 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Cidade *</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#C2227A]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">UF *</label>
                  <input 
                    type="text" 
                    value={formData.state} 
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoria / Subcategoria</label>
                  <input 
                    type="text" 
                    value={formData.category_sub} 
                    onChange={(e) => setFormData({ ...formData, category_sub: e.target.value })} 
                    placeholder="Ex: Pizza • Italiana" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Separe com " • " para melhor visualização</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
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
                      onChange={(e) => setFormData({ ...formData, delivery: e.target.checked })} 
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
                      onChange={(e) => setFormData({ ...formData, email_business: e.target.value })} 
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder="(11) 5555-1234" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">WhatsApp</label>
                  <input 
                    type="tel" 
                    value={formData.whatsapp} 
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} 
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
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} 
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
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
                    placeholder="https://seusite.com" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />Endereço
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Rua/Avenida *</label>
                    <input 
                      type="text" 
                      value={formData.address} 
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número</label>
                    <input 
                      type="text" 
                      value={formData.address_number} 
                      onChange={(e) => setFormData({ ...formData, address_number: e.target.value })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bairro</label>
                    <input 
                      type="text" 
                      value={formData.neighborhood} 
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CEP</label>
                    <input 
                      type="text" 
                      value={formData.zip_code} 
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })} 
                      placeholder="00000-000" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Cidade *</label>
                    <input 
                      type="text" 
                      value={formData.city} 
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C2227A]" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado *</label>
                    <input 
                      type="text" 
                      value={formData.state} 
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
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