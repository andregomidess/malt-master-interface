import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hopsApi } from '../api/hopsApi'
import type { HopInput } from '../interfaces/Hop'
import toast from 'react-hot-toast'

export const useSaveHop = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (hop: HopInput) => hopsApi.save(hop),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hops'] })
      queryClient.invalidateQueries({ queryKey: ['hop'] })
      toast.success('Lúpulo salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar lúpulo')
    },
  })
}
