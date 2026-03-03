import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { waterProfilesApi } from '../api/waterProfilesApi'
import type { WaterProfileQueryParams } from '../interfaces/WaterProfile'
import { WaterProfileSortBy, SortOrder } from '../interfaces/WaterProfile'
import type { LoadOptionsResult } from '../../recipes/components/Select'
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

export const useWaterProfilesLoadOptions = () => {
  return useCallback(
    async ({
      search,
      page,
    }: {
      search: string
      page: number
    }): Promise<LoadOptionsResult> => {
      const result = await waterProfilesApi.findAllPaginated({
        search: search || undefined,
        page,
        take: 20,
        sortBy: WaterProfileSortBy.NAME,
        order: SortOrder.ASC,
      })
      return {
        options: result.data.map(w => ({ value: w.id, label: w.name })),
        hasMore: result.page < result.totalPages,
      }
    },
    [],
  )
}
