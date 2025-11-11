import { useQuery } from '@tanstack/react-query'
import { getInventoryStats } from '../api/inventoryApi'

export const useInventoryStats = () => {
  return useQuery({
    queryKey: ['inventory', 'stats'],
    queryFn: getInventoryStats,
    staleTime: 1000 * 60 * 5,
  })
}
