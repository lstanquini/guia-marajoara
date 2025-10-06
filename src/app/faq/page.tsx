'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
  category: 'parceiros' | 'usuarios' | 'geral'
}

const faqs: FAQItem[] = [
  // PARCEIROS
  {
    category: 'parceiros',
    question: 'Como faço para cadastrar minha empresa?',
    answer: 'Clique no botão "CADASTRE-SE" no menu principal e preencha o formulário com as informações da sua empresa. Após a aprovação pela nossa equipe, você receberá um email com suas credenciais de acesso.'
  },
  {
    category: 'parceiros',
    question: 'Quais são os planos disponíveis?',
    answer: 'Temos dois planos: Básico (gratuito) com até 5 cupons ativos, e Premium com até 10 cupons ativos e destaque na página inicial. Você pode alterar seu plano a qualquer momento no seu dashboard.'
  },
  {
    category: 'parceiros',
    question: 'Como criar um cupom de desconto?',
    answer: 'Acesse seu dashboard, vá em "Cupons" e clique em "Novo Cupom". Preencha as informações do desconto, data de validade e clique em salvar. O cupom ficará ativo assim que você configurar a data de início.'
  },
  {
    category: 'parceiros',
    question: 'Posso editar um cupom depois de criado?',
    answer: 'Sim, você pode editar cupons que ainda não foram ativados. Após a ativação (quando a data de início chega), o cupom não pode mais ser editado para garantir a confiabilidade para os clientes.'
  },
  {
    category: 'parceiros',
    question: 'Como os clientes usam meus cupons?',
    answer: 'Os clientes visualizam seus cupons no site, clicam em "Pegar Cupom" e o sistema gera uma imagem com o código. O cliente apresenta esta imagem na sua loja/estabelecimento para validar o desconto.'
  },
  {
    category: 'parceiros',
    question: 'Preciso pagar para estar no MarajoaraON?',
    answer: 'Não! O plano básico é totalmente gratuito. Você pode fazer upgrade para o plano Premium se quiser ter mais cupons ativos e aparecer em destaque na home.'
  },
  
  // USUÁRIOS
  {
    category: 'usuarios',
    question: 'Como usar os cupons de desconto?',
    answer: 'Navegue pelos cupons disponíveis, clique no cupom desejado e depois em "Pegar Cupom". Uma imagem será gerada com o código. Apresente esta imagem no estabelecimento parceiro para obter o desconto.'
  },
  {
    category: 'usuarios',
    question: 'Os cupons têm validade?',
    answer: 'Sim, cada cupom tem uma data de início e término definida pelo parceiro. Fique atento às datas para não perder as promoções!'
  },
  {
    category: 'usuarios',
    question: 'Preciso me cadastrar para usar os cupons?',
    answer: 'Não é necessário cadastro para visualizar e usar os cupons. Basta acessar o site, escolher o cupom e apresentar no estabelecimento.'
  },
  {
    category: 'usuarios',
    question: 'Posso usar o mesmo cupom mais de uma vez?',
    answer: 'Depende das regras de cada estabelecimento. Verifique os termos de uso do cupom ou consulte diretamente com o parceiro.'
  },
  
  // GERAL
  {
    category: 'geral',
    question: 'O que é o MarajoaraON?',
    answer: 'O MarajoaraON é uma plataforma digital que conecta moradores e visitantes do bairro Jardim Marajoara aos melhores comércios e serviços locais, oferecendo cupons exclusivos de desconto.'
  },
  {
    category: 'geral',
    question: 'Como faço para entrar em contato?',
    answer: 'Você pode entrar em contato conosco através das nossas redes sociais (Instagram e TikTok) ou enviando um email para contato@jardimmarajoara.com.br'
  },
  {
    category: 'geral',
    question: 'Vocês atendem outros bairros?',
    answer: 'No momento, focamos exclusivamente no bairro Jardim Marajoara em São Paulo. Se houver interesse em expandir para sua região, entre em contato conosco.'
  },
  {
    category: 'geral',
    question: 'Como posso sugerir uma melhoria para o site?',
    answer: 'Adoramos receber feedback! Entre em contato através das nossas redes sociais ou envie um email com sua sugestão. Toda opinião é importante para melhorarmos.'
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'parceiros' | 'usuarios' | 'geral'>('todos')

  const filteredFaqs = selectedCategory === 'todos' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C2227A] to-[#A01860] text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-base md:text-lg text-white/90">
              Encontre respostas para as dúvidas mais comuns sobre o MarajoaraON
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                selectedCategory === 'todos'
                  ? 'bg-[#C2227A] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('parceiros')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                selectedCategory === 'parceiros'
                  ? 'bg-[#C2227A] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Parceiros
            </button>
            <button
              onClick={() => setSelectedCategory('usuarios')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                selectedCategory === 'usuarios'
                  ? 'bg-[#C2227A] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Usuários
            </button>
            <button
              onClick={() => setSelectedCategory('geral')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                selectedCategory === 'geral'
                  ? 'bg-[#C2227A] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Geral
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 text-sm md:text-base flex-1">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-[#C2227A] flex-shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-200',
                      isOpen ? 'max-h-96' : 'max-h-0'
                    )}
                  >
                    <div className="px-4 md:px-6 pb-4 md:pb-5 pt-1">
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base md:text-lg">
                Nenhuma pergunta encontrada nesta categoria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Não encontrou sua resposta?
            </h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Entre em contato conosco através das nossas redes sociais
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://instagram.com/jardimmarajoarasp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm md:text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
                Instagram
              </a>
              <a
                href="https://tiktok.com/@jardimmarajoarasp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm md:text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}