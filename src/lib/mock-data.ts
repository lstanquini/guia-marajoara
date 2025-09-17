// lib/mock-data.ts
export interface Business {
  id: string
  name: string
  slug: string
  logo: string
  category: string
  rating: number
  distance: number
  address: string
  phone: string
  whatsapp: string
  description: string
  image?: string
}

export interface Coupon {
  id: string
  businessId: string
  title: string
  code: string
  discount: string
  validUntil: string
}

// Mock de 30 empresas para testar infinite scroll
export const mockBusinesses: Business[] = [
  { id: '1', name: 'Pizzaria Bella Italia', slug: 'pizzaria-bella-italia', logo: '🍕', category: 'Restaurante', rating: 4.8, distance: 2.3, address: 'Av. do Cursino, 234', phone: '11 5555-5555', whatsapp: '11955555555', description: 'A autêntica pizza italiana no coração do Jardim Marajoara.' },
  { id: '2', name: 'Studio Beauty Nails', slug: 'studio-beauty-nails', logo: '💅', category: 'Beleza', rating: 4.9, distance: 0.8, address: 'Rua das Flores, 567', phone: '11 5555-5556', whatsapp: '11955555556', description: 'Especialistas em unhas e beleza.' },
  { id: '3', name: 'Pet Shop Amigo Fiel', slug: 'pet-shop-amigo-fiel', logo: '🐾', category: 'Pet Shop', rating: 4.5, distance: 1.5, address: 'Rua dos Animais, 123', phone: '11 5555-5557', whatsapp: '11955555557', description: 'Tudo para seu pet com amor e carinho.' },
  { id: '4', name: 'Burger King Marajoara', slug: 'burger-king', logo: '🍔', category: 'Restaurante', rating: 4.2, distance: 3.1, address: 'Av. Principal, 890', phone: '11 5555-5558', whatsapp: '11955555558', description: 'O burger favorito do bairro.' },
  { id: '5', name: 'Clínica Saúde & Vida', slug: 'clinica-saude-vida', logo: '🏥', category: 'Saúde', rating: 5.0, distance: 0.5, address: 'Rua da Saúde, 456', phone: '11 5555-5559', whatsapp: '11955555559', description: 'Cuidando da sua saúde com excelência.' },
  { id: '6', name: 'Mercado do Zé', slug: 'mercado-do-ze', logo: '🛒', category: 'Mercado', rating: 3.5, distance: 2.2, address: 'Rua do Comércio, 789', phone: '11 5555-5560', whatsapp: '11955555560', description: 'Tudo que você precisa perto de casa.' },
  { id: '7', name: 'Academia PowerFit', slug: 'academia-powerfit', logo: '🏋️', category: 'Fitness', rating: 4.8, distance: 1.8, address: 'Av. dos Esportes, 321', phone: '11 5555-5561', whatsapp: '11955555561', description: 'Transforme seu corpo e mente.' },
  { id: '8', name: 'Doce Mel Confeitaria', slug: 'doce-mel', logo: '🍰', category: 'Confeitaria', rating: 4.9, distance: 3.2, address: 'Rua dos Doces, 654', phone: '11 5555-5562', whatsapp: '11955555562', description: 'Bolos e doces artesanais.' },
  { id: '9', name: 'TechFix Assistência', slug: 'techfix', logo: '📱', category: 'Serviços', rating: 4.4, distance: 1.1, address: 'Rua da Tecnologia, 987', phone: '11 5555-5563', whatsapp: '11955555563', description: 'Conserto de celulares e notebooks.' },
  { id: '10', name: 'Sabor Caseiro', slug: 'sabor-caseiro', logo: '🥘', category: 'Restaurante', rating: 4.6, distance: 1.2, address: 'Rua da Comida, 147', phone: '11 5555-5564', whatsapp: '11955555564', description: 'Comida caseira todos os dias.' },
  // ... adicionar mais 20 empresas para teste de scroll
  { id: '11', name: 'Barbearia Style', slug: 'barbearia-style', logo: '💈', category: 'Beleza', rating: 4.7, distance: 2.5, address: 'Rua do Corte, 258', phone: '11 5555-5565', whatsapp: '11955555565', description: 'Corte e barba profissional.' },
  { id: '12', name: 'Loja M&M Fashion', slug: 'mm-fashion', logo: '👕', category: 'Vestuário', rating: 4.3, distance: 0.9, address: 'Rua da Moda, 369', phone: '11 5555-5566', whatsapp: '11955555566', description: 'Moda feminina e masculina.' },
]

// Mock de cupons
export const mockCoupons: Coupon[] = [
  { id: 'c1', businessId: '1', title: '20% OFF no Rodízio', code: 'PIZZA20', discount: '20%', validUntil: '31/12/2025' },
  { id: 'c2', businessId: '2', title: '25% OFF Unhas em Gel', code: 'NAILS25', discount: '25%', validUntil: '30/11/2025' },
  { id: 'c3', businessId: '3', title: 'Banho Grátis', code: 'PETBANHO', discount: 'Grátis', validUntil: '15/12/2025' },
  { id: 'c4', businessId: '4', title: '15% OFF Combos', code: 'BK15', discount: '15%', validUntil: '31/12/2025' },
  { id: 'c5', businessId: '5', title: '1ª Consulta Grátis', code: 'SAUDE1', discount: 'Grátis', validUntil: '30/11/2025' },
  { id: 'c6', businessId: '6', title: 'Frete Grátis', code: 'FRETE0', discount: 'Grátis', validUntil: '31/12/2025' },
  { id: 'c7', businessId: '7', title: 'Matrícula Grátis', code: 'FIT0', discount: 'Grátis', validUntil: '31/01/2026' },
  { id: 'c8', businessId: '8', title: '15% OFF em Bolos', code: 'DOCE15', discount: '15%', validUntil: '25/12/2025' },
  { id: 'c9', businessId: '9', title: 'Check-up Grátis', code: 'TECH0', discount: 'Grátis', validUntil: '31/12/2025' },
  { id: 'c10', businessId: '10', title: '10% OFF Almoço', code: 'CASEIRO10', discount: '10%', validUntil: '30/11/2025' },
]

// Função helper para pegar cupom mais recente
export function getLatestCoupon(businessId: string): Coupon | undefined {
  return mockCoupons.find(c => c.businessId === businessId)
}

// Função para simular busca com delay
export async function searchBusinesses(
  query: string = '',
  page: number = 1,
  limit: number = 12
): Promise<{ businesses: (Business & { latestCoupon?: Coupon })[], hasMore: boolean, total: number }> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let filtered = mockBusinesses
  
  // Filtrar por query
  if (query) {
    filtered = mockBusinesses.filter(b => 
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  // Paginação
  const start = (page - 1) * limit
  const end = start + limit
  const paged = filtered.slice(start, end)
  
  // Adicionar cupom mais recente
  const withCoupons = paged.map(business => ({
    ...business,
    latestCoupon: getLatestCoupon(business.id)
  }))
  
  return {
    businesses: withCoupons,
    hasMore: end < filtered.length,
    total: filtered.length
  }
}