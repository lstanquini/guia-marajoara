'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const router = useRouter()

  // Redireciona automaticamente após login bem-sucedido
  useEffect(() => {
    // Se o usuário está logado e já verificamos se é admin
    if (user && !adminLoading) {
      console.log('🔵 Usuário logado, redirecionando...', { isAdmin })
      
      if (isAdmin) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, isAdmin, adminLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(email, password)
      
      if (!result.success) {
        setError(result.error || 'Erro ao fazer login')
        setLoading(false)
      }
      // Se o login foi bem-sucedido, o useEffect acima cuida do redirecionamento
    } catch (err) {
      console.error('Erro no login:', err)
      setError('Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Entrar na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/register" className="font-medium text-[#C2227A] hover:text-[#7CB342]">
              cadastre-se gratuitamente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A]"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A]"
                placeholder="Sua senha"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C2227A] hover:bg-[#7CB342] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2227A] disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}