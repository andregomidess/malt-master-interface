import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { hopsApi } from '../api/hopsApi'
import type { HopQueryParams } from '../interfaces/Hop'
import { HopSortBy, SortOrder } from '../interfaces/Hop'
import type { LoadOptionsResult } from '../../recipes/components/Select'
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

export const useHopsLoadOptions = () => {
  return useCallback(
    async ({
      search,
      page,
    }: {
      search: string
      page: number
    }): Promise<LoadOptionsResult> => {
      const result = await hopsApi.findAllPaginated({
        search: search || undefined,
        page,
        take: 20,
        sortBy: HopSortBy.NAME,
        order: SortOrder.ASC,
      })
      return {
        options: result.data.map(h => ({
          value: h.id,
          label: h.name,
        })),
        hasMore: result.page < result.totalPages,
      }
    },
    [],
  )
}
