import { useInfiniteQuery } from '@tanstack/react-query'
import { getFermenters } from '../api/equipmentApi'
import { addPublicFlag } from '../interfaces/equipment'
import type {
  EquipmentWithPublicFlag,
  EquipmentQueryParams,
} from '../interfaces/equipment'

interface PaginatedResult {
  data: EquipmentWithPublicFlag[]
  total: number
  page: number
  totalPages: number
}

export const useFermenters = (params?: Omit<EquipmentQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['equipments', 'fermenters', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await getFermenters({ ...params, page: pageParam })
      return {
        ...result,
        data: result.data.map(addPublicFlag) as EquipmentWithPublicFlag[],
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResult) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
  })
}
