'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Category {
  slug: string
  name: string
}

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('slug, name')
          .order('order_index')
          .limit(7)

        if (error) throw error
        setCategories(data || [])
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      }
    }

    loadCategories()
  }, [supabase])

  return (
    <footer className="mt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      
      {/* ========== VERSÃO MOBILE (< md) ========== */}
      <div className="md:hidden">
        <div className="container mx-auto px-6 py-10">
          
          {/* Logo e Redes Sociais */}
          <div className="text-center mb-8">
            <h4 className="text-xl font-black mb-4 bg-gradient-to-r from-[#C2227A] to-pink-500 bg-clip-text text-transparent">
              MarajoaraON
            </h4>
            
            {/* Redes Sociais */}
            <div className="flex justify-center gap-3">
              <a 
                href="https://instagram.com/jardimmarajoarasp" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram" 
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-gradient-to-r hover:from-[#C2227A] hover:to-pink-500 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@jardimmarajoarasp" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok" 
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-gradient-to-r hover:from-[#C2227A] hover:to-pink-500 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Grid 2 colunas - Links e Categorias */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            
            {/* Coluna 1 - Links */}
            <div>
              <h5 className="font-bold text-white/90 mb-3 text-xs uppercase tracking-wider">
                Links
              </h5>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/login" className="text-white/70 hover:text-[#8BC34A] transition-colors active:text-[#8BC34A]/80 block">
                    Área Parceiro
                  </Link>
                </li>
                <li>
                  <Link href="/cupons" className="text-white/70 hover:text-[#8BC34A] transition-colors active:text-[#8BC34A]/80 block">
                    Cupons
                  </Link>
                </li>
                <li>
                  <Link href="/busca" className="text-white/70 hover:text-[#8BC34A] transition-colors active:text-[#8BC34A]/80 block">
                    Buscar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 2 - Categorias (máximo 4) */}
            <div>
              <h5 className="font-bold text-white/90 mb-3 text-xs uppercase tracking-wider">
                Categorias
              </h5>
              <ul className="space-y-2.5 text-sm">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.slug}>
                    <Link 
                      href={`/busca?categoria=${category.slug}`} 
                      className="text-white/70 hover:text-[#8BC34A] transition-colors active:text-[#8BC34A]/80 block truncate"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                {categories.length > 0 && (
                  <li>
                    <Link 
                      href="/busca" 
                      className="text-[#8BC34A] hover:text-[#8BC34A]/80 transition-colors font-medium block"
                    >
                      Ver todas →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Contato */}
          <div className="text-center mb-6">
            <p className="text-xs text-white/60">
              comercialfmad@gmail.com
            </p>
          </div>

          {/* Divisória */}
          <div className="h-px bg-white/10 mb-6"></div>

          {/* Copyright e Links Legais */}
          <div className="text-center space-y-3">
            <p className="text-xs text-white/50">
              © 2025 MarajoaraON
            </p>
            <div className="flex justify-center gap-4 text-xs flex-wrap">
              <Link href="/termos" className="text-white/50 hover:text-white transition-colors active:text-white/80">
                Termos
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/politica-privacidade" className="text-white/50 hover:text-white transition-colors active:text-white/80">
                Privacidade
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/politica-cookies" className="text-white/50 hover:text-white transition-colors active:text-white/80">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========== VERSÃO DESKTOP (≥ md) ========== */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-4 gap-12">
            
            {/* Coluna 1 - Sobre */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xl font-bold bg-gradient-to-r from-[#C2227A] to-pink-500 bg-clip-text text-transparent">
                Guia Marajoara
              </h4>
              <p className="text-sm text-white/70 leading-relaxed">
                Conectando você aos melhores comércios e serviços do Jardim Marajoara.
              </p>
              <div className="flex gap-2">
                <a 
                  href="https://instagram.com/jardimmarajoarasp" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visite nosso Instagram" 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-gradient-to-r hover:from-[#C2227A] hover:to-pink-500 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                </a>
                <a 
                  href="https://tiktok.com/@jardimmarajoarasp" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visite nosso TikTok" 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-gradient-to-r hover:from-[#C2227A] hover:to-pink-500 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Coluna 2 - Links Rápidos */}
            <div>
              <h5 className="font-semibold uppercase text-white/90 mb-4 text-sm tracking-wider">
                Links Rápidos
              </h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/login" className="text-white/70 hover:text-[#8BC34A] transition-colors">
                    Área do Parceiro
                  </Link>
                </li>
                <li>
                  <Link href="/cupons" className="text-white/70 hover:text-[#8BC34A] transition-colors">
                    Cupons Ativos
                  </Link>
                </li>
                <li>
                  <Link href="/busca" className="text-white/70 hover:text-[#8BC34A] transition-colors">
                    Buscar Empresas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3 - Categorias Desktop (até 7) */}
            <div>
              <h5 className="font-semibold uppercase text-white/90 mb-4 text-sm tracking-wider">
                Categorias
              </h5>
              <ul className="space-y-3 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link 
                      href={`/busca?categoria=${category.slug}`} 
                      className="text-white/70 hover:text-[#8BC34A] transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                {categories.length > 0 && (
                  <li>
                    <Link 
                      href="/busca" 
                      className="text-[#8BC34A] hover:text-[#8BC34A]/80 transition-colors font-medium"
                    >
                      Ver todas →
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Coluna 4 - Contato */}
            <div>
              <h5 className="font-semibold uppercase text-white/90 mb-4 text-sm tracking-wider">
                Contato
              </h5>
              <ul className="space-y-3 text-sm">
                <li className="text-white/70">
                  comercialfmad@gmail.com
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom bar Desktop */}
        <div className="border-t border-white/10 py-6">
          <div className="container mx-auto flex items-center justify-between px-4 text-sm text-white/60">
            <p>© 2025 MarajoaraON. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/termos" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/politica-privacidade" className="hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link href="/politica-cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}