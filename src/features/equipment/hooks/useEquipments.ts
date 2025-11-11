import { useInfiniteQuery } from '@tanstack/react-query'
import { getAllEquipments } from '../api/equipmentApi'
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

export const useEquipments = (params?: Omit<EquipmentQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['equipments', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await getAllEquipments({ ...params, page: pageParam })
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
