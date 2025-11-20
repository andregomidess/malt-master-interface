import { useQuery } from '@tanstack/react-query'
import { waterProfilesApi } from '../api/waterProfilesApi'
import type { WaterProfile } from '../interfaces/WaterProfile'

export const useWaterProfileById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['water-profile', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do perfil de água não fornecido')
      const waterProfile = await waterProfilesApi.findById(id)
      return waterProfile as WaterProfile
    },
    enabled: !!id,
  })
}
