import { useInfiniteQuery } from '@tanstack/react-query'
import { waterProfilesApi } from '../api/waterProfilesApi'
import type { WaterProfileQueryParams } from '../interfaces/WaterProfile'
import { WaterProfileSortBy, SortOrder } from '../interfaces/WaterProfile'
import { useMemo } from 'react'

export const useWaterProfiles = (
  params?: Omit<WaterProfileQueryParams, 'page'>,
) => {
  return useInfiniteQuery({
    queryKey: ['water-profiles', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await waterProfilesApi.findAllPaginated({
        ...params,
        page: pageParam,
      })
      return result
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
  })
}

export const useWaterProfilesList = (
  searchQuery?: string,
  sortBy?: WaterProfileSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      sortBy: sortBy || WaterProfileSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [searchQuery, sortBy, order],
  )

  const query = useWaterProfiles(queryParams)

  const waterProfiles = useMemo(() => {
    if (!query.data?.pages) return []
    return query.data.pages.flatMap(page => page.data)
  }, [query.data])

  return {
    ...query,
    waterProfiles,
  }
}
