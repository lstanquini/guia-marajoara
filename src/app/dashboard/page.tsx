'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  name: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) return <div>Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bem-vindo, {user.name}!</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Tipo: {user.role}</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold">Empresas</h3>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold">Cupons Ativos</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-semibold">Usuários</h3>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
          
          <div className="mt-6">
            <a href="/" className="text-blue-600 hover:underline">
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
