import { useState } from 'react'

interface UseDeleteTastingNoteResult {
  deleteNote: (id: string) => Promise<void>
  isDeleting: boolean
  error: Error | null
}

export const useDeleteTastingNote = (): UseDeleteTastingNoteResult => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error] = useState<Error | null>(null)

  const deleteNote = async (id: string) => {
    setIsDeleting(true)
    // Simula um delay de deleção
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Deletando avaliação:', id)
    setIsDeleting(false)
  }

  return {
    deleteNote,
    isDeleting,
    error,
  }
}
