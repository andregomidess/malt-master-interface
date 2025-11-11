import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recoveryEquipment } from '../api/equipmentApi'

export const useRecoveryEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => recoveryEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
    },
  })
}
