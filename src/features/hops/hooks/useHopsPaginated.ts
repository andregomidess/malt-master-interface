import { useQuery } from '@tanstack/react-query'
import { hopsApi } from '../api/hopsApi'
import type { HopQueryParams } from '../interfaces/Hop'
import { HopSortBy, SortOrder } from '../interfaces/Hop'
import { useMemo } from 'react'
import { addPublicFlag, HopWithPublicFlag } from '../interfaces/Hop'

export const useHopsPaginated = (
  page: number,
  searchQuery?: string,
  sortBy?: HopSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo<HopQueryParams>(
    () => ({
      page,
      search: searchQuery || undefined,
      sortBy: sortBy || HopSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [page, searchQuery, sortBy, order],
  )

  return useQuery({
    queryKey: ['hops', 'paginated', queryParams] as const,
    queryFn: async () => {
      const result = await hopsApi.findAllPaginated(queryParams)
      return {
        ...result,
        data: result.data.map(addPublicFlag) as HopWithPublicFlag[],
      }
    },
  })
}
