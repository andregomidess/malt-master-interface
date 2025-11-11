import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEquipment } from '../api/equipmentApi'

/**
 * Hook para excluir um equipamento
 */
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteEquipment(id),
    onSuccess: () => {
      // Invalida todas as queries de equipamentos para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
    },
  })
}
