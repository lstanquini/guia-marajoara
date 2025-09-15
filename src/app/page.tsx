'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/layout/HeroSection'
import { RecentBusinesses } from '@/components/layout/RecentBusinesses'
import { ActiveCoupons } from '@/components/layout/ActiveCoupons' // <-- IMPORTADO
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Spinner, Skeleton, LoadingCard } from '@/components/ui/Loading'
import { Modal } from '@/components/ui/Modal'
import { SearchBar } from '@/components/ui/SearchBar'
import { ToastContainer, useToast } from '@/components/ui/Toast'

export default function TestPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { toasts, addToast, removeToast } = useToast()

  const handleSearch = (value: string) => {
    addToast({
      title: 'Busca realizada',
      description: `Você buscou por: ${value}`,
      variant: 'info'
    })
  }

  const showSuccessToast = () => {
    addToast({
      title: 'Sucesso!',
      description: 'Operação realizada com sucesso.',
      variant: 'success'
    })
  }

  const showErrorToast = () => {
    addToast({
      title: 'Erro ao processar',
      description: 'Ocorreu um erro. Tente novamente.',
      variant: 'error'
    })
  }

  const showWarningToast = () => {
    addToast({
      title: 'Atenção',
      description: 'Verifique os dados informados.',
      variant: 'warning'
    })
  }

  return (
    <>
      <Navbar />
      
      <main role="main" id="main" className="min-h-screen bg-[#F8F9FA]">
        
        {/* -- SEÇÕES DA HOME PAGE -- */}
        <HeroSection />
        <RecentBusinesses />
        <ActiveCoupons />
        {/* -- FIM DAS SEÇÕES DA HOME PAGE -- */}

        <div className="container mx-auto px-4 py-8">
          <section className="mb-12 border-t pt-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Página de Teste dos Componentes Base</h2>
            <p className="text-[#6B7280] mb-6">As seções abaixo são mantidas para garantir que os componentes base continuam funcionando perfeitamente após cada nova integração.</p>
          </section>

          {/* Buttons Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Botões</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="whatsapp">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </Button>
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
                  <CardDescription>Descrição do card</CardDescription>
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
          
          {/* Loading States Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Loading States</h2>
            <LoadingCard />
          </section>

          {/* Modal & Toast Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Modal e Toasts</h2>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
              <Button variant="secondary" onClick={showSuccessToast}>Toast Success</Button>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal de Teste">
              <p>Conteúdo do modal.</p>
            </Modal>
          </section>
        </div>
      </main>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}