import { useState } from 'react'
import { yeastsApi } from '../api/yeastsApi'
import { useQueryClient } from '@tanstack/react-query'

interface UseDeleteYeastResult {
  deleteYeast: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteYeast = (): UseDeleteYeastResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const deleteYeast = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await yeastsApi.delete(id)
      // Invalidar a query para refetch
      await queryClient.invalidateQueries({ queryKey: ['yeasts'] })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Erro ao deletar levedura'),
      )
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteYeast,
    isDeleting,
    error,
  }
}
