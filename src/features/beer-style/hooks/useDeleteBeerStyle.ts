import { useState } from 'react'
import { beerStylesApi } from '../api/beerStylesApi'
import { useQueryClient } from '@tanstack/react-query'

interface UseDeleteBeerStyleResult {
  deleteStyle: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteBeerStyle = (): UseDeleteBeerStyleResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const deleteStyle = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await beerStylesApi.delete(id)
      // Invalidar a query para refetch
      await queryClient.invalidateQueries({ queryKey: ['beer-styles'] })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao deletar estilo'))
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteStyle,
    isDeleting,
    error,
  }
}
