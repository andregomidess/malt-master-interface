import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { fermentablesApi } from '../api/fermentablesApi'
import type { FermentableQueryParams } from '../interfaces/Fermentable'
import { FermentableSortBy, SortOrder } from '../interfaces/Fermentable'
import type { LoadOptionsResult } from '../../recipes/components/Select'
import { useMemo } from 'react'
import {
  addPublicFlag,
  FermentableWithPublicFlag,
} from '../interfaces/Fermentable'

interface PaginatedResult {
  data: FermentableWithPublicFlag[]
  total: number
  page: number
  totalPages: number
}

export const useFermentables = (
  params?: Omit<FermentableQueryParams, 'page'>,
) => {
  return useInfiniteQuery({
    queryKey: ['fermentables', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await fermentablesApi.findAllPaginated({
        ...params,
        page: pageParam,
      })
      return {
        ...result,
        data: result.data.map(addPublicFlag) as FermentableWithPublicFlag[],
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResult) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
  })
}

export const useFermentablesList = (
  searchQuery?: string,
  sortBy?: FermentableSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      sortBy: sortBy || FermentableSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [searchQuery, sortBy, order],
  )

  const query = useFermentables(queryParams)

  const fermentables = useMemo(() => {
    if (!query.data?.pages) return []
    return query.data.pages.flatMap(page => page.data)
  }, [query.data])

  return {
    ...query,
    fermentables,
  }
}

export const useFermentablesLoadOptions = () => {
  return useCallback(
    async ({
      search,
      page,
    }: {
      search: string
      page: number
    }): Promise<LoadOptionsResult> => {
      const result = await fermentablesApi.findAllPaginated({
        search: search || undefined,
        page,
        take: 20,
        sortBy: FermentableSortBy.NAME,
        order: SortOrder.ASC,
      })
      return {
        options: result.data.map(f => ({
          value: f.id,
          label: f.name,
        })),
        hasMore: result.page < result.totalPages,
      }
    },
    [],
  )
}
