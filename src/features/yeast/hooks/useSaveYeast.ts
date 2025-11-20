import { useMutation, useQueryClient } from '@tanstack/react-query'
import { yeastsApi } from '../api/yeastsApi'
import type { YeastInput } from '../interfaces/Yeast'
import toast from 'react-hot-toast'

export const useSaveYeast = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (yeast: YeastInput) => yeastsApi.save(yeast),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yeasts'] })
      queryClient.invalidateQueries({ queryKey: ['yeast'] })
      toast.success('Levedura salva com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar levedura')
    },
  })
}
