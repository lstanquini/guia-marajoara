'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Play } from 'lucide-react'

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
}

export function MariCarreiraSection() {
  const [settings, setSettings] = useState<MariSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('mari_settings')
          .select('*')
          .single()

        if (error) throw error
        setSettings(data)
      } catch (error) {
        console.error('Erro ao carregar configurações da Mari:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [supabase])

  const handlePlayVideo = () => {
    if (settings?.video_url) {
      setIsVideoPlaying(true)
    }
  }

  if (isLoading) {
    return (
      <section className="w-full overflow-hidden relative bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 md:py-16">
        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin h-12 w-12 border-4 border-[#C2227A] border-t-transparent rounded-full"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!settings) {
    return null
  }

  return (
    <section 
      className="w-full overflow-hidden relative bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 md:py-16"
      aria-labelledby="mari-title"
    >
      {/* Decorações de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          
          {/* COLUNA ESQUERDA - Conteúdo */}
          <div className="flex flex-col gap-6 order-2 md:order-1">
            {/* Título */}
            <div>
              <h2 
                id="mari-title" 
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#C2227A] to-pink-600"
              >
                MARI CARREIRA
              </h2>
              <p className="mt-2 text-lg md:text-xl font-bold text-gray-600">
                @JARDIMMARAJOARASP
              </p>
            </div>
            
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-white/80 backdrop-blur-sm p-4 text-center hover:scale-105 transition-transform border border-pink-100">
                <div className="text-2xl md:text-3xl font-black text-[#C2227A]">
                  +<AnimatedCounter value={settings.followers_count} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-1">
                  {settings.followers_label}
                </p>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm p-4 text-center hover:scale-105 transition-transform border border-pink-100">
                <div className="text-2xl md:text-3xl font-black text-[#C2227A]">
                  <AnimatedCounter value={settings.partners_count} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-1">
                  {settings.partners_label}
                </p>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm p-4 text-center hover:scale-105 transition-transform border border-pink-100">
                <div className="text-2xl md:text-3xl font-black text-[#C2227A]">
                  <AnimatedCounter value={settings.active_since} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-1">
                  {settings.active_since_label}
                </p>
              </Card>
            </div>
            
            {/* Descrição */}
            <div className="space-y-4">
              <p className="text-base md:text-lg leading-relaxed text-gray-700">
                {settings.description}
              </p>
            </div>
            
            {/* Botão CTA */}
            <div>
              <Button 
                size="lg" 
                variant="primary"
                className="inline-flex items-center gap-2"
                onClick={() => window.open('https://instagram.com/jardimmarajoarasp', '_blank')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Siga no Instagram
              </Button>
            </div>
          </div>
          
          {/* COLUNA DIREITA - iPhone */}
          <div className="flex items-center justify-center order-1 md:order-2">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] mx-auto">
              {/* iPhone com animação de flutuação */}
              <div className="relative animate-[float_3s_ease-in-out_infinite]">
                {/* Corpo do iPhone */}
                <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[48px] p-3 shadow-2xl">
                  {/* Notch (entalhe superior) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-10">
                    <div className="flex items-center justify-center h-full gap-2">
                      <div className="w-14 h-1.5 bg-gray-800 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Tela do iPhone */}
                  <div className="relative aspect-[9/19.5] bg-white rounded-[36px] overflow-hidden">
                    {/* Conteúdo: Foto OU Vídeo */}
                    {isVideoPlaying && settings.video_url ? (
                      <video
                        src={settings.video_url}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                        onEnded={() => setIsVideoPlaying(false)}
                      />
                    ) : (
                      <>
                        <img 
                          src={settings.video_url && settings.video_thumbnail_url 
                            ? settings.video_thumbnail_url 
                            : settings.photo_url
                          } 
                          alt="Mari Carreira"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Botão Play - só aparece se tiver vídeo */}
                        {settings.video_url && (
                          <button
                            onClick={handlePlayVideo}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
                            aria-label="Reproduzir vídeo"
                          >
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-xl group-hover:scale-110 transition-transform">
                              <Play className="w-12 h-12 text-[#C2227A] fill-[#C2227A]" />
                            </div>
                          </button>
                        )}
                      </>
                    )}
                    
                    {/* Overlay com gradiente (só quando não estiver tocando vídeo) */}
                    {!isVideoPlaying && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#C2227A]/20 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                  
                  {/* Botão lateral (power) */}
                  <div className="absolute right-0 top-24 w-1 h-16 bg-gray-800 rounded-l"></div>
                  
                  {/* Botões de volume */}
                  <div className="absolute left-0 top-20 w-1 h-8 bg-gray-800 rounded-r"></div>
                  <div className="absolute left-0 top-32 w-1 h-8 bg-gray-800 rounded-r"></div>
                </div>
                
                {/* Brilho e reflexo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-[48px] pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS para animação de flutuação */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(2deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(2deg); 
          }
        }
      `}</style>
    </section>
  )
}