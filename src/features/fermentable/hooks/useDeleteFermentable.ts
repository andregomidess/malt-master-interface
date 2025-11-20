import { useState } from 'react'
import { fermentablesApi } from '../api/fermentablesApi'
import { useQueryClient } from '@tanstack/react-query'

interface UseDeleteFermentableResult {
  deleteFermentable: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteFermentable = (): UseDeleteFermentableResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const deleteFermentable = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await fermentablesApi.delete(id)
      // Invalidar a query para refetch
      await queryClient.invalidateQueries({ queryKey: ['fermentables'] })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Erro ao deletar fermentável'),
      )
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteFermentable,
    isDeleting,
    error,
  }
}
