'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      console.error('Erro ao solicitar reset:', err)
      setError(err.message || 'Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email Enviado!
              </h2>
              <p className="text-gray-600 mb-6">
                Enviamos um link de recuperação para <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Verifique sua caixa de entrada e spam. O link expira em 1 hora.
              </p>
              <Link
                href="/login"
                className="inline-block w-full text-center px-6 py-3 bg-[#C2227A] text-white rounded-lg font-medium hover:bg-[#A01860]"
              >
                Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Esqueceu sua senha?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu email para receber um link de recuperação
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email cadastrado
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C2227A] focus:border-[#C2227A]"
              placeholder="seu@email.com"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C2227A] hover:bg-[#A01860] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2227A] disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-[#C2227A] hover:text-[#A01860]">
              ← Voltar ao Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
