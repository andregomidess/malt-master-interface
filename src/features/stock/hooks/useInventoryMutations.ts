import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addInventoryItem,
  updateInventoryItem,
  updateItemQuantity,
  removeInventoryItem,
} from '../api/inventoryApi'
import type {
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
} from '../interfaces/inventory'
import toast from 'react-hot-toast'

export const useAddInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemData: CreateInventoryItemInput) =>
      addInventoryItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast.success('Item adicionado ao inventário com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar item ao inventário')
    },
  })
}

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      updateData,
    }: {
      itemId: string
      updateData: UpdateInventoryItemInput
    }) => updateInventoryItem(itemId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast.success('Item atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar item')
    },
  })
}

export const useUpdateItemQuantity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateItemQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast.success('Quantidade atualizada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar quantidade')
    },
  })
}

export const useRemoveInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeInventoryItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast.success('Item removido do inventário com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover item do inventário')
    },
  })
}
