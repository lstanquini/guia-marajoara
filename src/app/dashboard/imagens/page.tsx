'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

export default function ImagensPage() {
  const { user, loading: authLoading } = useAuth()
  const { isPartner, loading: partnerLoading } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [bannerPreview, setBannerPreview] = useState<string>('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  useEffect(() => {
    if (authLoading || partnerLoading) return
    
    if (!user || !isPartner) {
      router.push('/login')
      return
    }

    async function loadBusiness() {
      const { data } = await supabase
        .from('businesses')
        .select('id, logo_url, banner_url')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setBusinessId(data.id)
        setLogoUrl(data.logo_url || '')
        setBannerUrl(data.banner_url || '')
        setLogoPreview(data.logo_url || '')
        setBannerPreview(data.banner_url || '')
      }
    }

    loadBusiness()
  }, [user, isPartner, router, supabase, authLoading, partnerLoading])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande', 'Máximo 2MB para logo')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', 'Deve ser uma imagem')
      return
    }

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande', 'Máximo 5MB para banner')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', 'Deve ser uma imagem')
      return
    }

    setBannerFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setBannerPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return

    setLoading(true)

    try {
      let newLogoUrl = logoUrl
      let newBannerUrl = bannerUrl

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `logos/${businessId}-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(fileName, logoFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(fileName)
        
        newLogoUrl = publicUrl
      }

      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop()
        const fileName = `banners/${businessId}-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(fileName, bannerFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(fileName)
        
        newBannerUrl = publicUrl
      }

      const { error } = await supabase
        .from('businesses')
        .update({
          logo_url: newLogoUrl || null,
          banner_url: newBannerUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)

      if (error) throw error

      toast.success('Imagens atualizadas com sucesso!')
      setLogoFile(null)
      setBannerFile(null)
    } catch (error: any) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar imagens', error.message)
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
          <h1 className="text-2xl font-bold">Logo e Banner</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-[#C2227A]" />
              <h2 className="text-lg font-bold">Logo da Empresa</h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Tamanho recomendado: 400x400px (quadrado). Máximo 2MB.</p>

            {logoPreview ? (
              <div className="relative inline-block">
                <img src={logoPreview} alt="Logo preview" className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200" />
                <button type="button" onClick={() => { setLogoPreview(''); setLogoFile(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 2MB</p>
                </label>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold">Banner da Empresa</h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Tamanho recomendado: 1200x400px (horizontal). Máximo 5MB.</p>

            {bannerPreview ? (
              <div className="relative">
                <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
                <button type="button" onClick={() => { setBannerPreview(''); setBannerFile(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" id="banner-upload" />
                <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => router.back()} className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading || (!logoFile && !bannerFile)} className="flex-1 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Salvando...' : 'Salvar Imagens'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}