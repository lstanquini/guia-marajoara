'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Verificação simples para teste
    if (email === 'admin@marajoara.com' && password === '123456') {
      localStorage.setItem('user', JSON.stringify({
        email,
        name: 'Administrador',
        role: 'admin'
      }))
      
      router.push('/dashboard')
    } else {
      setError('Email ou senha incorretos')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
          <p className="font-semibold">Conta de teste:</p>
          <p>Email: admin@marajoara.com</p>
          <p>Senha: 123456</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded focus:outline-none focus:border-blue-500"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded focus:outline-none focus:border-blue-500"
            required
            disabled={loading}
          />
          
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-3 bg-[#C2227A] text-white rounded hover:bg-[#a01862] disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}