'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, signOut } = useAuth()
  const { isAdmin } = useAdmin()
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Swipe to close gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      onClose()
    }
  }

  const handleLogout = async () => {
    console.log('🔴 Logout iniciado no mobile')
    try {
      await signOut()
      console.log('✅ Logout concluído')
      onClose()
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      onClose()
    }
  }

  const handleLogin = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔵 Redirecionando para login')
    window.location.href = '/login'
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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

  if (typeof window === 'undefined' || !isOpen) return null

  const NavLink = ({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: string }) => {
    const isActive = pathname === href
    
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      onClose()
      setTimeout(() => {
        window.location.href = href
      }, 150)
    }
    
    return (
      <a 
        href={href} 
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative cursor-pointer',
          isActive 
            ? 'bg-gradient-to-r from-[#C2227A]/10 to-[#C2227A]/5 text-[#C2227A]' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-[#C2227A]'
        )}
      >
        <div className={cn(
          'w-5 h-5',
          isActive ? 'text-[#C2227A]' : 'text-gray-400 group-hover:text-[#C2227A]'
        )}>
          {icon}
        </div>
        <span className="text-sm font-medium flex-1">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 bg-[#C2227A] text-white text-xs font-semibold rounded-full">
            {badge}
          </span>
        )}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#C2227A] rounded-r-full" />
        )}
      </a>
    )
  }

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden z-[9998]',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full bg-white shadow-2xl w-[90%] max-w-[360px]',
          'transition-transform duration-300 ease-out z-[9999] md:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
            <span className="text-[#C2227A]">Jardim</span>
            <span className="text-gray-300">•</span>
            <span className="text-[#7CB342]">Marajoara</span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* USER PROFILE */}
        {user && (
          <div className="px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C2227A] to-[#7CB342] flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate leading-tight mb-0.5">{user.email}</p>
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  isAdmin 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                )}>
                  {isAdmin ? 'Administrador' : 'Parceiro'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                href="/"
                label="Home"
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
              />
            </li>
            
            <li>
              <NavLink
                href="/busca"
                label="Busca"
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </li>
            
            <li>
              <NavLink
                href="/cupons"
                label="Cupons"
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                }
              />
            </li>

            {user && (
              <>
                <li className="py-2">
                  <div className="h-px bg-gray-100"></div>
                </li>
                <li className="py-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Minha Conta</p>
                </li>
                <li>
                  <NavLink
                    href={isAdmin ? "/admin" : "/dashboard"}
                    label={isAdmin ? 'Painel Admin' : 'Meu Dashboard'}
                    icon={
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    }
                  />
                </li>
                {!isAdmin && (
                  <li>
                    <NavLink
                      href="/dashboard/plano"
                      label="Meu Plano"
                      icon={
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      }
                    />
                  </li>
                )}
              </>
            )}

            {!user && (
              <>
                <li className="pt-3">
                  <div className="h-px bg-gray-100 mb-3"></div>
                </li>
                <li>
                  <a 
                    href="/cadastro" 
                    onClick={(e) => {
                      e.preventDefault()
                      onClose()
                      setTimeout(() => {
                        window.location.href = '/cadastro'
                      }, 150)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#7CB342] to-[#6A9A38] text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Cadastre-se Grátis
                  </a>
                </li>
              </>
            )}

            <li className="py-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Suporte</p>
            </li>
            <li>
              <NavLink
                href="/faq"
                label="Ajuda"
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </li>
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="px-4 pt-3 pb-2">
            {user ? (
              <button 
                onClick={handleLogout}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            ) : (
              <button
                onClick={handleLogin}
                onTouchEnd={handleLogin}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-[#C2227A] hover:bg-pink-50 rounded-lg transition-colors text-sm font-medium cursor-pointer touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Entrar
              </button>
            )}
          </div>

          <div className="px-4 pb-3">
            <div className="flex items-center justify-center gap-6 py-3 border-t border-gray-200">
              <a 
                href="https://instagram.com/jardimmarajoarasp" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-[#C2227A] hover:bg-pink-50 rounded-full transition-colors" 
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
              </a>
              
              <a 
                href="https://tiktok.com/@jardimmarajoarasp" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-[#C2227A] hover:bg-pink-50 rounded-full transition-colors" 
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-1">
              Versão 1.0.0 • © 2025
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}