'use client'

import Link from 'next/link'

// Defina as categorias que você quer destacar na homepage
const highlightedCategories = [
  { name: 'Restaurantes', value: 'restaurante', emoji: '🍕' },
  { name: 'Beleza & Estética', value: 'beleza', emoji: '💅' },
  { name: 'Pet Shops', value: 'pet', emoji: '🐾' },
  { name: 'Vestuário', value: 'vestuario', emoji: '👕' },
  { name: 'Saúde', value: 'saude', emoji: '🏥' },
  { name: 'Serviços', value: 'servicos', emoji: '🛠️' },
]

export function CategoryHighlights() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Explore por Categoria</h2>
          <p className="text-gray-500 mt-2">Encontre rapidamente o que você precisa.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
          {highlightedCategories.map((category) => (
            <Link
              key={category.value}
              href={`/busca?categoria=${category.value}`}
              className="group block rounded-xl border border-gray-200 p-6 shadow-sm hover:border-pink-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-3">{category.emoji}</div>
              <h3 className="font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}