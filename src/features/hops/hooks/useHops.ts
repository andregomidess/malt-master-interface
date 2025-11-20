import { useInfiniteQuery } from '@tanstack/react-query'
import { hopsApi } from '../api/hopsApi'
import type { HopQueryParams } from '../interfaces/Hop'
import { HopSortBy, SortOrder } from '../interfaces/Hop'
import { useMemo } from 'react'
import { addPublicFlag, HopWithPublicFlag } from '../interfaces/Hop'

interface PaginatedResult {
  data: HopWithPublicFlag[]
  total: number
  page: number
  totalPages: number
}

export const useHops = (params?: Omit<HopQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['hops', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await hopsApi.findAllPaginated({
        ...params,
        page: pageParam,
      })
      return {
        ...result,
        data: result.data.map(addPublicFlag) as HopWithPublicFlag[],
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResult) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
  })
}

export const useHopsList = (
  searchQuery?: string,
  sortBy?: HopSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      sortBy: sortBy || HopSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [searchQuery, sortBy, order],
  )

  const query = useHops(queryParams)

  const hops = useMemo(() => {
    if (!query.data?.pages) return []
    return query.data.pages.flatMap(page => page.data)
  }, [query.data])

  return {
    ...query,
    hops,
  }
}
