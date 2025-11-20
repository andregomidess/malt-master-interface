import { useQuery } from '@tanstack/react-query'
import { tastingNotesApi } from '../api/tastingNotesApi'
import type { TastingNote } from '../interfaces/TastingNote'

export const useTastingNoteById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tasting-note', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da avaliação não fornecido')
      const tastingNote = await tastingNotesApi.findById(id)
      return tastingNote as TastingNote
    },
    enabled: !!id,
  })
}
