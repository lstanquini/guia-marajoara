'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { mockCoupons } from '@/lib/mock-data'

export default function CuponsPage() {
  // Pegamos o usuário e o estado de carregamento do hook
  const { user, loading } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Se ainda estiver carregando, mostramos uma mensagem
  if (loading) {
    return <div>Carregando seus cupons...</div>
  }

  // Se o usuário não for um parceiro, mostramos um aviso
  if (user?.role !== 'partner') {
    return <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">Esta área é exclusiva para parceiros.</div>
  }
  
  // Filtrar cupons do parceiro
  const myCoupons = mockCoupons.filter(c => c.businessId === user?.businessId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Cupons</h1>
          <p className="text-gray-500 mt-1">Gerencie seus cupons e promoções</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#C2227A] text-white rounded-lg hover:bg-[#A11860] transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          <span>Novo Cupom</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Cupons Ativos</p>
          <p className="text-2xl font-bold text-gray-900">{myCoupons.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Total Resgates</p>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Taxa de Conversão</p>
          <p className="text-2xl font-bold text-gray-900">8.3%</p>
        </div>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-gray-900">Lista de Cupons</h2>
        </div>
        <div className="divide-y">
          {myCoupons.length > 0 ? myCoupons.map(coupon => (
            <div key={coupon.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{coupon.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center px-3 py-1 bg-[#C2227A] text-white text-sm rounded-full">
                      {coupon.code}
                    </span>
                    <span className="text-green-600 font-semibold">{coupon.discount}</span>
                    <span className="text-gray-500 text-sm">Válido até {coupon.validUntil}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                    <span>👁️ 234 visualizações</span>
                    <span>🎫 12 resgates</span>
                    <span>📊 5.1% conversão</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">✏️</button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">🗑️</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-6 text-center text-gray-500">
              <p>Você ainda não criou nenhum cupom.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Criar Novo Cupom</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
            </div>
            <p className="text-gray-600 mb-4">Esta funcionalidade ainda está em desenvolvimento.</p>
            <div className="text-right">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
