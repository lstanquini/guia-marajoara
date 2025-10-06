'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Upload, X, Play, Save, Image as ImageIcon, Video as VideoIcon } from 'lucide-react'

interface MariSettings {
  id: string
  photo_url: string
  video_url: string | null
  video_thumbnail_url: string | null
  followers_count: number
  partners_count: number
  active_since: number
  followers_label: string
  partners_label: string
  active_since_label: string
  description: string
  updated_at: string
}

interface FormData {
  photo_url: string | null
  video_url: string | null
  video_thumbnail_url: string | null
  followers_count: number
  partners_count: number
  active_since: number
  followers_label: string
  partners_label: string
  active_since_label: string
  description: string
}

export default function AdminMariPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [settings, setSettings] = useState<MariSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    photo_url: null,
    video_url: null,
    video_thumbnail_url: null,
    followers_count: 20000,
    partners_count: 200,
    active_since: 2016,
    followers_label: 'Seguidores',
    partners_label: 'Parceiros',
    active_since_label: 'Desde',
    description: ''
  })

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || adminLoading) return
    if (!user || !isAdmin) {
      router.push('/login')
    }
  }, [user, isAdmin, authLoading, adminLoading, router])

  useEffect(() => {
    if (!isAdmin) return
    loadSettings()
  }, [isAdmin])

  async function loadSettings() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('mari_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setSettings(data)
        setFormData({
          photo_url: data.photo_url,
          video_url: data.video_url,
          video_thumbnail_url: data.video_thumbnail_url,
          followers_count: data.followers_count,
          partners_count: data.partners_count,
          active_since: data.active_since,
          followers_label: data.followers_label || 'Seguidores',
          partners_label: data.partners_label || 'Parceiros',
          active_since_label: data.active_since_label || 'Desde',
          description: data.description
        })
        setPreviewPhoto(data.photo_url)
        setPreviewVideo(data.video_url)
        setPreviewThumbnail(data.video_thumbnail_url)
      }
    } catch (error) {
      console.error('Erro ao carregar:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    setUploadingPhoto(true)
    try {
      const fileName = `mari-photo-${Date.now()}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage
        .from('mari-photos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('mari-photos')
        .getPublicUrl(data.path)

      setFormData({ ...formData, photo_url: publicUrl })
      setPreviewPhoto(publicUrl)
      alert('Foto carregada com sucesso!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao fazer upload da foto')
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione um vídeo')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('O vídeo deve ter no máximo 50MB')
      return
    }

    setUploadingVideo(true)
    try {
      const fileName = `mari-video-${Date.now()}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage
        .from('mari-videos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('mari-videos')
        .getPublicUrl(data.path)

      setFormData({ ...formData, video_url: publicUrl })
      setPreviewVideo(publicUrl)
      alert('Vídeo carregado! Agora adicione uma capa/thumbnail.')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao fazer upload do vídeo')
    } finally {
      setUploadingVideo(false)
    }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A capa deve ter no máximo 5MB')
      return
    }

    setUploadingThumbnail(true)
    try {
      const fileName = `mari-thumb-${Date.now()}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage
        .from('mari-photos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('mari-photos')
        .getPublicUrl(data.path)

      setFormData({ ...formData, video_thumbnail_url: publicUrl })
      setPreviewThumbnail(publicUrl)
      alert('Capa do vídeo carregada!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao fazer upload da capa')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  function removeVideo() {
    setFormData({ ...formData, video_url: null, video_thumbnail_url: null })
    setPreviewVideo(null)
    setPreviewThumbnail(null)
  }

  async function handleSave() {
    if (!formData.photo_url) {
      alert('Adicione uma foto antes de salvar')
      return
    }

    if (formData.video_url && !formData.video_thumbnail_url) {
      alert('Se você adicionou um vídeo, precisa adicionar uma capa/thumbnail também')
      return
    }

    setSaving(true)
    try {
      const dataToSave = {
        photo_url: formData.photo_url,
        video_url: formData.video_url,
        video_thumbnail_url: formData.video_thumbnail_url,
        followers_count: formData.followers_count,
        partners_count: formData.partners_count,
        active_since: formData.active_since,
        followers_label: formData.followers_label,
        partners_label: formData.partners_label,
        active_since_label: formData.active_since_label,
        description: formData.description,
        updated_at: new Date().toISOString(),
        updated_by: user?.id
      }

      if (settings) {
        const { error } = await supabase
          .from('mari_settings')
          .update(dataToSave)
          .eq('id', settings.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('mari_settings')
          .insert(dataToSave)
        if (error) throw error
      }

      alert('Configurações salvas com sucesso!')
      await loadSettings()
    } catch (error: any) {
      console.error('Erro:', error)
      alert(`Erro: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user || !isAdmin) return null

  const displayImage = previewVideo && previewThumbnail ? previewThumbnail : previewPhoto

  return (
    <>
      {/* Header Mobile - Sticky */}
      <div className="sticky top-0 z-10 bg-white shadow md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Seção Mari</h1>
              <p className="text-xs text-gray-500">Configurar homepage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:block bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seção Mari Carreira</h1>
              <p className="text-gray-500 mt-1">Gerenciar informações da Mari na homepage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-[#C2227A] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4 text-sm">Carregando configurações...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              
              {/* Preview */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6 order-2 lg:order-1">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 md:p-6">
                  {/* iPhone Mockup */}
                  <div className="relative w-full max-w-[240px] md:max-w-[280px] mx-auto mb-4 md:mb-6">
                    <div className="relative">
                      <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[40px] md:rounded-[48px] p-2 md:p-3 shadow-2xl">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 md:w-32 h-6 md:h-7 bg-black rounded-b-3xl z-10">
                          <div className="flex items-center justify-center h-full gap-2">
                            <div className="w-12 md:w-14 h-1.5 bg-gray-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Tela */}
                        <div className="relative aspect-[9/19.5] bg-white rounded-[32px] md:rounded-[36px] overflow-hidden">
                          {displayImage ? (
                            <>
                              <img 
                                src={displayImage} 
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              {previewVideo && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 md:p-4 shadow-xl">
                                    <Play className="w-8 h-8 md:w-10 md:h-10 text-[#C2227A] fill-[#C2227A]" />
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#C2227A]/10 to-[#C2227A]/20">
                              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#C2227A] to-pink-700 text-3xl md:text-4xl font-light text-white">
                                MC
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#C2227A]/20 to-transparent pointer-events-none"></div>
                        </div>
                        
                        {/* Botões */}
                        <div className="absolute right-0 top-20 md:top-24 w-1 h-12 md:h-16 bg-gray-800 rounded-l"></div>
                        <div className="absolute left-0 top-16 md:top-20 w-1 h-6 md:h-8 bg-gray-800 rounded-r"></div>
                        <div className="absolute left-0 top-24 md:top-32 w-1 h-6 md:h-8 bg-gray-800 rounded-r"></div>
                      </div>
                    </div>
                  </div>

                  {/* Cards Preview */}
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-3 md:mb-4">
                    <div className="bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-lg text-center border border-pink-100">
                      <div className="text-base md:text-xl font-bold text-[#C2227A]">+{formData.followers_count.toLocaleString('pt-BR')}</div>
                      <p className="text-[8px] md:text-[10px] font-bold uppercase text-gray-600 mt-1">{formData.followers_label}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-lg text-center border border-pink-100">
                      <div className="text-base md:text-xl font-bold text-[#C2227A]">{formData.partners_count}</div>
                      <p className="text-[8px] md:text-[10px] font-bold uppercase text-gray-600 mt-1">{formData.partners_label}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-lg text-center border border-pink-100">
                      <div className="text-base md:text-xl font-bold text-[#C2227A]">{formData.active_since}</div>
                      <p className="text-[8px] md:text-[10px] font-bold uppercase text-gray-600 mt-1">{formData.active_since_label}</p>
                    </div>
                  </div>

                  {/* Descrição Preview */}
                  {formData.description && (
                    <div className="bg-white/80 backdrop-blur-sm p-2.5 md:p-3 rounded-lg border border-pink-100">
                      <p className="text-xs text-gray-700 line-clamp-3">{formData.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Formulário */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6 order-1 lg:order-2">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Configurações</h2>
                
                <div className="space-y-4 md:space-y-6">
                  
                  {/* Upload Foto */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Foto Principal *
                    </label>
                    <label className="cursor-pointer block">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 hover:border-[#C2227A] transition-colors text-center">
                        {uploadingPhoto ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-[#C2227A] border-t-transparent rounded-full"></span>
                            <span className="text-xs md:text-sm text-gray-600">Enviando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-600">
                            <ImageIcon size={18} className="md:w-5 md:h-5" />
                            {previewPhoto ? 'Alterar Foto' : 'Selecionar Foto'}
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP. Máx: 5MB</p>
                  </div>

                  {/* Upload Vídeo */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Vídeo (opcional)
                    </label>
                    {previewVideo ? (
                      <div className="border border-gray-300 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs md:text-sm text-green-600 font-medium flex items-center gap-2">
                            <VideoIcon size={14} className="md:w-4 md:h-4" />
                            Vídeo carregado
                          </span>
                          <button 
                            onClick={removeVideo}
                            className="text-red-600 hover:text-red-700 text-xs md:text-sm flex items-center gap-1"
                          >
                            <X size={14} className="md:w-4 md:h-4" />
                            Remover
                          </button>
                        </div>
                        {!previewThumbnail && (
                          <div className="mt-3">
                            <label className="cursor-pointer">
                              <div className="border-2 border-dashed border-orange-300 rounded-lg p-2.5 md:p-3 hover:border-orange-500 transition-colors text-center bg-orange-50">
                                {uploadingThumbnail ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full"></span>
                                    <span className="text-xs text-orange-600">Enviando...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                                    <Upload size={14} />
                                    Adicionar Capa *
                                  </div>
                                )}
                              </div>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleThumbnailUpload}
                                disabled={uploadingThumbnail}
                                className="hidden"
                              />
                            </label>
                            <p className="text-xs text-orange-600 mt-1">⚠️ Capa obrigatória</p>
                          </div>
                        )}
                        {previewThumbnail && <p className="text-xs text-green-600 mt-2">✓ Capa carregada</p>}
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 hover:border-[#C2227A] transition-colors text-center">
                          {uploadingVideo ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-[#C2227A] border-t-transparent rounded-full"></span>
                              <span className="text-xs md:text-sm text-gray-600">Enviando...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-600">
                              <VideoIcon size={18} className="md:w-5 md:h-5" />
                              Selecionar Vídeo
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="video/*" 
                          onChange={handleVideoUpload}
                          disabled={uploadingVideo}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-xs text-gray-500 mt-1">MP4 ou WEBM. Máx: 50MB</p>
                  </div>

                  {/* Números */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Seguidores
                      </label>
                      <input 
                        type="number" 
                        value={formData.followers_count}
                        onChange={(e) => setFormData({ ...formData, followers_count: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Parceiros
                      </label>
                      <input 
                        type="number" 
                        value={formData.partners_count}
                        onChange={(e) => setFormData({ ...formData, partners_count: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Ano
                      </label>
                      <input 
                        type="number" 
                        value={formData.active_since}
                        onChange={(e) => setFormData({ ...formData, active_since: parseInt(e.target.value) || 2016 })}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                      />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="border-t pt-3 md:pt-4">
                    <h3 className="text-xs md:text-sm font-medium text-gray-900 mb-2 md:mb-3">Textos dos Cards</h3>
                    <div className="space-y-2 md:space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Label 1</label>
                        <input 
                          type="text" 
                          value={formData.followers_label}
                          onChange={(e) => setFormData({ ...formData, followers_label: e.target.value })}
                          placeholder="Ex: Seguidores"
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Label 2</label>
                        <input 
                          type="text" 
                          value={formData.partners_label}
                          onChange={(e) => setFormData({ ...formData, partners_label: e.target.value })}
                          placeholder="Ex: Parceiros"
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Label 3</label>
                        <input 
                          type="text" 
                          value={formData.active_since_label}
                          onChange={(e) => setFormData({ ...formData, active_since_label: e.target.value })}
                          placeholder="Ex: Desde"
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea 
                      rows={4} 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xs md:text-sm"
                      placeholder="Descreva quem é a Mari..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length} caracteres</p>
                  </div>

                  {/* Botão Salvar */}
                  <button 
                    onClick={handleSave}
                    disabled={saving || uploadingPhoto || uploadingVideo || uploadingThumbnail}
                    className="w-full flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 font-semibold text-sm md:text-base"
                  >
                    {saving ? (
                      <>
                        <span className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="md:w-5 md:h-5" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {settings && (
            <div className="mt-4 text-center text-xs md:text-sm text-gray-500">
              Última atualização: {new Date(settings.updated_at).toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </>
  )
}