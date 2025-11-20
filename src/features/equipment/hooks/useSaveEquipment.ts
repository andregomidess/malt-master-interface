import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveEquipment } from '../api/equipmentApi'
import type { EquipmentInput } from '../interfaces/equipment'
import toast from 'react-hot-toast'

export const useSaveEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (equipment: EquipmentInput) => saveEquipment(equipment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      toast.success('Equipamento salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar equipamento')
    },
  })
}
