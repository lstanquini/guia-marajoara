/**
 * Valida CPF
 * @param cpf - CPF apenas números (11 dígitos)
 * @returns true se válido
 */
export function isValidCPF(cpf: string): boolean {
  // Remove formatação
  const numbers = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(numbers)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(numbers.charAt(9))) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(numbers.charAt(10))) return false
  
  return true
}

/**
 * Valida CNPJ
 * @param cnpj - CNPJ apenas números (14 dígitos)
 * @returns true se válido
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove formatação
  const numbers = cnpj.replace(/\D/g, '')
  
  // Verifica se tem 14 dígitos
  if (numbers.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(numbers)) return false
  
  // Validação do primeiro dígito verificador
  let size = numbers.length - 2
  let digits = numbers.substring(0, size)
  const firstDigit = numbers.substring(size)
  let sum = 0
  let pos = size - 7
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(digits.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(firstDigit.charAt(0))) return false
  
  // Validação do segundo dígito verificador
  size = size + 1
  digits = numbers.substring(0, size)
  sum = 0
  pos = size - 7
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(digits.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(firstDigit.charAt(1))) return false
  
  return true
}

/**
 * Valida CPF ou CNPJ automaticamente
 * @param document - CPF ou CNPJ (com ou sem formatação)
 * @returns { valid: boolean, type: 'CPF' | 'CNPJ' | null, formatted: string }
 */
export function validateDocument(document: string) {
  const numbers = document.replace(/\D/g, '')
  
  if (numbers.length === 11) {
    return {
      valid: isValidCPF(numbers),
      type: 'CPF' as const,
      formatted: formatCPF(numbers),
      clean: numbers
    }
  }
  
  if (numbers.length === 14) {
    return {
      valid: isValidCNPJ(numbers),
      type: 'CNPJ' as const,
      formatted: formatCNPJ(numbers),
      clean: numbers
    }
  }
  
  return {
    valid: false,
    type: null,
    formatted: document,
    clean: numbers
  }
}

/**
 * Formata CPF
 * @param cpf - CPF apenas números
 * @returns CPF formatado (000.000.000-00)
 */
export function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, '')
  return numbers
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

/**
 * Formata CNPJ
 * @param cnpj - CNPJ apenas números
 * @returns CNPJ formatado (00.000.000/0001-00)
 */
export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, '')
  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

/**
 * Formata CPF ou CNPJ automaticamente
 * @param document - CPF ou CNPJ
 * @returns Documento formatado
 */
export function formatDocument(document: string): string {
  const numbers = document.replace(/\D/g, '')
  
  if (numbers.length <= 11) {
    return formatCPF(numbers)
  }
  
  return formatCNPJ(numbers)
}