'use client'

import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-br from-text-primary via-gray-900 to-text-primary text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10 bg-rosa/10 py-12">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h3 className="text-2xl font-bold md:text-3xl">Receba nossas novidades</h3>
          <p className="mt-3 text-white/70">Fique por dentro dos melhores cupons e ofertas do bairro!</p>
          <form className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
            <Input 
              name="newsletter_email" 
              label="Seu melhor e-mail" 
              type="email" 
              placeholder="Seu melhor e-mail" 
              variant="inverted" 
              required 
            />
            <Button type="submit" variant="secondary" size="md">
              Inscrever
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-4 md:col-span-1">
            <h4 className="text-lg font-bold">Guia Marajoara</h4>
            <p className="text-sm text-white/70">Conectando você aos melhores comércios e serviços do Jardim Marajoara.</p>
            <div className="flex gap-2">
              <a href="#" aria-label="Visite nosso Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-rosa"><p>IG</p></a>
              <a href="#" aria-label="Visite nosso TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-rosa"><p>TT</p></a>
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold uppercase text-white/90">Links Rápidos</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/cadastro" className="text-white/70 hover:text-verde">Cadastre-se</Link></li>
                <li><Link href="/login" className="text-white/70 hover:text-verde">Área do Parceiro</Link></li>
                <li><Link href="/cupons" className="text-white/70 hover:text-verde">Cupons Ativos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold uppercase text-white/90">Categorias</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/categorias/restaurantes" className="text-white/70 hover:text-verde">Restaurantes</Link></li>
                <li><Link href="/categorias/beleza" className="text-white/70 hover:text-verde">Beleza</Link></li>
                <li><Link href="/categorias/pet-shop" className="text-white/70 hover:text-verde">Pet Shop</Link></li>
                <li><Link href="/categorias/saude" className="text-white/70 hover:text-verde">Saúde</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold uppercase text-white/90">Contato</h4>
               <ul className="mt-4 space-y-3 text-sm">
                <li className="text-white/70">comercialfmad@gmail.com</li>
                <li className="text-white/70">(11) 98888-8888</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 text-sm text-white/60 sm:flex-row">
            <p>© 2024 Guia Marajoara. Todos os direitos reservados.</p>
            <div className="flex gap-4">
                <Link href="/termos" className="hover:text-white">Termos de Uso</Link>
                <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
            </div>
        </div>
      </div>
    </footer>
  )
}