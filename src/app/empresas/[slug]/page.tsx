import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Mock Data para uma empresa específica
const companyData = {
  name: 'Pizzaria Bella Italia',
  category: 'Restaurante • Pizza • Italiana',
  rating: '4.8',
  reviews: 127,
  coverImage: '/images/cover-pizza.jpg', // Placeholder
  logo: '🍕',
  description: 'A autêntica pizza napolitana no coração do Jardim Marajoara. Usamos apenas os melhores ingredientes, com massa de fermentação natural e forno a lenha para garantir uma experiência inesquecível.',
  coupons: [
    { code: 'PIZZA20', title: '20% OFF no Rodízio' },
    { code: 'BELLA10', title: '10% OFF em Pizzas Grandes' },
  ],
  address: 'Rua das Flores, 123 - Jardim Marajoara',
  hours: 'Ter-Dom: 18h às 23h',
}

export default function CompanyDetailPage({ params }: { params: { slug: string } }) {
  // A lógica para buscar os dados da empresa pelo `params.slug` viria aqui
  
  return (
    <div>
      {/* Seção de Capa e Identidade */}
      <section className="relative h-64 w-full bg-gray-200">
        {/* Imagem de capa aqui */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 mx-auto flex h-full items-end p-4 text-white">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-4 border-white bg-gray-100 text-5xl shadow-lg">
              {companyData.logo}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{companyData.name}</h1>
              <p>{companyData.category}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="container mx-auto grid grid-cols-1 gap-8 p-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Sobre */}
          <section id="sobre" className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Sobre a Empresa</h2>
            <p className="text-text-secondary">{companyData.description}</p>
          </section>

          {/* Cupons */}
          <section id="cupons">
            <h2 className="mb-4 text-2xl font-bold">Cupons Disponíveis</h2>
            <div className="space-y-4">
              {companyData.coupons.map(coupon => (
                <Card key={coupon.code} variant="coupon" className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{coupon.title}</h3>
                    <p className="font-mono text-sm text-rosa">Código: {coupon.code}</p>
                  </div>
                  <Button>Pegar Cupom</Button>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Informações */}
        <aside className="md:col-span-1">
          <Card className="sticky top-24 p-6">
            <h3 className="mb-4 text-lg font-semibold">Localização e Horários</h3>
            <div className="h-48 w-full rounded-md bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.898898127539!2d-46.6975396848721!3d-23.50085198471286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce580d38158971%3A0x2641a27e77d8a2c4!2sJardim%20Marajoara%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1663270428987!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa da localização de ${companyData.name}`} // Regra P028
              ></iframe>
            </div>
            <p className="mt-4 text-sm text-text-secondary">{companyData.address}</p>
            <p className="mt-2 text-sm text-text-secondary"><strong>Horários:</strong> {companyData.hours}</p>
          </Card>
        </aside>
      </div>
    </div>
  )
}