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
  const [textValue, setTextValue] = useState(value?.toString() || '')
  const isTypingRef = useRef(false)

  useEffect(() => {
    if (!isTypingRef.current) {
      const currentText = value?.toString() || ''
      if (value === undefined || value === null) {
        setTextValue('')
      } else {
        setTextValue(currentText)
      }
    }
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

    // Valida formato numérico
    const decimalRegex = /^-?\d*\.?\d*$/
    if (!decimalRegex.test(normalized)) {
      return
    }

    // Se termina com ponto, mantém o número antes
    if (normalized.endsWith('.')) {
      const beforeDot = normalized.slice(0, -1)
      if (beforeDot === '' || beforeDot === '-') {
        return
      }
      const num = parseFloat(beforeDot)
      if (!isNaN(num)) {
        onChange(num)
      }
      return
    }

    // Converte para número
    const num = parseFloat(normalized)
    if (!isNaN(num)) {
      onChange(num)
    } else {
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
