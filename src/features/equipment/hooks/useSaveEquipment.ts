import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveEquipment } from '../api/equipmentApi'
import type { EquipmentInput } from '../interfaces/equipment'

export const useSaveEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (equipment: EquipmentInput) => saveEquipment(equipment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })
}
