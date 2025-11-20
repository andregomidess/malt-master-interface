import { useInfiniteQuery } from '@tanstack/react-query'
import { tastingNotesApi } from '../api/tastingNotesApi'
import type { TastingNoteQueryParams } from '../interfaces/TastingNote'
import { TastingNoteSortBy, SortOrder } from '../interfaces/TastingNote'
import { useMemo } from 'react'

export const useTastingNotes = (
  params?: Omit<TastingNoteQueryParams, 'page'>,
) => {
  return useInfiniteQuery({
    queryKey: ['tasting-notes', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await tastingNotesApi.findAllPaginated({
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

export const useTastingNotesList = (
  searchQuery?: string,
  batchId?: string,
  sortBy?: TastingNoteSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      batchId: batchId || undefined,
      sortBy: sortBy || TastingNoteSortBy.TASTING_DATE,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [searchQuery, batchId, sortBy, order],
  )

  const query = useTastingNotes(queryParams)

  const tastingNotes = useMemo(() => {
    if (!query.data?.pages) return []
    return query.data.pages.flatMap(page => page.data)
  }, [query.data])

  return {
    ...query,
    tastingNotes,
  }
}
