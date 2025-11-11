import { useQuery } from '@tanstack/react-query'
import {
  getAllInventoryItems,
  getInventoryItemsByType,
} from '../api/inventoryApi'
import { InventoryItemType } from '../interfaces/inventory'

export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventory', 'items'],
    queryFn: getAllInventoryItems,
    staleTime: 1000 * 60 * 5,
  })
}

export const useInventoryItemsByType = (type: InventoryItemType) => {
  return useQuery({
    queryKey: ['inventory', 'items', 'type', type],
    queryFn: () => getInventoryItemsByType(type),
    staleTime: 1000 * 60 * 5,
  })
}
