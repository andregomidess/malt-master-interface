import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fermentationProfilesApi,
  FermentationProfileInput,
} from '../api/fermentationProfilesApi'
import toast from 'react-hot-toast'

export const useSaveFermentationProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profile: FermentationProfileInput) =>
      fermentationProfilesApi.save(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fermentation-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['fermentation-profile'] })
      toast.success('Perfil de fermentação salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar perfil de fermentação')
    },
  })
}

