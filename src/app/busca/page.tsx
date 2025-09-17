import { Suspense } from 'react'
import BuscaClient from './BuscaClient'
import { LoadingCard } from '@/components/ui/Loading'

// Componente de fallback para o Suspense
function BuscaLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="bg-gradient-to-r from-[#C2227A] to-[#A01860] py-12">
        <div className="container mx-auto px-4">
          <div className="h-32 animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <LoadingCard key={n} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Página principal com Suspense boundary
export default function BuscaPage() {
  return (
    <Suspense fallback={<BuscaLoading />}>
      <BuscaClient />
    </Suspense>
  )
}