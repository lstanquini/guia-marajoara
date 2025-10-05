'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Shield, Cookie } from 'lucide-react'

interface PolicyLayoutProps {
  title: string
  lastUpdate: string
  children: React.ReactNode
  currentPage: 'termos' | 'privacidade' | 'cookies'
}

export function PolicyLayout({ title, lastUpdate, children, currentPage }: PolicyLayoutProps) {
  const policies = [
    { id: 'termos', label: 'Termos de Uso', href: '/termos', icon: FileText },
    { id: 'privacidade', label: 'Privacidade', href: '/politica-privacidade', icon: Shield },
    { id: 'cookies', label: 'Cookies', href: '/politica-cookies', icon: Cookie }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-[#C2227A] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Voltar para o site</span>
            </Link>
            <div className="text-sm text-gray-500">
              Atualizado em {lastUpdate}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Pills */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {policies.map((policy) => {
              const Icon = policy.icon
              const isActive = policy.id === currentPage
              return (
                <Link
                  key={policy.id}
                  href={policy.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#C2227A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {policy.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mb-8 pb-8 border-b">
            Última atualização: {lastUpdate}
          </p>

          <div className="prose prose-gray max-w-none">
            {children}
          </div>
        </article>

        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-[#C2227A] text-white p-3 rounded-full shadow-lg hover:bg-[#A01860] transition-colors"
          aria-label="Voltar ao topo"
        >
          <ArrowLeft size={20} className="rotate-90" />
        </button>
      </main>
    </div>
  )
}