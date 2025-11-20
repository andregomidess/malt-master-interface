import { useQuery } from '@tanstack/react-query'
import { carbonationProfilesApi } from '../api/carbonationProfilesApi'
import { CarbonationProfile } from '../interfaces/CarbonationProfile'

export const useCarbonationProfiles = () => {
  return useQuery({
    queryKey: ['carbonation-profiles'],
    queryFn: async () => {
      const allProfiles = await carbonationProfilesApi.findAll()
      const publicProfiles = await carbonationProfilesApi.findPublic()
      // Combinar perfis únicos
      const profilesMap = new Map<string, CarbonationProfile>()
      allProfiles.forEach(p => profilesMap.set(p.id, p))
      publicProfiles.forEach(p => profilesMap.set(p.id, p))
      return Array.from(profilesMap.values())
    },
  })
}

export const useCarbonationProfileById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['carbonation-profile', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do perfil de carbonatação não fornecido')
      return await carbonationProfilesApi.findById(id)
    },
    enabled: !!id,
  })
}
