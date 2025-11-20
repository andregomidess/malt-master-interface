import { useInfiniteQuery } from '@tanstack/react-query'
import { batchesApi } from '../api/batchesApi'
import {
  BatchSortBy,
  BatchStatus,
  SortOrder,
  Batch,
} from '../interfaces/Brewing'
import { useMemo } from 'react'

interface UseBatchesListResult {
  batches: Batch[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean | undefined
  error: Error | null
  refetch: () => void
}

export const useBatchesList = (
  search?: string,
  status?: BatchStatus,
  sortBy: BatchSortBy = BatchSortBy.BREW_DATE,
  order: SortOrder = SortOrder.DESC,
): UseBatchesListResult => {
  const params = useMemo(
    () => ({
      search,
      status,
      sortBy,
      order,
      take: 10,
    }),
    [search, status, sortBy, order],
  )

  const { data, hasNextPage, isFetchingNextPage, isLoading, error, refetch } =
    useInfiniteQuery({
      queryKey: ['batches', params] as const,
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const result = await batchesApi.findAllPaginated({
          ...params,
          page: pageParam,
        })
        return result
      },
      initialPageParam: 1,
      getNextPageParam: lastPage => {
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined
      },
    })

  const batches = useMemo(
    () =>
      data?.pages
        ? data.pages
            .flatMap(page => page.data)
            .filter((item): item is Batch => item != null && item.id != null)
        : [],
    [data],
  )

  return {
    batches,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error: error as Error | null,
    refetch: () => refetch(),
  }
}
