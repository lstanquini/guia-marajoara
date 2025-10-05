import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string) {
  return phone.replace(/\D/g, '')
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// ADICIONE ESTA NOVA FUNÇÃO
export function capitalizeCategory(category: string): string {
  if (!category) return ''
  
  // Palavras que devem ficar em minúsculo
  const lowercaseWords = ['e', 'de', 'da', 'do', 'das', 'dos', 'com', 'para']
  
  return category
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Primeira palavra sempre capitalizada
      if (index === 0 || !lowercaseWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}