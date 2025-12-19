import { useSuspenseQuery } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import type { PaginatedResponse } from '../../../shared/interfaces/api/common'
import type { BatchApi } from '../../../shared/interfaces/api/batch'

export function useRecentBatches(limit = 5) {
  return useSuspenseQuery({
    queryKey: ['recentBatches', limit],
    queryFn: async () => {
      const { data } = await maltMasterApi.get<
        PaginatedResponse<BatchApi, 'data'>
      >('/batches', { params: { page: 1, take: limit } })
      return data
    },
  })
}
