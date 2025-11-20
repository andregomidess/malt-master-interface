import { useMutation, useQueryClient } from '@tanstack/react-query'
import { waterProfilesApi } from '../api/waterProfilesApi'
import type { WaterProfileInput } from '../interfaces/WaterProfile'
import toast from 'react-hot-toast'

export const useSaveWaterProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (waterProfile: WaterProfileInput) =>
      waterProfilesApi.save(waterProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['water-profile'] })
      toast.success('Perfil de água salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar perfil de água')
    },
  })
}
