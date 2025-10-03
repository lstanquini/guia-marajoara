'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { DEMO_CREDENTIALS } from '@/lib/mock-auth'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await login(email, password)
    
    if (!success) {
      setError('Email ou senha inválidos')
      setLoading(false)
    }
  }

  const fillDemoCredentials = (type: 'admin' | 'partner' | 'user') => {
    const creds = DEMO_CREDENTIALS[type]
    setEmail(creds.email)
    setPassword(creds.password)
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/cadastro" className="font-medium text-[#C2227A] hover:text-[#7CB342]">
              crie uma nova conta
            </Link>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">Contas de Demonstração:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('partner')}
              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
            >
              Parceiro (Pizza)
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('user')}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200"
            >
              Cliente
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A] focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A] focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#C2227A] hover:bg-[#7CB342] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2227A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}