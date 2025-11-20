import { useState } from 'react'
import { recipesApi } from '../api/recipesApi'
import { useQueryClient } from '@tanstack/react-query'

interface UseDeleteRecipeResult {
  deleteRecipe: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteRecipe = (): UseDeleteRecipeResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const deleteRecipe = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await recipesApi.delete(id)
      await queryClient.invalidateQueries({ queryKey: ['recipes'] })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Erro ao deletar receita'),
      )
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteRecipe,
    isDeleting,
    error,
  }
}
