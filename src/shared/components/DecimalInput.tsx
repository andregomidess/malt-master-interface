import React, { useEffect, useState, useRef } from 'react'
import { InputText } from './InputText'

interface DecimalInputProps {
  label: string
  placeholder: string
  value: number | null | undefined
  onChange: (value: number | undefined) => void
  error?: boolean
  errorMessage?: string
}

export const DecimalInput: React.FC<DecimalInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
}) => {
  const [textValue, setTextValue] = useState(() => {
    if (value === undefined || value === null) return ''
    return value.toString()
  })
  const isTypingRef = useRef(false)

  useEffect(() => {
    if (!isTypingRef.current) {
      if (value === undefined || value === null) {
        setTextValue('')
      } else {
        // Garante que o valor seja exibido corretamente, incluindo 0 e decimais
        const stringValue = value.toString()
        // Só atualiza se o valor realmente mudou e não está sendo digitado
        if (stringValue !== textValue) {
          setTextValue(stringValue)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = (text: string) => {
    isTypingRef.current = true
    const trimmed = text.trim()
    setTextValue(text)

    // Reset flag após um pequeno delay
    setTimeout(() => {
      isTypingRef.current = false
    }, 100)

    if (trimmed === '') {
      onChange(undefined)
      return
    }

    // Normaliza vírgula para ponto
    const normalized = trimmed.replace(',', '.')

    // Valida formato numérico (permite números decimais)
    const decimalRegex = /^-?\d*\.?\d*$/
    if (!decimalRegex.test(normalized)) {
      return
    }

    // Se termina com ponto, não chama onChange ainda
    // Isso permite que o usuário continue digitando após o ponto
    if (normalized.endsWith('.')) {
      const beforeDot = normalized.slice(0, -1)
      if (beforeDot === '' || beforeDot === '-') {
        // Permite digitar apenas o ponto ou ponto após sinal negativo
        // Não atualiza o valor ainda
        return
      }
      // Se já tem números antes do ponto, atualiza com o valor antes do ponto
      // Isso permite que "0." mostre 0 enquanto o usuário digita
      const num = parseFloat(beforeDot)
      if (!isNaN(num)) {
        onChange(num)
      }
      return
    }

    // Converte para número - parseFloat preserva decimais corretamente
    const num = parseFloat(normalized)
    if (!isNaN(num)) {
      onChange(num)
    } else {
      // Se não conseguir converter, mantém undefined
      onChange(undefined)
    }
  }

  return (
    <InputText
      label={label}
      placeholder={placeholder}
      value={textValue}
      onChangeText={handleChange}
      keyboardType="decimal-pad"
      error={error}
      errorMessage={errorMessage}
    />
  )
}
