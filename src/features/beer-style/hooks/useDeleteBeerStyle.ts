import { useState } from 'react'

interface UseDeleteBeerStyleResult {
  deleteStyle: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteBeerStyle = (): UseDeleteBeerStyleResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error] = useState<Error | null>(null)

  const deleteStyle = async (id: string) => {
    setIsDeleting(true)
    // Simula um delay de deleção
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Deletando estilo:', id)
    setIsDeleting(false)
  }

  return {
    deleteStyle,
    isDeleting,
    error,
  }
}

