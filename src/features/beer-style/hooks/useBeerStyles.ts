import { useQuery } from '@tanstack/react-query'
import { beerStylesApi } from '../api/beerStylesApi'
import type { BeerStyleQueryParams } from '../interfaces/BeerStyle'
import { BeerStyleSortBy, SortOrder } from '../interfaces/BeerStyle'
import { useMemo } from 'react'

export const useBeerStylesPaginated = (
  page: number,
  params?: Omit<BeerStyleQueryParams, 'page'>,
) => {
  return useQuery({
    queryKey: ['beer-styles', 'paginated', page, params] as const,
    queryFn: async () => {
      const result = await beerStylesApi.findAllPaginated({
        ...params,
        page,
      })
      return result
    },
  })
}

export const useBeerStylesList = (
  page: number,
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

  const query = useBeerStylesPaginated(page, queryParams)

  return {
    beerStyles: query.data?.data || [],
    total: query.data?.total || 0,
    currentPage: query.data?.page || 1,
    totalPages: query.data?.totalPages || 1,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export const useBeerStylesAll = () => {
  const query = useQuery({
    queryKey: ['beer-styles', 'all'] as const,
    queryFn: async () => {
      return await beerStylesApi.findAll()
    },
  })

  return {
    beerStyles: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
