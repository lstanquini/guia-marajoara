'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Spinner, Skeleton, LoadingCard } from '@/components/ui/Loading'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function TestPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { addToast } = useToast()
  const showSuccessToast = () => { addToast({ title: 'Sucesso!', variant: 'success' }) }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Página de Teste de Componentes</h1>
        <p className="text-text-secondary">Este é o nosso laboratório para validar os componentes base do Design System.</p>
      </section>

      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Botões</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card><CardHeader><CardTitle>Card Padrão</CardTitle></CardHeader></Card>
          <Card variant="business"><CardHeader><CardTitle>Card de Empresa</CardTitle></CardHeader></Card>
          <Card variant="coupon"><CardHeader><CardTitle>Card de Cupom</CardTitle></CardHeader></Card>
        </div>
      </section>

      {/* Modal & Toast Section */}
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
  )
}