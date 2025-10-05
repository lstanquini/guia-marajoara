import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Interface para horários de funcionamento
export interface OpeningHours {
  [key: string]: {
    open: string
    close: string
    closed: boolean
  }
}

export interface BusinessSearchResult {
  id: string
  name: string
  slug: string
  description: string
  category_main: string
  category_sub: string | null
  logo_url: string | null
  banner_url: string | null
  rating: number | null
  total_reviews: number | null
  plan_type: 'basic' | 'premium'
  address: string
  neighborhood: string | null
  city: string
  whatsapp: string | null
  delivery: boolean
  opening_hours: OpeningHours | null
  has_active_coupons?: boolean
  relevance?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  order_index: number
}

export interface SearchFilters {
  category: string
  hasCoupons?: boolean
  hasDelivery?: boolean
  isOpen?: boolean
  sortBy: 'relevance' | 'name' | 'rating'
}

// Cache de categorias para evitar múltiplas chamadas
let categoriesCache: Category[] | null = null

export async function searchBusinesses(
  query: string = '',
  filters: SearchFilters
): Promise<BusinessSearchResult[]> {
  const supabase = createClientComponentClient()

  try {
    // Buscar empresas
    let queryBuilder = supabase
      .from('businesses')
      .select(`
        id, name, slug, description, category_main, category_sub,
        logo_url, banner_url, rating, total_reviews, plan_type,
        address, neighborhood, city, whatsapp, delivery, opening_hours
      `)
      .eq('status', 'approved')

    // Filtro de categoria
    if (filters.category !== 'all') {
      queryBuilder = queryBuilder.eq('category_main', filters.category)
    }

    // Filtro de delivery
    if (filters.hasDelivery) {
      queryBuilder = queryBuilder.eq('delivery', true)
    }

    const { data: businesses, error } = await queryBuilder

    if (error) throw error
    if (!businesses) return []

    // Buscar cupons ativos se necessário
    let businessesWithCoupons: BusinessSearchResult[] = []
    if (filters.hasCoupons) {
      const { data: coupons } = await supabase
        .from('coupons')
        .select('business_id')
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())

      const businessIdsWithCoupons = new Set(coupons?.map(c => c.business_id) || [])
      
      businessesWithCoupons = businesses
        .filter(b => businessIdsWithCoupons.has(b.id))
        .map(b => ({ ...b, has_active_coupons: true } as BusinessSearchResult))
    } else {
      // Adicionar informação de cupons para todos
      const { data: coupons } = await supabase
        .from('coupons')
        .select('business_id')
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())

      const businessIdsWithCoupons = new Set(coupons?.map(c => c.business_id) || [])
      businessesWithCoupons = businesses.map(b => ({
        ...b,
        has_active_coupons: businessIdsWithCoupons.has(b.id)
      } as BusinessSearchResult))
    }

    // Filtrar por busca de texto
    let results = businessesWithCoupons
    if (query && query.trim() !== '') {
      const searchLower = query.toLowerCase().trim()
      results = businessesWithCoupons.filter(b => {
        const nameMatch = b.name.toLowerCase().includes(searchLower)
        const categoryMatch = b.category_sub?.toLowerCase().includes(searchLower)
        const descMatch = b.description?.toLowerCase().includes(searchLower)
        const neighborhoodMatch = b.neighborhood?.toLowerCase().includes(searchLower)
        
        return nameMatch || categoryMatch || descMatch || neighborhoodMatch
      })

      // Calcular relevância
      results = results.map(b => {
        let relevance = 0
        const searchLower = query.toLowerCase().trim()
        
        if (b.name.toLowerCase().startsWith(searchLower)) relevance += 100
        else if (b.name.toLowerCase().includes(searchLower)) relevance += 50
        
        if (b.category_sub?.toLowerCase().includes(searchLower)) relevance += 30
        if (b.description?.toLowerCase().includes(searchLower)) relevance += 20
        if (b.neighborhood?.toLowerCase().includes(searchLower)) relevance += 10
        
        if (b.plan_type === 'premium') relevance += 15
        if (b.has_active_coupons) relevance += 10
        
        return { ...b, relevance } as BusinessSearchResult
      })
    }

    // Filtrar por horário de funcionamento (se solicitado)
    if (filters.isOpen) {
      const now = new Date()
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
      const currentTime = now.toTimeString().slice(0, 5) // HH:MM
      
      results = results.filter(b => {
        if (!b.opening_hours || typeof b.opening_hours !== 'object') return false
        
        const schedule = b.opening_hours[dayOfWeek]
        if (!schedule || schedule.closed) return false
        
        return currentTime >= schedule.open && currentTime <= schedule.close
      })
    }

    // Ordenação
    results.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      
      if (filters.sortBy === 'rating') {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        if (ratingB !== ratingA) return ratingB - ratingA
        return (b.total_reviews || 0) - (a.total_reviews || 0)
      }
      
      // Relevância (padrão)
      if (query && query.trim() !== '') {
        return (b.relevance || 0) - (a.relevance || 0)
      }
      
      // Se não tem query, ordena por premium + rating
      if (a.plan_type !== b.plan_type) {
        return a.plan_type === 'premium' ? -1 : 1
      }
      return (b.rating || 0) - (a.rating || 0)
    })

    return results
  } catch (error) {
    console.error('Erro na busca:', error)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  // Se já temos cache, retorna
  if (categoriesCache) return categoriesCache

  const supabase = createClientComponentClient()

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index')

    if (error) throw error
    
    // Salva no cache
    categoriesCache = categories || []
    return categoriesCache
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

export async function getCategoriesWithCount(): Promise<{
  value: string
  label: string
  count: number
  icon: string
}[]> {
  const supabase = createClientComponentClient()

  try {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('category_main')
      .eq('status', 'approved')

    if (!businesses) return []

    const counts: Record<string, number> = {}
    businesses.forEach(b => {
      counts[b.category_main] = (counts[b.category_main] || 0) + 1
    })

    // Buscar categorias com ícones
    const categories = await getCategories()

    const result = [
      {
        value: 'all',
        label: 'Todas',
        count: businesses.length,
        icon: '🏪'
      },
      ...categories.map(cat => ({
        value: cat.slug,
        label: cat.name,
        count: counts[cat.slug] || 0,
        icon: cat.icon
      }))
    ]

    return result
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

// Função auxiliar para buscar informações de uma categoria específica
export async function getCategoryInfo(slug: string): Promise<Category | null> {
  // Primeiro verifica no cache
  if (categoriesCache) {
    const category = categoriesCache.find(c => c.slug === slug)
    if (category) return category
  }

  const supabase = createClientComponentClient()

  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return category
  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return null
  }
}