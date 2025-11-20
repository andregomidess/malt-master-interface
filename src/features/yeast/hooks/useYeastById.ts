import { useQuery } from '@tanstack/react-query'
import { yeastsApi } from '../api/yeastsApi'
import { addPublicFlag } from '../interfaces/Yeast'
import type { YeastWithPublicFlag } from '../interfaces/Yeast'

export const useYeastById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['yeast', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da levedura não fornecido')
      const yeast = await yeastsApi.findById(id)
      return addPublicFlag(yeast) as YeastWithPublicFlag
    },
    enabled: !!id,
  })
}
