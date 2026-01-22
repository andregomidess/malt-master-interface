import { useQuery } from '@tanstack/react-query'
import { fermentablesApi } from '../api/fermentablesApi'
import type { FermentableQueryParams } from '../interfaces/Fermentable'
import { FermentableSortBy, SortOrder } from '../interfaces/Fermentable'
import { useMemo } from 'react'
import {
  addPublicFlag,
  FermentableWithPublicFlag,
} from '../interfaces/Fermentable'

export const useFermentablesPaginated = (
  page: number,
  searchQuery?: string,
  sortBy?: FermentableSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo<FermentableQueryParams>(
    () => ({
      page,
      search: searchQuery || undefined,
      sortBy: sortBy || FermentableSortBy.NAME,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [page, searchQuery, sortBy, order],
  )

  return useQuery({
    queryKey: ['fermentables', 'paginated', queryParams] as const,
    queryFn: async () => {
      const result = await fermentablesApi.findAllPaginated(queryParams)
      return {
        ...result,
        data: result.data.map(addPublicFlag) as FermentableWithPublicFlag[],
      }
    },
  })
}
