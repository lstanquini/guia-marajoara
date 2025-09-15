'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Efeito para fechar com ESC e travar scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Evita erros SSR no Next.js
  if (typeof window === 'undefined' || !isOpen) {
    return null
  }

  // Portal renderiza direto no body
  return createPortal(
    <>
      {/* Overlay com fade */}
      <div
        className={cn(
          'fixed inset-0 bg-black transition-opacity duration-300 md:hidden',
          'z-[9998]', // z-index alto para overlay
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Drawer - 80% largura, máximo 300px */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full bg-white shadow-xl',
          'w-[80%] max-w-[300px]', // Largura responsiva
          'transition-transform duration-300 ease-in-out',
          'z-[9999]', // z-index máximo para drawer
          'md:hidden', // Oculto no desktop
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        {/* Header do Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {/* Logo Compacta */}
          <div className="flex items-center gap-1 text-lg font-bold">
            <span className="text-[#C2227A]">Jardim</span>
            <span className="text-[#7CB342]">Marajoara</span>
            <span className="text-[#00BCD4] text-sm">SP</span>
          </div>
          
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fechar menu"
          >
            <svg 
              className="w-6 h-6 text-[#6B7280]" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4" role="navigation">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-3 text-[#C2227A] hover:bg-[#F8F9FA] rounded-xl transition-all"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                HOME
              </Link>
            </li>
            
            <li>
              <Link 
                href="/busca" 
                className="flex items-center gap-3 px-4 py-3 text-[#C2227A] hover:bg-[#F8F9FA] rounded-xl transition-all"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                BUSCA
              </Link>
            </li>
            
            <li>
              <Link 
                href="/cupons" 
                className="flex items-center gap-3 px-4 py-3 text-[#C2227A] hover:bg-[#F8F9FA] rounded-xl transition-all"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                CUPONS
              </Link>
            </li>
            
            <li>
              <Link 
                href="/destaque" 
                className="flex items-center gap-3 px-4 py-3 text-[#C2227A] hover:bg-[#F8F9FA] rounded-xl transition-all"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                DESTAQUE
              </Link>
            </li>
            
            {/* Divider */}
            <li className="py-2">
              <div className="border-t border-gray-100"></div>
            </li>
            
            {/* CTA Button */}
            <li>
              <Link 
                href="/cadastro" 
                className="block text-center bg-[#7CB342] text-white py-3 px-4 rounded-xl hover:bg-[#6A9A38] transition-all transform hover:scale-105 font-semibold"
                onClick={onClose}
              >
                CADASTRE-SE
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          {/* Login Link */}
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-3 py-3 text-[#C2227A] hover:text-[#A01860] transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Fazer Login</span>
          </Link>
          
          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-4">
            <a 
              href="https://instagram.com/jardimmarajoarasp" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#C2227A] hover:text-[#A01860] transition-colors" 
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
              </svg>
            </a>
            
            <a 
              href="https://tiktok.com/@jardimmarajoarasp" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#C2227A] hover:text-[#A01860] transition-colors" 
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}