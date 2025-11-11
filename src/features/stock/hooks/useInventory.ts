import { useQuery } from '@tanstack/react-query'
import { getUserInventory } from '../api/inventoryApi'

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: getUserInventory,
    staleTime: 1000 * 60 * 5,
  })
}
