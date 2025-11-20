import { useQuery } from '@tanstack/react-query'
import { fermentationProfilesApi } from '../api/fermentationProfilesApi'
import { FermentationProfile } from '../interfaces/FermentationProfile'

export const useFermentationProfiles = () => {
  return useQuery({
    queryKey: ['fermentation-profiles'],
    queryFn: async () => {
      const allProfiles = await fermentationProfilesApi.findAll()
      const publicProfiles = await fermentationProfilesApi.findPublic()
      // Combinar perfis únicos
      const profilesMap = new Map<string, FermentationProfile>()
      allProfiles.forEach(p => profilesMap.set(p.id, p))
      publicProfiles.forEach(p => profilesMap.set(p.id, p))
      return Array.from(profilesMap.values())
    },
  })
}

export const useFermentationProfileById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['fermentation-profile', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do perfil de fermentação não fornecido')
      return await fermentationProfilesApi.findById(id)
    },
    enabled: !!id,
  })
}
