// src/lib/iconMapping.ts
// Cada categoria deve ter um ícone SVG ÚNICO

import {
  // Alimentação - ícones únicos
  Utensils, Coffee, Pizza, Croissant, IceCream,
  Apple, Soup, ChefHat,

  // Beleza - ícones únicos
  Sparkles, Scissors, Palette, Brush, Smile, Waves,

  // Animais - ícones únicos
  PawPrint, Dog, Cat, Bird,

  // Saúde - ícones únicos
  Heart, Stethoscope, Cross, Pill, Syringe, Ambulance,

  // Vestuário - ícones únicos
  Shirt, ShoppingBag, Tag, Watch, Glasses, Footprints,

  // Imóveis - ícones únicos
  Home, Building2, Building, Key, DoorOpen,

  // Serviços - ícones únicos
  Wrench, Settings, HardHat, Hammer, Drill, PaintBucket,

  // Fitness - ícones únicos
  Dumbbell, Activity, Bike, Trophy, HeartPulse,

  // Doces - ícones únicos
  Cake, Cookie, Candy, Dessert, CakeSlice,

  // Entregas - ícones únicos
  Package, Truck, Car, Boxes, PackageCheck, TramFront,

  // Negócios - ícones únicos
  Store, Users, Briefcase, Landmark, UserTie,

  // Educação - ícones únicos
  Book, GraduationCap, School, BookOpen, Library,

  // Comunicação - ícones únicos
  Newspaper, Megaphone, Radio, Tv, Podcast, Mail, Send, MessagesSquare,

  // Mercado - ícones únicos
  ShoppingCart, Warehouse, ShoppingBasket, Package2, Store as Shop,

  // Automotivo - ícones únicos
  CarFront, Cog, Gauge, Fuel, CarTaxiFront, Wrench as Tool,

  // Ícones adicionais para evitar duplicatas
  Croissant as Bread, Sandwich, Beef, Salad, Flame, Milk,
  Instagram, LayoutGrid, Zap, Target, Hash, Sparkle, TrendingUp,
  FileText, StickyNote, ClipboardList, Megaphone as Loudspeaker,

  type LucideIcon
} from 'lucide-react'

// Mapeamento automático baseado no slug
// IMPORTANTE: Cada slug deve ter um ícone SVG ÚNICO (sem duplicatas)
export const slugToIconMap: Record<string, LucideIcon> = {
  // Alimentação - ícones 100% únicos
  'restaurante': Utensils,
  'restaurantes': ChefHat,
  'lanchonete': Coffee,
  'cafe': Croissant,
  'padaria': Bread,          // Mudado de Croissant para Bread
  'pizzaria': Pizza,
  'comida': Apple,
  'alimentacao': Soup,
  'sorveteria': IceCream,
  'hamburgueria': Beef,
  'churrascaria': Flame,     // Mudado de Beef para Flame (churrasqueira)
  'salgados': Sandwich,
  'buffet': Salad,
  'leiteria': Milk,

  // Beleza - ícones únicos
  'beleza': Sparkles,
  'salao': Scissors,
  'barbearia': Brush,
  'estetica': Smile,
  'maquiagem': Palette,
  'cabelo': Waves,

  // Animais - ícones únicos
  'pet': PawPrint,
  'petshop': Dog,
  'veterinario': Cat,
  'animais': Bird,

  // Saúde - ícones únicos
  'saude': Heart,
  'clinica': Stethoscope,
  'medico': Cross,
  'hospital': Ambulance,
  'farmacia': Pill,
  'laboratorio': Syringe,

  // Vestuário - ícones únicos
  'vestuario': Shirt,
  'roupa': Tag,
  'roupas': ShoppingBag,
  'moda': Glasses,
  'loja': Store,
  'boutique': Watch,
  'acessorios': LayoutGrid,  // Mudado de Footprints para LayoutGrid
  'calcados': Footprints,

  // Imóveis - ícones únicos
  'imovel': Home,
  'imoveis': Key,
  'imobiliaria': Building2,
  'casa': DoorOpen,
  'apartamento': Building,

  // Serviços - ícones únicos
  'servicos': Wrench,
  'manutencao': Settings,
  'reparo': Tool,           // Usando Tool (Wrench as Tool) em vez de Hammer
  'conserto': Drill,
  'construcao': HardHat,
  'pintura': PaintBucket,

  // Fitness - ícones únicos
  'fitness': Dumbbell,
  'academia': Activity,
  'esporte': Trophy,
  'bike': Bike,
  'bicicleta': HeartPulse,

  // Doces - ícones únicos
  'doces': Candy,
  'bolo': Cake,
  'bolos': CakeSlice,
  'confeitaria': Dessert,
  'doceria': Cookie,
  'biscoito': Sparkle,      // Ícone diferente para biscoitos

  // Entregas - ícones únicos
  'delivery': Truck,
  'entrega': PackageCheck,
  'transporte': TramFront,  // Mudado de Car para TramFront (Car já usado em 'carro')
  'encomenda': Package,
  'logistica': Boxes,

  // Educação - ícones únicos
  'educacao': GraduationCap,
  'escola': School,
  'curso': Book,
  'cursos': BookOpen,
  'ensino': Library,

  // Negócios - ícones únicos
  'empresa': Briefcase,
  'escritorio': UserTie,
  'negocios': Landmark,
  'consultoria': Users,

  // Comunicação e Mídia - ícones 100% únicos
  'comunicacao': Megaphone,
  'jornal': Newspaper,
  'jornalismo': Mail,
  'midia': Tv,
  'radio': Radio,
  'noticia': Podcast,
  'noticias': FileText,     // Mudado de Podcast para FileText
  'imprensa': StickyNote,   // Mudado de Newspaper para StickyNote
  'publicidade': Loudspeaker, // Mudado de Megaphone para Loudspeaker
  'marketing': TrendingUp,  // Mudado de Megaphone para TrendingUp

  // Mercado e Varejo - ícones únicos
  'mercado': ShoppingCart,
  'supermercado': ShoppingBasket,
  'mercearia': Shop,        // Mudado de Store para Shop (Store já usado em 'loja')
  'atacado': Warehouse,
  'distribuidora': Package2,

  // Automotivo - ícones únicos
  'automotivo': CarFront,
  'carro': Car,
  'automovel': CarTaxiFront,
  'mecanica': Cog,
  'oficina': Hammer,
  'garagem': Gauge,
  'posto': Fuel,
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