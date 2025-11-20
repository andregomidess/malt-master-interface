import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tastingNotesApi } from '../api/tastingNotesApi'
import type { TastingNoteInput } from '../interfaces/TastingNote'
import toast from 'react-hot-toast'

export const useSaveTastingNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tastingNote: TastingNoteInput) =>
      tastingNotesApi.save(tastingNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasting-notes'] })
      queryClient.invalidateQueries({ queryKey: ['tasting-note'] })
      queryClient.invalidateQueries({ queryKey: ['tasting-note-stats'] })
      toast.success('Avaliação salva com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar avaliação')
    },
  })
}
