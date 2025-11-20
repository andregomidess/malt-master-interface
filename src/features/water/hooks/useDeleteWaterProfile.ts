import { useState } from 'react'
import { waterProfilesApi } from '../api/waterProfilesApi'
import { useQueryClient } from '@tanstack/react-query'

interface UseDeleteWaterProfileResult {
  deleteWaterProfile: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteWaterProfile = (): UseDeleteWaterProfileResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const deleteWaterProfile = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await waterProfilesApi.delete(id)
      // Invalidar a query para refetch
      await queryClient.invalidateQueries({ queryKey: ['water-profiles'] })
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Erro ao deletar perfil de água'),
      )
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteWaterProfile,
    isDeleting,
    error,
  }
}
