import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

// Mock Data
const companyData = {
  name: 'Pizzaria Bella Italia',
  category: 'Restaurante • Pizza • Italiana',
  logo: '🍕',
  description: 'A autêntica pizza napolitana no coração do Jardim Marajoara. Usamos apenas os melhores ingredientes, com massa de fermentação natural e forno a lenha para garantir uma experiência inesquecível.',
  coupons: [
    { code: 'PIZZA20', title: '20% OFF no Rodízio' },
    { code: 'BELLA10', title: '10% OFF em Pizzas Grandes' },
  ],
  address: 'Rua das Flores, 123 - Jardim Marajoara, São Paulo - SP',
  hours: 'Ter-Dom: 18h às 23h',
}

interface CompanyDetailPageProps {
  params: Promise<{ slug: string }>  // MUDANÇA: params agora é Promise
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { slug } = await params  // MUDANÇA: await nos params
  
  // Usar o slug se necessário (removi o warning)
  console.log('Empresa slug:', slug)
  
  return (
    <div>
      {/* Seção de Capa e Identidade */}
      <section className="relative h-64 w-full bg-gray-200">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 mx-auto flex h-full items-end p-4 text-white">
          <div className="flex -mb-10 items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-4 border-white bg-gray-100 text-5xl shadow-lg md:h-32 md:w-32">
              {companyData.logo}
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-4xl">{companyData.name}</h1>
              <p className="text-sm md:text-base">{companyData.category}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="container mx-auto grid grid-cols-1 gap-8 p-4 pt-16 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Sobre */}
          <section id="sobre" className="mb-8">
            <h2 className="mb-3 text-2xl font-bold">Sobre a Empresa</h2>
            <p className="text-text-secondary leading-relaxed">{companyData.description}</p>
          </section>

          {/* Cupons */}
          <section id="cupons">
            <h2 className="mb-4 text-2xl font-bold">Cupons Disponíveis</h2>
            <div className="space-y-4">
              {companyData.coupons.map(coupon => (
                <Card key={coupon.code} variant="coupon" className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{coupon.title}</h3>
                    <p className="font-mono text-sm text-rosa">Código: {coupon.code}</p>
                  </div>
                  <Button className="w-full sm:w-auto">Pegar Cupom</Button>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Informações */}
        <aside className="md:col-span-1">
          <div className="sticky top-24">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Localização e Horários</h3>
              <div className="aspect-video w-full rounded-md bg-gray-200">
                {/* Mapa placeholder */}
                <div className="flex h-full items-center justify-center text-gray-400">
                  Mapa aqui
                </div>
              </div>
              <p className="mt-4 text-sm text-text-secondary">{companyData.address}</p>
              <p className="mt-2 text-sm text-text-secondary"><strong>Horários:</strong> {companyData.hours}</p>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}