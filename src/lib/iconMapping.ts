// src/lib/iconMapping.ts

import {
  Utensils, Coffee, Pizza,
  Sparkles, Scissors, Palette,
  PawPrint, Heart, Stethoscope,
  Shirt, ShoppingBag, Tag,
  Home, Building2, Wrench,
  Dumbbell, Activity, Bike,
  Cake, Cookie, Candy,
  Package, Truck, Car,
  Store, Users, Briefcase,
  Book, GraduationCap, School,
  Newspaper, Megaphone, Radio,
  ShoppingCart, Warehouse,
  Wrench as Tool, Hammer,
  type LucideIcon
} from 'lucide-react'

// Mapeamento automático baseado no slug
export const slugToIconMap: Record<string, LucideIcon> = {
  // Alimentação
  'restaurante': Utensils,
  'restaurantes': Utensils,
  'lanchonete': Coffee,
  'cafe': Coffee,
  'padaria': Coffee,
  'pizzaria': Pizza,
  'comida': Utensils,
  'alimentacao': Utensils,
  
  // Beleza
  'beleza': Sparkles,
  'salao': Scissors,
  'barbearia': Scissors,
  'estetica': Sparkles,
  'maquiagem': Palette,
  'cabelo': Scissors,
  
  // Animais
  'pet': PawPrint,
  'petshop': PawPrint,
  'veterinario': PawPrint,
  'animais': PawPrint,
  
  // Saúde
  'saude': Heart,
  'clinica': Stethoscope,
  'medico': Stethoscope,
  'hospital': Stethoscope,
  'farmacia': Heart,
  
  // Vestuário
  'vestuario': Shirt,
  'roupa': Shirt,
  'roupas': Shirt,
  'moda': ShoppingBag,
  'loja': Store,
  'boutique': ShoppingBag,
  'acessorios': Tag,
  
  // Imóveis
  'imovel': Home,
  'imoveis': Home,
  'imobiliaria': Building2,
  'casa': Home,
  'apartamento': Building2,
  
  // Serviços
  'servicos': Wrench,
  'manutencao': Wrench,
  'reparo': Wrench,
  'conserto': Wrench,
  
  // Fitness
  'fitness': Dumbbell,
  'academia': Dumbbell,
  'esporte': Activity,
  'bike': Bike,
  'bicicleta': Bike,
  
  // Doces
  'doces': Cake,
  'bolo': Cake,
  'bolos': Cake,
  'confeitaria': Cake,
  'doceria': Candy,
  'biscoito': Cookie,
  
  // Entregas
  'delivery': Truck,
  'entrega': Truck,
  'transporte': Car,
  'encomenda': Package,
  
  // Educação
  'educacao': GraduationCap,
  'escola': School,
  'curso': Book,
  'cursos': Book,
  'ensino': GraduationCap,
  
  // Negócios
  'empresa': Briefcase,
  'escritorio': Briefcase,
  'negocios': Briefcase,
  'consultoria': Users,

  // Comunicação e Mídia
  'comunicacao': Megaphone,
  'jornal': Newspaper,
  'jornalismo': Newspaper,
  'midia': Radio,
  'radio': Radio,
  'noticia': Newspaper,
  'noticias': Newspaper,
  'imprensa': Newspaper,
  'publicidade': Megaphone,
  'marketing': Megaphone,

  // Mercado e Varejo
  'mercado': ShoppingCart,
  'supermercado': ShoppingCart,
  'mercearia': Store,
  'atacado': Warehouse,
  'distribuidora': Warehouse,

  // Automotivo
  'automotivo': Car,
  'carro': Car,
  'automovel': Car,
  'mecanica': Tool,
  'oficina': Hammer,
  'garagem': Car,
}

// Função para pegar ícone baseado no slug
export function getIconBySlug(slug: string | null | undefined): LucideIcon | null {
  // Validação: retorna null se slug for vazio, null ou undefined
  if (!slug || typeof slug !== 'string') {
    return null
  }

  // Primeiro tenta o slug exato
  if (slugToIconMap[slug]) {
    return slugToIconMap[slug]
  }

  // Tenta variações do slug
  const variations = [
    slug.replace(/-/g, ''), // Remove hífens
    slug.split('-')[0], // Primeira palavra
    slug.replace(/s$/, ''), // Remove plural
  ]
  
  for (const variation of variations) {
    if (slugToIconMap[variation]) {
      return slugToIconMap[variation]
    }
  }
  
  // Tenta encontrar por substring
  for (const key in slugToIconMap) {
    if (slug.includes(key) || key.includes(slug)) {
      return slugToIconMap[key]
    }
  }
  
  return null
}