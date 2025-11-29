import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fermentationProfilesApi } from '../api/fermentationProfilesApi'
import toast from 'react-hot-toast'

export const useDeleteFermentationProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fermentationProfilesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fermentation-profiles'] })
      toast.success('Perfil de fermentação excluído com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao excluir perfil de fermentação')
    },
  })
}

