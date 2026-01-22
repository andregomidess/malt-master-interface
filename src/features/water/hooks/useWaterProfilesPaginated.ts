import { useQuery } from '@tanstack/react-query'
import { waterProfilesApi } from '../api/waterProfilesApi'
import type { WaterProfileQueryParams } from '../interfaces/WaterProfile'
import { WaterProfileSortBy, SortOrder } from '../interfaces/WaterProfile'
import { useMemo } from 'react'

export const useWaterProfilesPaginated = (
  page: number,
  searchQuery?: string,
  sortBy?: WaterProfileSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo<WaterProfileQueryParams>(
    () => ({
      page,
      search: searchQuery || undefined,
      sortBy: sortBy || WaterProfileSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [page, searchQuery, sortBy, order],
  )

  return useQuery({
    queryKey: ['water-profiles', 'paginated', queryParams] as const,
    queryFn: async () => {
      return await waterProfilesApi.findAllPaginated(queryParams)
    },
  })
}
