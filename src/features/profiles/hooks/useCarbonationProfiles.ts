import { useQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { carbonationProfilesApi } from '../api/carbonationProfilesApi'
import { CarbonationProfile } from '../interfaces/CarbonationProfile'
import type { LoadOptionsResult } from '../../recipes/components/Select'

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

export const useCarbonationProfilesLoadOptions = () => {
  const cacheRef = useRef<CarbonationProfile[] | null>(null)

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
          carbonationProfilesApi.findAll(),
          carbonationProfilesApi.findPublic(),
        ])
        const map = new Map<string, CarbonationProfile>()
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
