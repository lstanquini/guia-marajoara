'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditarCupomPage({ params }: PageProps) {
  const { partner } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  
  const [couponId, setCouponId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_text: '',
    starts_at: '',
    expires_at: '',
    status: 'active'
  })

  useEffect(() => {
    params.then(p => setCouponId(p.id))
  }, [params])

  useEffect(() => {
    if (!couponId || !partner) return

    async function loadCoupon() {
      const { data } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .eq('business_id', partner?.businessId)
        .single()

      if (data) {
        setFormData({
          title: data.title,
          description: data.description || '',
          discount_text: data.discount_text || '',
          starts_at: data.starts_at.split('T')[0],
          expires_at: data.expires_at.split('T')[0],
          status: data.status
        })
        setImagePreview(data.image_url)
      }
    }

    loadCoupon()
  }, [couponId, partner, supabase])

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
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponId || !partner) return
    
    setLoading(true)

    try {
      let finalImageUrl = imagePreview

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${partner.businessId}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('coupons')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('coupons')
          .getPublicUrl(fileName)
        
        finalImageUrl = publicUrl
      }

      const { error } = await supabase
        .from('coupons')
        .update({
          title: formData.title,
          description: formData.description,
          discount_text: formData.discount_text || null,
          image_url: finalImageUrl,
          starts_at: new Date(formData.starts_at).toISOString(),
          expires_at: new Date(formData.expires_at).toISOString(),
          status: formData.status
        })
        .eq('id', couponId)

      if (error) throw error

      toast.success('Cupom atualizado com sucesso!')
      router.push('/dashboard/cupons')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar cupom')
    } finally {
      setLoading(false)
    }
  }

  if (!partner || !couponId) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
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
            <h1 className="text-lg font-bold">Editar Cupom</h1>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:block bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard/cupons" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Voltar aos Cupons
          </Link>
          <h1 className="text-2xl font-bold">Editar Cupom</h1>
        </div>
      </div>

      {/* Formulário */}
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4 md:space-y-6">
            
            {/* Imagem Atual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem do Cupom
              </label>
              
              {imagePreview && (
                <div className="relative mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full md:max-w-md rounded-lg" 
                  />
                  <button 
                    type="button" 
                    onClick={() => { 
                      setImageFile(null); 
                      setImagePreview(''); 
                    }} 
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {/* Upload Nova Imagem */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  id="image-upload" 
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm text-gray-600">
                    {imagePreview ? 'Clique para trocar a imagem' : 'Clique para fazer upload'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
                </label>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
                required 
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
                rows={4} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
              />
            </div>

            {/* Texto do Desconto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desconto
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
                  value={formData.starts_at} 
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Expiração *
                </label>
                <input 
                  type="date" 
                  value={formData.expires_at} 
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} 
                  min={formData.starts_at} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]" 
                  required 
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2227A]"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}