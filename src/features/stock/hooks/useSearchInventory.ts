import { useQuery } from '@tanstack/react-query'
import { searchInventoryItems } from '../api/inventoryApi'

export const useSearchInventory = (searchTerm: string) => {
  return useQuery({
    queryKey: ['inventory', 'search', searchTerm],
    queryFn: () => searchInventoryItems(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 2,
  })
}
