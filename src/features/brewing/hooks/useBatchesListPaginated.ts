import { useQuery } from '@tanstack/react-query'
import { batchesApi } from '../api/batchesApi'
import {
  BatchSortBy,
  BatchStatus,
  SortOrder,
  Batch,
} from '../interfaces/Brewing'
import { useMemo } from 'react'

interface UseBatchesListPaginatedResult {
  batches: Batch[]
  total: number
  totalPages: number
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export const useBatchesListPaginated = (
  page: number,
  search?: string,
  status?: BatchStatus,
  sortBy: BatchSortBy = BatchSortBy.BREW_DATE,
  order: SortOrder = SortOrder.DESC,
): UseBatchesListPaginatedResult => {
  const params = useMemo(
    () => ({
      page,
      search,
      status,
      sortBy,
      order,
      take: 20,
    }),
    [page, search, status, sortBy, order],
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['batches', 'paginated', params] as const,
    queryFn: async () => {
      return await batchesApi.findAllPaginated(params)
    },
  })

  const batches = useMemo(
    () =>
      data?.data
        ? data.data.filter(
            (item): item is Batch => item != null && item.id != null,
          )
        : [],
    [data],
  )

  return {
    batches,
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    error: error as Error | null,
    refetch: () => refetch(),
  }
}
