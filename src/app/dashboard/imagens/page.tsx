'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { usePartner } from '@/hooks/usePartner'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Upload, Image as ImageIcon, X, Monitor, Smartphone } from 'lucide-react'

export default function ImagensPage() {
  const { user, loading: authLoading } = useAuth()
  const { isPartner, loading: partnerLoading } = usePartner()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  
  // URLs atuais no banco
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [bannerMobileUrl, setBannerMobileUrl] = useState<string>('')
  
  // Previews
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [bannerPreview, setBannerPreview] = useState<string>('')
  const [bannerMobilePreview, setBannerMobilePreview] = useState<string>('')
  
  // Arquivos selecionados
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerMobileFile, setBannerMobileFile] = useState<File | null>(null)

  useEffect(() => {
    if (authLoading || partnerLoading) return
    
    if (!user || !isPartner) {
      router.push('/login')
      return
    }

    async function loadBusiness() {
      const { data } = await supabase
        .from('businesses')
        .select('id, logo_url, banner_url, banner_mobile_url')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setBusinessId(data.id)
        setLogoUrl(data.logo_url || '')
        setBannerUrl(data.banner_url || '')
        setBannerMobileUrl(data.banner_mobile_url || '')
        setLogoPreview(data.logo_url || '')
        setBannerPreview(data.banner_url || '')
        setBannerMobilePreview(data.banner_mobile_url || '')
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

  const handleBannerMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande', 'Máximo 5MB para banner mobile')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', 'Deve ser uma imagem')
      return
    }

    setBannerMobileFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setBannerMobilePreview(reader.result as string)
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
      let newBannerMobileUrl = bannerMobileUrl

      // Upload do Logo
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

      // Upload do Banner Desktop
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

      // Upload do Banner Mobile
      if (bannerMobileFile) {
        const fileExt = bannerMobileFile.name.split('.').pop()
        const fileName = `banners-mobile/${businessId}-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(fileName, bannerMobileFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(fileName)
        
        newBannerMobileUrl = publicUrl
      }

      // Atualizar no banco
      const { error } = await supabase
        .from('businesses')
        .update({
          logo_url: newLogoUrl || null,
          banner_url: newBannerUrl || null,
          banner_mobile_url: newBannerMobileUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)

      if (error) throw error

      toast.success('Imagens atualizadas com sucesso!')
      setLogoFile(null)
      setBannerFile(null)
      setBannerMobileFile(null)
    } catch (error: any) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar imagens', error.message)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Link 
            href="/dashboard" 
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Logo e Banners</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie as imagens da sua empresa
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Logo */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-[#C2227A]" />
              <h2 className="text-base sm:text-lg font-bold">Logo da Empresa</h2>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Tamanho recomendado: 400x400px (quadrado). Máximo 2MB.
            </p>

            {logoPreview ? (
              <div className="relative inline-block">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg border-2 border-gray-200" 
                />
                <button 
                  type="button" 
                  onClick={() => { setLogoPreview(''); setLogoFile(null); }} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-[#C2227A] transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange} 
                  className="hidden" 
                  id="logo-upload" 
                />
                <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 2MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Banner Desktop */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold">Banner Desktop</h2>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Tamanho recomendado: 1920x600px (horizontal). Máximo 5MB.
            </p>

            {bannerPreview ? (
              <div className="relative">
                <img 
                  src={bannerPreview} 
                  alt="Banner preview" 
                  className="w-full h-32 sm:h-48 object-cover rounded-lg border-2 border-gray-200" 
                />
                <button 
                  type="button" 
                  onClick={() => { setBannerPreview(''); setBannerFile(null); }} 
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center hover:border-blue-600 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleBannerChange} 
                  className="hidden" 
                  id="banner-upload" 
                />
                <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Banner Mobile - NOVO */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-green-600" />
              <h2 className="text-base sm:text-lg font-bold">Banner Mobile</h2>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                Opcional
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Tamanho recomendado: 1080x1920px (vertical 9:16). Máximo 5MB.<br/>
              <span className="text-gray-500">Se não enviar, será usado o banner desktop no mobile.</span>
            </p>

            {bannerMobilePreview ? (
              <div className="relative inline-block">
                <img 
                  src={bannerMobilePreview} 
                  alt="Banner mobile preview" 
                  className="w-48 h-80 sm:w-56 sm:h-96 object-cover rounded-lg border-2 border-gray-200" 
                />
                <button 
                  type="button" 
                  onClick={() => { setBannerMobilePreview(''); setBannerMobileFile(null); }} 
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center hover:border-green-600 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleBannerMobileChange} 
                  className="hidden" 
                  id="banner-mobile-upload" 
                />
                <label htmlFor="banner-mobile-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB (vertical)</p>
                </label>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium" 
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || (!logoFile && !bannerFile && !bannerMobileFile)} 
              className="flex-1 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
            >
              {loading ? 'Salvando...' : 'Salvar Imagens'}
            </button>
          </div>

          {/* Dica */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Dica:</strong> Para melhores resultados no mobile, envie uma imagem vertical otimizada. 
              Imagens horizontais podem aparecer cortadas em telas de celular.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}