import { useQuery } from '@tanstack/react-query'
import { getEquipmentById } from '../api/equipmentApi'
import { addPublicFlag } from '../interfaces/equipment'
import type { EquipmentWithPublicFlag } from '../interfaces/equipment'

export const useEquipmentById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do equipamento não fornecido')
      const equipment = await getEquipmentById(id)
      return addPublicFlag(equipment) as EquipmentWithPublicFlag
    },
    enabled: !!id,
  })
}
