'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const { user, signOut } = useAuth()
  const { isAdmin } = useAdmin()

  const messages = [
    '🎉 Novos cupons toda semana!',
    '📍 200+ comércios no Jardim Marajoara',
    '🎫 Economize até 50% com nossos parceiros'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 p-4 bg-[#C2227A] text-white rounded-br-lg">
        Pular para o conteúdo principal
      </a>

      <div className="bg-[#C2227A] h-10 relative overflow-hidden">
        <div className="container mx-auto px-4 h-full">
          <div className="relative h-full flex items-center justify-center">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn('absolute inset-0 flex items-center justify-center text-white text-sm font-medium transition-all duration-500', idx === currentMessage ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <nav className={cn('bg-white border-b border-gray-100 sticky top-0 z-30 transition-all duration-300', scrolled ? 'py-3 shadow-md' : 'py-4')}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logo-navbar.png"
                alt="MarajoaraON"
                width={180}
                height={50}
                priority
                className="h-10 w-auto"
              />
            </Link>

            <ul className="hidden md:flex items-center gap-8" role="menu">
              {[
                { href: '/', label: 'HOME' },
                { href: '/busca', label: 'BUSCA' },
                { href: '/cupons', label: 'CUPONS' }
              ].map((item) => (
                <li key={item.href} role="menuitem">
                  <Link href={item.href} className="text-[#C2227A] hover:text-[#7CB342] transition-colors font-medium relative group">
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7CB342] transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
              
              <li role="menuitem">
                <Link href="/cadastro" className="bg-[#7CB342] text-white px-6 py-2.5 rounded-full hover:bg-[#6A9A38] transition-all hover:scale-105 hover:shadow-lg font-medium">
                  CADASTRE-SE
                </Link>
              </li>
            </ul>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link 
                    href={isAdmin ? "/admin" : "/dashboard"} 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#C2227A]" 
                    aria-label={isAdmin ? "Painel Admin" : "Dashboard"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <button 
                    onClick={signOut}
                    className="text-sm text-gray-600 hover:text-[#C2227A] transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link href="/login" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#C2227A]" aria-label="Login">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
              
              <div className="h-6 w-px bg-gray-200" />
              
              <a href="https://instagram.com/jardimmarajoarasp" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#C2227A]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
              </a>

              <a href="https://tiktok.com/@jardimmarajoarasp" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#C2227A]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            
            <button className="md:hidden p-2 text-[#C2227A] hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}