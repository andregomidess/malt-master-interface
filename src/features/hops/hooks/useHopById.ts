import { useQuery } from '@tanstack/react-query'
import { hopsApi } from '../api/hopsApi'
import { addPublicFlag } from '../interfaces/Hop'
import type { HopWithPublicFlag } from '../interfaces/Hop'

export const useHopById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['hop', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do lúpulo não fornecido')
      const hop = await hopsApi.findById(id)
      return addPublicFlag(hop) as HopWithPublicFlag
    },
    enabled: !!id,
  })
}
