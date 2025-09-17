'use client'
import { useState } from 'react'
import { HeroSection } from '@/components/layout/HeroSection'
import { RecentBusinesses } from '@/components/layout/RecentBusinesses'
import { ActiveCoupons } from '@/components/layout/ActiveCoupons'
import { FeaturedSection } from '@/components/layout/FeaturedSection'
import { MariCarreiraSection } from '@/components/layout/MariCarreiraSection'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
// Removidos: CardDescription, CardContent, CardFooter - não usados
// Removidos: Spinner, Skeleton, LoadingCard - não usados
import { Modal } from '@/components/ui/Modal'
// Removido: SearchBar - não usado
import { useToast } from '@/components/ui/Toast'

export default function HomePage() { // Mudei de TestPage para HomePage
  const [modalOpen, setModalOpen] = useState(false)
  // Removido: searchValue - não usado
  const { addToast } = useToast()
  // Removido: handleSearch - não usado
  const showSuccessToast = () => { 
    addToast({ 
      title: 'Sucesso!', 
      description: 'Operação realizada com sucesso.', 
      variant: 'success' 
    }) 
  }
  // Removidos: showErrorToast e showWarningToast - não usados nesta página
  
  return (
    <>
      <HeroSection />
      <RecentBusinesses />
      <ActiveCoupons />
      <FeaturedSection />
      <MariCarreiraSection />
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12 border-t pt-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
            Página de Teste dos Componentes Base
          </h2>
          <p className="text-[#6B7280] mb-6">
            As seções abaixo são mantidas para garantir que os componentes base continuam funcionando perfeitamente após cada nova integração.
          </p>
        </section>
        
        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Botões</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="whatsapp">WhatsApp</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>
        
        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Padrão</CardTitle>
              </CardHeader>
            </Card>
            <Card variant="business">
              <CardHeader>
                <CardTitle>Pizzaria Bella Italia</CardTitle>
              </CardHeader>
            </Card>
            <Card variant="coupon">
              <CardHeader>
                <CardTitle>Desconto Especial</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </section>
        
        {/* Modal & Toast Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Modal e Toasts</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
            <Button variant="secondary" onClick={showSuccessToast}>Toast Success</Button>
          </div>
          <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            title="Modal de Teste"
          >
            <p>Conteúdo do modal.</p>
          </Modal>
        </section>
      </div>
    </>
  )
}