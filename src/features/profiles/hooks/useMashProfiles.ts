import { useQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { mashProfilesApi } from '../api/mashProfilesApi'
import { MashProfile } from '../interfaces/MashProfile'
import type { LoadOptionsResult } from '../../recipes/components/Select'

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

export const useMashProfilesLoadOptions = () => {
  const cacheRef = useRef<MashProfile[] | null>(null)

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
          mashProfilesApi.findAll(),
          mashProfilesApi.findPublic(),
        ])
        const map = new Map<string, MashProfile>()
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
