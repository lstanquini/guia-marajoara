'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/layout/HeroSection'
import { RecentBusinesses } from '@/components/layout/RecentBusinesses'
import { ActiveCoupons } from '@/components/layout/ActiveCoupons'
import { FeaturedSection } from '@/components/layout/FeaturedSection'
import { MariCarreiraSection } from '@/components/layout/MariCarreiraSection' // <-- IMPORTADO
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
        <FeaturedSection />
        <MariCarreiraSection />
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

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Tamanhos</h3>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="full">Full Width</Button>
              </div>
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
                <CardContent>
                  <p className="text-[#6B7280]">
                    Conteúdo do card com informações relevantes para o usuário.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">Ação</Button>
                </CardFooter>
              </Card>

              <Card variant="business">
                <CardHeader>
                  <div className="text-3xl mb-2">🍕</div>
                  <CardTitle>Pizzaria Bella Italia</CardTitle>
                  <CardDescription>Restaurante • Pizza • Italiana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span>★★★★☆</span>
                    <span className="text-sm text-[#6B7280] ml-2">4.2 (127 avaliações)</span>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-2">
                    Av. do Cursino, 234 - Jardim Marajoara
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="whatsapp">WhatsApp</Button>
                </CardFooter>
              </Card>

              <Card variant="coupon">
                <CardHeader>
                  <div className="text-3xl font-bold text-[#7CB342]">20% OFF</div>
                  <CardTitle>Desconto Especial</CardTitle>
                  <CardDescription>Válido até 31/12/2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#6B7280]">
                    Use o código: <span className="font-mono font-bold text-[#C2227A]">PROMO20</span>
                  </p>
                  <p className="text-xs text-[#6B7280] mt-2">
                    *Válido para compras acima de R$ 50
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">Resgatar Cupom</Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* Loading States */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Loading States</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Spinners</h3>
              <div className="flex gap-8 items-center">
                <div className="text-center">
                  <Spinner size="sm" />
                  <p className="text-sm text-[#6B7280] mt-2">Small</p>
                </div>
                <div className="text-center">
                  <Spinner size="md" />
                  <p className="text-sm text-[#6B7280] mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="text-sm text-[#6B7280] mt-2">Large</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Skeletons</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm max-w-md">
                <Skeleton variant="title" className="mb-4" />
                <Skeleton variant="text" className="mb-2" />
                <Skeleton variant="text" className="mb-2" />
                <Skeleton variant="text" className="w-4/5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Loading Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </div>
            </div>
          </section>

          {/* Modal Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Modal</h2>
            <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Título do Modal"
              description="Esta é a descrição do modal com informações importantes."
              actions={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={() => {
                    setModalOpen(false)
                    showSuccessToast()
                  }}>
                    Confirmar
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                <p className="text-[#6B7280]">
                  Este é o conteúdo do modal. Aqui você pode adicionar formulários, 
                  informações detalhadas ou qualquer outro conteúdo necessário.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-[#6B7280]">
                    💡 Dica: O modal é responsivo - fullscreen no mobile e centralizado no desktop.
                  </p>
                </div>
              </div>
            </Modal>
          </section>

          {/* Toast Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Toasts / Notificações</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" onClick={showSuccessToast}>
                Toast Success
              </Button>
              <Button variant="outline" onClick={showErrorToast}>
                Toast Error
              </Button>
              <Button variant="ghost" onClick={showWarningToast}>
                Toast Warning
              </Button>
            </div>
          </section>

          {/* Accessibility Info */}
          <section className="mb-12 bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">✅ Acessibilidade Implementada</h2>
            <ul className="space-y-2 text-[#6B7280]">
              <li>✓ Skip link para navegação por teclado</li>
              <li>✓ ARIA labels em todos os elementos interativos</li>
              <li>✓ Focus trap no modal e drawer mobile</li>
              <li>✓ Contraste WCAG AA (verde ajustado para #7CB342)</li>
              <li>✓ Touch targets mínimos de 44x44px no mobile</li>
              <li>✓ Screen reader support com .sr-only</li>
              <li>✓ Reduced motion support</li>
              <li>✓ Navegação completa por teclado</li>
            </ul>
          </section>
        </div>
      </main>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}