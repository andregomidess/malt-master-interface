import { useQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { fermentationProfilesApi } from '../api/fermentationProfilesApi'
import { FermentationProfile } from '../interfaces/FermentationProfile'
import type { LoadOptionsResult } from '../../recipes/components/Select'

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

export const useFermentationProfilesLoadOptions = () => {
  const cacheRef = useRef<FermentationProfile[] | null>(null)

  return useCallback(
    async ({
      search,
      page,
    }: {
      search: string
      page: number
    }): Promise<LoadOptionsResult> => {
      if (!cacheRef.current) {
        const [all, pub] = await Promise.all([
          fermentationProfilesApi.findAll(),
          fermentationProfilesApi.findPublic(),
        ])
        const map = new Map<string, FermentationProfile>()
        all.forEach(p => map.set(p.id, p))
        pub.forEach(p => map.set(p.id, p))
        cacheRef.current = Array.from(map.values()).sort((a, b) =>
          a.name.localeCompare(b.name),
        )
      }
      const filtered = search
        ? cacheRef.current.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase().trim()),
          )
        : cacheRef.current
      const take = 20
      const start = (page - 1) * take
      const options = filtered.slice(start, start + take).map(p => ({
        value: p.id,
        label: p.name,
      }))
      return {
        options,
        hasMore: start + take < filtered.length,
      }
    },
    [],
  )
}
