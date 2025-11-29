import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  carbonationProfilesApi,
  CarbonationProfileInput,
} from '../api/carbonationProfilesApi'
import toast from 'react-hot-toast'

export const useSaveCarbonationProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profile: CarbonationProfileInput) =>
      carbonationProfilesApi.save(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbonation-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['carbonation-profile'] })
      toast.success('Perfil de carbonatação salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar perfil de carbonatação')
    },
  })
}

