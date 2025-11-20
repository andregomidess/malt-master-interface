import { useState } from 'react'
import { hopsApi } from '../api/hopsApi'
import { useQueryClient } from '@tanstack/react-query'

interface UseDeleteHopResult {
  deleteHop: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteHop = (): UseDeleteHopResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const deleteHop = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await hopsApi.delete(id)
      // Invalidar a query para refetch
      await queryClient.invalidateQueries({ queryKey: ['hops'] })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao deletar lúpulo'))
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteHop,
    isDeleting,
    error,
  }
}
