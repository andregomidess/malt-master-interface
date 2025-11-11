import { useInfiniteQuery } from '@tanstack/react-query'
import { getInventoryItemsPaginated } from '../api/inventoryApi'
import type { InventoryItem, InventoryItemType } from '../interfaces/inventory'
import { useMemo } from 'react'

const ITEMS_PER_PAGE = 12

export const useInfiniteInventoryItems = (
  filterType: InventoryItemType | 'all' = 'all',
  searchQuery: string = '',
) => {
  const query = useInfiniteQuery({
    queryKey: ['inventory', 'items', 'infinite', filterType, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getInventoryItemsPaginated(
        pageParam,
        ITEMS_PER_PAGE,
        filterType !== 'all' ? filterType : undefined,
        searchQuery || undefined,
      )

      return {
        items: response.items,
        meta: response.meta,
        nextPage:
          response.meta.page < response.meta.totalPages
            ? response.meta.page + 1
            : undefined,
      }
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  })

  const allLoadedItems = useMemo(() => {
    return query.data?.pages.flatMap(page => page.items) ?? []
  }, [query.data])

  const totalItems = query.data?.pages[0]?.meta.total ?? 0
  const totalPages = query.data?.pages[0]?.meta.totalPages ?? 0

  return {
    ...query,
    items: allLoadedItems,
    totalItems,
    totalPages,
    hasMore: query.hasNextPage,
  }
}

/**
 * As propriedades computadas agora vêm diretamente do backend.
 * Esta função não é mais necessária, mas mantemos por compatibilidade.
 * @deprecated Use as propriedades do item diretamente (já calculadas pelo backend)
 */
export const calculateItemProperties = (item: InventoryItem) => {
  // Apenas retorna o item sem modificações, pois todas as propriedades
  // computadas já vêm calculadas do backend
  return item
}
