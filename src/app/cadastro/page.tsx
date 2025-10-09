'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Info, Building2, User, Mail, Phone, Tag, CheckCircle, AlertCircle } from 'lucide-react'
import { DocumentInput } from '@/components/forms/DocumentInput'

interface Category {
  id: string
  name: string
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [formData, setFormData] = useState({
    responsible_name: '',
    responsible_email: '',
    responsible_phone: '',
    name: '',
    category_sub: '',
    cpf_cnpj: '',
    document_type: null as 'CPF' | 'CNPJ' | null
  })

  const [documentValid, setDocumentValid] = useState(false)

  // Carregar categorias
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')
      
      if (data) {
        setCategories(data)
      }
      setLoadingCategories(false)
    }
    
    loadCategories()
  }, [supabase])

  // Formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  // Verificar se email já existe
  const checkDuplicateEmail = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('responsible_email', email.toLowerCase().trim())
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar email:', error)
        return false
      }

      return !!data
    } catch (err) {
      console.error('Erro:', err)
      return false
    }
  }

  // Verificar se CPF/CNPJ já existe
  const checkDuplicateDocument = async (document: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('cpf_cnpj', document)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar documento:', error)
        return false
      }

      return !!data
    } catch (err) {
      console.error('Erro:', err)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validar email
      const emailExists = await checkDuplicateEmail(formData.responsible_email)
      if (emailExists) {
        setError('Este email já está cadastrado')
        setLoading(false)
        return
      }

      // Validar CPF/CNPJ se foi preenchido
      if (formData.cpf_cnpj && !documentValid) {
        setError('CPF/CNPJ inválido ou já cadastrado')
        setLoading(false)
        return
      }

      // Gerar slug único
      const baseSlug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Verificar se slug já existe
      const { data: existingBusiness } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', baseSlug)
        .single()

      const finalSlug = existingBusiness 
        ? `${baseSlug}-${Date.now()}` 
        : baseSlug

      // Inserir empresa
      const { error: insertError } = await supabase
        .from('businesses')
        .insert({
          // Dados do responsável
          responsible_name: formData.responsible_name.trim(),
          responsible_email: formData.responsible_email.toLowerCase().trim(),
          responsible_phone: formData.responsible_phone.replace(/\D/g, ''),
          
          // Dados da empresa
          name: formData.name.trim(),
          slug: finalSlug,
          category_main: formData.category_sub,
          category_sub: formData.category_sub,
          
          // CPF/CNPJ (opcional)
          cpf_cnpj: formData.cpf_cnpj || null,
          document_type: formData.document_type || null,
          
          // Status inicial
          status: 'pending',
          profile_complete: false,
          
          // Valores padrão
          plan_type: 'basic',
          max_coupons: 3,
          max_photos: 3,
          delivery: false,
          rating: 0,
          total_reviews: 0,
          city: 'São Paulo',
          state: 'SP'
        })

      if (insertError) {
        console.error('Erro ao cadastrar:', insertError)
        
        if (insertError.code === '23505') {
          if (insertError.message.includes('responsible_email')) {
            setError('Este email já está cadastrado')
          } else {
            setError('Já existe um cadastro com estes dados')
          }
        } else {
          setError('Erro ao cadastrar empresa. Tente novamente.')
        }
        setLoading(false)
        return
      }

      // Sucesso!
      setSuccess(true)
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao cadastrar empresa')
      setLoading(false)
    }
  }

  // Tela de sucesso
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cadastro Enviado!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Seu cadastro foi enviado com sucesso e está aguardando aprovação.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Você receberá um email</strong> com suas credenciais de acesso assim que for aprovado pela nossa equipe.
            </p>
          </div>
          
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] transition-colors font-medium"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    )
  }

  // Formulário
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Voltar
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Cadastre sua Empresa
        </h1>
        <p className="text-gray-600">
          Preencha os dados abaixo para começar. Após aprovação, você poderá completar o cadastro com endereço, fotos e cupons.
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 space-y-6">
        
        {/* Seção 1: Dados do Responsável */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#C2227A]" />
            <h2 className="text-lg font-bold text-gray-900">Seus Dados</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Estes dados serão usados para criar seu acesso ao sistema
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.responsible_name}
                onChange={(e) => setFormData(prev => ({ ...prev, responsible_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                placeholder="Seu nome completo"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.responsible_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsible_email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Este será seu email de login
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone/WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.responsible_phone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    responsible_phone: formatPhone(e.target.value) 
                  }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seção 2: Dados da Empresa */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[#C2227A]" />
            <h2 className="text-lg font-bold text-gray-900">Dados da Empresa</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent"
                placeholder="Nome da sua empresa"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  required
                  value={formData.category_sub}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_sub: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent appearance-none bg-white"
                  disabled={loadingCategories || loading}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Escolha a categoria que melhor representa seu negócio
              </p>
            </div>

            <DocumentInput
              value={formData.cpf_cnpj}
              onChange={(value, isValid, type) => {
                setFormData(prev => ({ 
                  ...prev, 
                  cpf_cnpj: value,
                  document_type: type
                }))
                setDocumentValid(isValid)
              }}
              onCheckDuplicate={checkDuplicateDocument}
              disabled={loading}
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            O que acontece depois?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Sua empresa será analisada pela nossa equipe</li>
            <li>✓ Você receberá um email com suas credenciais de acesso</li>
            <li>✓ Poderá completar o cadastro com endereço, fotos e cupons</li>
          </ul>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar Cadastro'}
          </button>
        </div>

        <p className="text-xs text-center text-gray-500">
          Ao cadastrar, você concorda com nossos{' '}
          <Link href="/termos" className="text-[#C2227A] hover:underline">
            Termos de Uso
          </Link>
        </p>
      </form>
    </div>
  )
}