import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { yeastsApi } from '../api/yeastsApi'
import type { YeastQueryParams } from '../interfaces/Yeast'
import { YeastSortBy, SortOrder } from '../interfaces/Yeast'
import type { LoadOptionsResult } from '../../recipes/components/Select'
import { useMemo } from 'react'
import { addPublicFlag, YeastWithPublicFlag } from '../interfaces/Yeast'

interface PaginatedResult {
  data: YeastWithPublicFlag[]
  total: number
  page: number
  totalPages: number
}

export const useYeasts = (params?: Omit<YeastQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['yeasts', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await yeastsApi.findAllPaginated({
        ...params,
        page: pageParam,
      })
      return {
        ...result,
        data: result.data.map(addPublicFlag) as YeastWithPublicFlag[],
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResult) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
  })
}

export const useYeastsList = (
  searchQuery?: string,
  sortBy?: YeastSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      sortBy: sortBy || YeastSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [searchQuery, sortBy, order],
  )

  const query = useYeasts(queryParams)

  const yeasts = useMemo(() => {
    if (!query.data?.pages) return []
    return query.data.pages.flatMap(page => page.data)
  }, [query.data])

  return {
    ...query,
    yeasts,
  }
}

export const useYeastsLoadOptions = () => {
  return useCallback(
    async ({
      search,
      page,
    }: {
      search: string
      page: number
    }): Promise<LoadOptionsResult> => {
      const result = await yeastsApi.findAllPaginated({
        search: search || undefined,
        page,
        take: 20,
        sortBy: YeastSortBy.NAME,
        order: SortOrder.ASC,
      })
      return {
        options: result.data.map(y => ({
          value: y.id,
          label: y.name,
        })),
        hasMore: result.page < result.totalPages,
      }
    },
    [],
  )
}
