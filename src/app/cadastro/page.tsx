'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { mockBusinesses } from '@/lib/mock-data'

function AuthRedirecting({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">{message}</p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isPartner: false,
    businessId: ''
  })
  const [error, setError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const router = useRouter()

  const { register, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [loading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) return setError('As senhas não coincidem')
    if (formData.password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres')
    if (formData.isPartner && !formData.businessId) return setError('Por favor, selecione seu negócio.')

    setFormLoading(true)
    const result = await register(
      formData.email,
      formData.password,
      formData.name,
      formData.isPartner ? formData.businessId : undefined
    )
    if (!result.success) {
      setError(result.error || 'Não foi possível criar a conta.')
      setFormLoading(false)
    }
  }

  if (loading) {
    return <AuthRedirecting message="Verificando sessão..." />
  }

  if (isAuthenticated) {
    return <AuthRedirecting message="Você já está logado. Redirecionando..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/login" className="font-medium text-[#C2227A] hover:text-[#7CB342]">
              faça login se já tem uma conta
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* ... o resto do seu formulário permanece igual ... */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A] sm:text-sm"
                placeholder="João Silva"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A] sm:text-sm"
                placeholder="joao@email.com"/>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.isPartner} onChange={(e) => setFormData({ ...formData, isPartner: e.target.checked, businessId: '' })}
                  className="h-4 w-4 text-[#C2227A] focus:ring-[#C2227A] border-gray-300 rounded"/>
                <span className="ml-2 text-sm font-medium text-gray-700">Sou parceiro (tenho um negócio)</span>
              </label>
              {formData.isPartner && (
                <div className="mt-3">
                  <label htmlFor="business" className="block text-sm font-medium text-gray-700">Selecione seu negócio</label>
                  <select id="business" value={formData.businessId} onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A] sm:text-sm"
                    required={formData.isPartner}>
                    <option value="">Selecione...</option>
                    {mockBusinesses.map(business => (<option key={business.id} value={business.id}>{business.name}</option>))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input id="password" name="password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A] sm:text-sm"
                placeholder="Mínimo 6 caracteres"/>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar senha</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#C2227A] focus:border-[#C2227A] sm:text-sm"
                placeholder="Digite a senha novamente"/>
            </div>
          </div>
          {error && (<div className="rounded-md bg-red-50 p-4"><p className="text-sm text-red-800">{error}</p></div>)}
          <div>
            <button type="submit" disabled={formLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#C2227A] hover:bg-[#7CB342] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2227A] disabled:opacity-50">
              {formLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}