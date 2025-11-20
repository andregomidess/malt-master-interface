import { useState } from 'react'
import { tastingNotesApi } from '../api/tastingNotesApi'
import { useQueryClient } from '@tanstack/react-query'

interface UseDeleteTastingNoteResult {
  deleteNote: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteTastingNote = (): UseDeleteTastingNoteResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const deleteNote = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await tastingNotesApi.delete(id)
      // Invalidar a query para refetch
      await queryClient.invalidateQueries({ queryKey: ['tasting-notes'] })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Erro ao deletar avaliação'),
      )
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteNote,
    isDeleting,
    error,
  }
}
