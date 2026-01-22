import { useQuery } from '@tanstack/react-query'
import { getInventoryItemsPaginated } from '../api/inventoryApi'
import type { InventoryItemType } from '../interfaces/inventory'

const ITEMS_PER_PAGE = 20

export const useInventoryItemsPaginated = (
  page: number = 1,
  filterType: InventoryItemType | 'all' = 'all',
  searchQuery: string = '',
) => {
  return useQuery({
    queryKey: [
      'inventory',
      'items',
      'paginated',
      page,
      filterType,
      searchQuery,
    ],
    queryFn: async () => {
      const response = await getInventoryItemsPaginated(
        page,
        ITEMS_PER_PAGE,
        filterType !== 'all' ? filterType : undefined,
        searchQuery || undefined,
      )
      return response
    },
    staleTime: 1000 * 60 * 5,
  })
}
