'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      // Testa buscar categorias
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index')
      
      if (error) throw error
      
      // Testa a função de busca
      const { data: searchResult } = await supabase
        .rpc('search_businesses', { search_query: 'pizza' })
      
      setData({ categories, searchResult })
      setStatus('success')
    } catch (err: any) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Teste de Conexão Supabase</h1>
        
        {status === 'loading' && (
          <p className="text-gray-600">Testando conexão...</p>
        )}
        
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-2">Erro:</p>
            <code className="text-sm text-red-600">{error}</code>
          </div>
        )}
        
        {status === 'success' && data && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">✓ Conectado com sucesso!</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Categorias ({data.categories?.length})</h2>
              <div className="grid grid-cols-2 gap-2">
                {data.categories?.map((cat: any) => (
                  <div key={cat.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-2xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Busca por "pizza"</h2>
              {data.searchResult && data.searchResult.length > 0 ? (
                <div className="space-y-2">
                  {data.searchResult.map((business: any) => (
                    <div key={business.id} className="p-3 bg-gray-50 rounded">
                      <p className="font-semibold">{business.name}</p>
                      <p className="text-sm text-gray-600">{business.category_sub}</p>
                      <p className="text-xs text-gray-500">Relevância: {business.relevance.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum resultado</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}