import { useInfiniteQuery } from '@tanstack/react-query'
import { beerStylesApi } from '../api/beerStylesApi'
import type { BeerStyle, BeerStyleQueryParams } from '../interfaces/BeerStyle'
import { BeerStyleSortBy, SortOrder } from '../interfaces/BeerStyle'
import { useMemo } from 'react'

interface PaginatedResult {
  data: BeerStyle[]
  total: number
  page: number
  totalPages: number
}

export const useBeerStyles = (params?: Omit<BeerStyleQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['beer-styles', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await beerStylesApi.findAllPaginated({
        ...params,
        page: pageParam,
      })
      return result
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResult) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
  })
}

export const useBeerStylesList = (
  searchQuery?: string,
  sortBy?: BeerStyleSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      sortBy: sortBy || BeerStyleSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [searchQuery, sortBy, order],
  )

  const query = useBeerStyles(queryParams)

  const beerStyles = useMemo(() => {
    if (!query.data?.pages) return []
    return query.data.pages.flatMap(page => page.data)
  }, [query.data])

  return {
    ...query,
    beerStyles,
  }
}
