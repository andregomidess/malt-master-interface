import { useMutation, useQueryClient } from '@tanstack/react-query'
import { beerStylesApi } from '../api/beerStylesApi'
import type { BeerStyleInput } from '../interfaces/BeerStyle'
import toast from 'react-hot-toast'

export const useSaveBeerStyle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (beerStyle: BeerStyleInput) => beerStylesApi.save(beerStyle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beer-styles'] })
      queryClient.invalidateQueries({ queryKey: ['beer-style'] })
      toast.success('Estilo de cerveja salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar estilo de cerveja')
    },
  })
}
