import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fermentablesApi } from '../api/fermentablesApi'
import type { FermentableInput } from '../interfaces/Fermentable'
import toast from 'react-hot-toast'

export const useSaveFermentable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fermentable: FermentableInput) =>
      fermentablesApi.save(fermentable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fermentables'] })
      queryClient.invalidateQueries({ queryKey: ['fermentable'] })
      toast.success('Fermentável salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar fermentável')
    },
  })
}
