import {
  BaseInventoryItem,
  FermentableInventoryItem,
  HopInventoryItem,
  InventoryItemType,
  YeastInventoryItem,
} from '../interfaces/inventory'

export type StockItem =
  | FermentableInventoryItem
  | HopInventoryItem
  | YeastInventoryItem

export const calculateStockStats = (items: StockItem[]) => {
  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0)
  const itemsNearExpiry = items.filter(item => item.isNearExpiry).length
  const itemsExpired = items.filter(item => item.isExpired).length

  return {
    totalItems,
    totalValue,
    itemsNearExpiry,
    itemsExpired,
  }
}

export const filterItemsByType = (
  items: BaseInventoryItem[],
  type: InventoryItemType | 'all',
): BaseInventoryItem[] => {
  if (type === 'all') return items
  return items.filter(item => item.type === type)
}

export const searchItems = (
  items: BaseInventoryItem[],
  query: string,
): BaseInventoryItem[] => {
  const lowerQuery = query.toLowerCase()
  return items.filter(item => item.name.toLowerCase().includes(lowerQuery))
}
