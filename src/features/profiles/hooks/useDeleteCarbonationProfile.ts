import { useMutation, useQueryClient } from '@tanstack/react-query'
import { carbonationProfilesApi } from '../api/carbonationProfilesApi'
import toast from 'react-hot-toast'

export const useDeleteCarbonationProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => carbonationProfilesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbonation-profiles'] })
      toast.success('Perfil de carbonatação excluído com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao excluir perfil de carbonatação')
    },
  })
}

