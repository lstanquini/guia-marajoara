'use client'

import { useState } from 'react'
import { HeroSection } from '@/components/layout/HeroSection'
import { RecentBusinesses } from '@/components/layout/RecentBusinesses'
import { ActiveCoupons } from '@/components/layout/ActiveCoupons'
import { FeaturedSection } from '@/components/layout/FeaturedSection'
import { MariCarreiraSection } from '@/components/layout/MariCarreiraSection'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function TestPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { addToast } = useToast()
  const showSuccessToast = () => { addToast({ title: 'Sucesso!', variant: 'success' }) }

  return (
    <>
      <HeroSection />
      <RecentBusinesses />
      <ActiveCoupons />
      <FeaturedSection />
      <MariCarreiraSection />

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12 border-t pt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Página de Teste de Componentes Base</h2>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Modal e Toasts</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
            <Button variant="secondary" onClick={showSuccessToast}>Toast Success</Button>
          </div>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal de Teste">
            <p>Conteúdo do modal.</p>
          </Modal>
        </section>
      </div>
    </>
  )
}