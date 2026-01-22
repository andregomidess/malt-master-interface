import { useQuery } from '@tanstack/react-query'
import { yeastsApi } from '../api/yeastsApi'
import type { YeastQueryParams } from '../interfaces/Yeast'
import { YeastSortBy, SortOrder } from '../interfaces/Yeast'
import { useMemo } from 'react'
import { addPublicFlag, YeastWithPublicFlag } from '../interfaces/Yeast'

export const useYeastsPaginated = (
  page: number,
  searchQuery?: string,
  sortBy?: YeastSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo<YeastQueryParams>(
    () => ({
      page,
      search: searchQuery || undefined,
      sortBy: sortBy || YeastSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [page, searchQuery, sortBy, order],
  )

  return useQuery({
    queryKey: ['yeasts', 'paginated', queryParams] as const,
    queryFn: async () => {
      const result = await yeastsApi.findAllPaginated(queryParams)
      return {
        ...result,
        data: result.data.map(addPublicFlag) as YeastWithPublicFlag[],
      }
    },
  })
}
