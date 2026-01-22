import { useQuery } from '@tanstack/react-query'
import { getAllEquipments } from '../api/equipmentApi'
import { addPublicFlag } from '../interfaces/equipment'
import type {
  EquipmentWithPublicFlag,
  EquipmentQueryParams,
} from '../interfaces/equipment'

export const useEquipmentsPaginated = (
  page: number,
  params?: Omit<EquipmentQueryParams, 'page'>,
) => {
  return useQuery({
    queryKey: ['equipments', 'paginated', page, params] as const,
    queryFn: async () => {
      const result = await getAllEquipments({ ...params, page })
      return {
        ...result,
        data: result.data.map(addPublicFlag) as EquipmentWithPublicFlag[],
      }
    },
  })
}
