'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'

// Mock Data
const coupons = [
  {
    discount: '15%',
    label: 'Desconto',
    icon: '🥖',
    business: 'Casa Bauducco',
    description: 'Em todos os panetones e produtos natalinos.',
    code: 'BAUDUCCO15',
    validity: 'Até 31/12',
  },
  {
    discount: '20%',
    label: 'Desconto',
    icon: '🍕',
    business: 'Pizzaria Bella Italia',
    description: 'No rodízio de pizza nas terças e quartas-feiras.',
    code: 'PIZZA20',
    validity: 'Até 30/11',
  }
]

export function ActiveCoupons() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isModalOpen) {
      // Auto-foco no primeiro campo do formulário (Decisão P019)
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [isModalOpen])

  const handleOpenModal = (code: string) => {
    setSelectedCoupon(code)
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCoupon(null)
  }

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-text-primary md:text-4xl">
              Cupons Ativos
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Ofertas exclusivas para você economizar no bairro.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {coupons.map((coupon) => (
              <Card
                key={coupon.code}
                variant="coupon"
                className="grid grid-cols-1 items-center gap-6 p-6 sm:grid-cols-[120px_1fr_auto]"
              >
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-verde">{coupon.discount}</p>
                  <p className="text-xs uppercase text-text-secondary">{coupon.label}</p>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-2xl">{coupon.icon}</span>
                    <h3 className="font-semibold">{coupon.business}</h3>
                  </div>
                  <p className="text-sm text-text-secondary">{coupon.description}</p>
                  <p className="mt-2 text-xs text-text-secondary">Válido até: {coupon.validity}</p>
                </div>
                <Button variant="whatsapp" onClick={() => handleOpenModal(coupon.code)}>
                  Receber
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Receber Cupom"
        description="Enviaremos o código do cupom diretamente para o seu WhatsApp."
        actions={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleCloseModal}>Enviar Cupom</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="font-mono text-lg font-bold text-verde">{selectedCoupon}</p>
          </div>
          <Input ref={nameInputRef} name="name" label="Seu nome" placeholder="Digite seu nome" />
          <Input name="whatsapp" label="WhatsApp" placeholder="(11) 99999-9999" />
        </div>
      </Modal>
    </>
  )
}