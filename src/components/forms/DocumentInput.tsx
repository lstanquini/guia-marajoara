'use client'

import { useState, useEffect } from 'react'
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { validateDocument, formatDocument } from '@/lib/validators/document'

interface DocumentInputProps {
  value: string
  onChange: (value: string, isValid: boolean, type: 'CPF' | 'CNPJ' | null) => void
  onCheckDuplicate?: (document: string) => Promise<boolean>
  disabled?: boolean
  required?: boolean
}

export function DocumentInput({ 
  value, 
  onChange, 
  onCheckDuplicate,
  disabled = false,
  required = false 
}: DocumentInputProps) {
  const [validation, setValidation] = useState<{
    valid: boolean
    type: 'CPF' | 'CNPJ' | null
    message: string
    checking: boolean
    duplicate: boolean
  }>({
    valid: false,
    type: null,
    message: '',
    checking: false,
    duplicate: false
  })

  useEffect(() => {
    const checkDocument = async () => {
      // Se vazio, resetar validação
      if (!value) {
        setValidation({
          valid: false,
          type: null,
          message: '',
          checking: false,
          duplicate: false
        })
        onChange('', false, null)
        return
      }

      const result = validateDocument(value)

      // Se ainda está digitando (menos de 11 dígitos), não validar
      if (result.clean.length < 11) {
        setValidation({
          valid: false,
          type: null,
          message: '',
          checking: false,
          duplicate: false
        })
        return
      }

      // Validar formato
      if (!result.valid && result.clean.length >= 11) {
        setValidation({
          valid: false,
          type: result.type,
          message: `${result.type || 'Documento'} inválido`,
          checking: false,
          duplicate: false
        })
        onChange(result.clean, false, result.type)
        return
      }

      // Se válido E tem função de verificar duplicidade
      if (result.valid && onCheckDuplicate) {
        setValidation(prev => ({ ...prev, checking: true, message: 'Verificando...' }))
        
        try {
          const isDuplicate = await onCheckDuplicate(result.clean)
          
          setValidation({
            valid: !isDuplicate,
            type: result.type,
            message: isDuplicate 
              ? `Este ${result.type} já está cadastrado` 
              : `${result.type} válido`,
            checking: false,
            duplicate: isDuplicate
          })
          
          onChange(result.clean, !isDuplicate, result.type)
        } catch (error) {
          console.error('Erro ao verificar duplicidade:', error)
          setValidation({
            valid: true,
            type: result.type,
            message: `${result.type} válido`,
            checking: false,
            duplicate: false
          })
          onChange(result.clean, true, result.type)
        }
        return
      }

      // Se válido mas SEM função de duplicidade
      if (result.valid) {
        setValidation({
          valid: true,
          type: result.type,
          message: `${result.type} válido`,
          checking: false,
          duplicate: false
        })
        onChange(result.clean, true, result.type)
      }
    }

    // Debounce: espera 500ms após parar de digitar
    const timer = setTimeout(checkDocument, 500)
    return () => clearTimeout(timer)
  }, [value, onCheckDuplicate]) // onChange removido para evitar loop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value)
    // Atualiza apenas o valor, a validação acontece no useEffect
    setValidation(prev => ({ ...prev, message: '' }))
    onChange(formatted, false, null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        CPF ou CNPJ {!required && '(opcional)'}
      </label>
      
      <div className="relative">
        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
            validation.checking
              ? 'border-gray-300 focus:ring-blue-300'
              : validation.valid
              ? 'border-green-300 focus:ring-green-300'
              : value && validation.message
              ? 'border-red-300 focus:ring-red-300'
              : 'border-gray-300 focus:ring-[#C2227A]'
          }`}
          placeholder="000.000.000-00 ou 00.000.000/0001-00"
          maxLength={18}
        />
        
        {/* Ícone de status */}
        <div className="absolute right-3 top-3">
          {validation.checking && (
            <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full" />
          )}
          {!validation.checking && validation.valid && value && (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          {!validation.checking && !validation.valid && value && validation.message && (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
      </div>
      
      {/* Mensagens */}
      {validation.checking && (
        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          Verificando documento...
        </p>
      )}
      
      {!validation.checking && validation.message && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${
          validation.valid ? 'text-green-600' : 'text-red-600'
        }`}>
          {validation.valid ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {validation.message}
        </p>
      )}
      
      {!value && !validation.message && (
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          Não é obrigatório agora, mas agiliza a aprovação
        </p>
      )}
    </div>
  )
}