import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEquipment } from '../api/equipmentApi'

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
    },
  })
}
