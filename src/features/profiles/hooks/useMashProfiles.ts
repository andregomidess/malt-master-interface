import { useQuery } from '@tanstack/react-query'
import { mashProfilesApi } from '../api/mashProfilesApi'
import { MashProfile } from '../interfaces/MashProfile'

export const useMashProfiles = () => {
  return useQuery({
    queryKey: ['mash-profiles'],
    queryFn: async () => {
      const allProfiles = await mashProfilesApi.findAll()
      const publicProfiles = await mashProfilesApi.findPublic()
      // Combinar perfis únicos
      const profilesMap = new Map<string, MashProfile>()
      allProfiles.forEach(p => profilesMap.set(p.id, p))
      publicProfiles.forEach(p => profilesMap.set(p.id, p))
      return Array.from(profilesMap.values())
    },
  })
}

export const useMashProfileById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['mash-profile', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do perfil de mash não fornecido')
      return await mashProfilesApi.findById(id)
    },
    enabled: !!id,
  })
}
