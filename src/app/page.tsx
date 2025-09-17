'use client'

import { useState } from 'react'
import { HeroSection } from '@/components/layout/HeroSection'
import { RecentBusinesses } from '@/components/layout/RecentBusinesses'
import { ActiveCoupons } from '@/components/layout/ActiveCoupons'
import { FeaturedSection } from '@/components/layout/FeaturedSection'
import { MariCarreiraSection } from '@/components/layout/MariCarreiraSection'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { LoadingCard } from '@/components/ui/Loading'
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
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Página de Teste dos Componentes Base</h2>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Botões</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Modal e Toasts</h2>
          <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal de Teste">
            <p>Conteúdo do modal.</p>
          </Modal>
        </section>
      </div>
    </>
  )
}