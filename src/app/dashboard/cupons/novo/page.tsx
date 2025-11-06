'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'lucide-react'

const STORAGE_KEY = 'novo-cupom-draft'

export default function NovoCupomPage() {
  const { partner } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  const hasLoadedFromStorage = useRef(false)

  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_text: '',
    starts_at: new Date().toISOString().split('T')[0],
    expires_at: '',
    validity_text: '',
    is_unlimited: true,
    max_redemptions: 0
  })

  // Carregar dados salvos do localStorage ao montar
  useEffect(() => {
    if (hasLoadedFromStorage.current) return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedData = JSON.parse(saved)
        setFormData(parsedData)
        console.log('Dados restaurados do localStorage')
      }
    } catch (err) {
      console.error('Erro ao carregar dados salvos:', err)
    }

    hasLoadedFromStorage.current = true
  }, [])

  // Salvar dados no localStorage sempre que formData mudar
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch (err) {
      console.error('Erro ao salvar dados:', err)
    }
  }, [formData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande', 'Máximo 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', 'Deve ser uma imagem')
      return
    }

    setImageFile(file)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!partner || !imageFile) {
      toast.error('Imagem é obrigatória')
      return
    }

    setLoading(true)

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${partner.businessId}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('coupons')
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('coupons')
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl

      const { error: insertError } = await supabase
        .from('coupons')
        .insert({
          business_id: partner.businessId,
          title: formData.title,
          description: formData.description,
          discount_text: formData.discount_text || null,
          validity_text: formData.validity_text || null,
          image_url: publicUrl,
          starts_at: formData.starts_at,
          expires_at: formData.expires_at,
          is_unlimited: formData.is_unlimited,
          max_redemptions: formData.is_unlimited ? null : formData.max_redemptions,
          status: 'inactive'
        })

      if (insertError) throw insertError

      // Limpar dados salvos após sucesso
      localStorage.removeItem(STORAGE_KEY)

      toast.success('Cupom criado como rascunho', 'Ative-o na listagem quando estiver pronto')
      router.push('/dashboard/cupons')
    } catch (error: any) {
      console.error('Erro ao criar cupom:', error)
      toast.error('Erro ao criar cupom', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!partner) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <>
      {/* Header Mobile - Sticky */}
      <div className="sticky top-0 z-10 bg-white shadow md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Criar Novo Cupom</h1>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:block bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard/cupons" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Voltar aos Cupons
          </Link>
          <h1 className="text-2xl font-bold">Criar Novo Cupom</h1>
        </div>
      </div>

      {/* Formulário */}
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4 md:space-y-6">
            
            {/* Upload de Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem do Cupom * 
                <span className="text-xs text-gray-500 ml-1">(Tamanho recomendado: 1080x1080px)</span>
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full md:max-w-md rounded-lg" 
                  />
                  <button 
                    type="button" 
                    onClick={() => { setImagePreview(null); setImageFile(null); }} 
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 text-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                    id="image-upload" 
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-sm text-gray-600">Clique para fazer upload da imagem</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
                  </label>
                </div>
              )}
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Cupom *
              </label>
              <input 
                type="text" 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="Ex: 20% OFF em Pizzas" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Detalhes do cupom, condições de uso, etc." 
                rows={3} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
              />
            </div>

            {/* Texto do Desconto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto do Desconto
              </label>
              <input 
                type="text" 
                value={formData.discount_text} 
                onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })} 
                placeholder="Ex: 20% OFF" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
              />
            </div>

            {/* Datas - Mobile: Empilhadas | Desktop: Lado a Lado */}
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input 
                  type="date" 
                  required 
                  value={formData.starts_at} 
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Expiração *
                </label>
                <input 
                  type="date" 
                  required 
                  value={formData.expires_at} 
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} 
                  min={formData.starts_at || new Date().toISOString().split('T')[0]} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
                />
              </div>
            </div>

            {/* Limite de Resgates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limite de Resgates
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={formData.is_unlimited} 
                    onChange={() => setFormData({ ...formData, is_unlimited: true })} 
                    className="mr-2" 
                  />
                  <span className="text-sm md:text-base">Ilimitado (sem limite de resgates)</span>
                </label>
                
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    checked={!formData.is_unlimited} 
                    onChange={() => setFormData({ ...formData, is_unlimited: false })} 
                    className="mr-2" 
                  />
                  <span className="text-sm md:text-base">Limitar número de resgates</span>
                </label>
                
                {!formData.is_unlimited && (
                  <input 
                    type="number" 
                    min="1" 
                    required={!formData.is_unlimited} 
                    value={formData.max_redemptions} 
                    onChange={(e) => setFormData({ ...formData, max_redemptions: parseInt(e.target.value) })} 
                    placeholder="Quantidade máxima de resgates" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A] mt-2" 
                  />
                )}
              </div>
            </div>

            {/* Texto de Validade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto de Validade (opcional)
              </label>
              <input 
                type="text" 
                value={formData.validity_text} 
                onChange={(e) => setFormData({ ...formData, validity_text: e.target.value })} 
                placeholder="Ex: Válido de segunda a sexta" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
              />
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
                disabled={loading || !imageFile} 
                className="w-full px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Criando...' : 'Criar Cupom'}
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
                disabled={loading || !imageFile} 
                className="flex-1 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Criando...' : 'Criar Cupom'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}