import { maltMasterApi } from '../../../shared/maltMasterApi'
import type {
  Inventory,
  InventoryItem,
  InventoryStats,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  InventoryItemType,
} from '../interfaces/inventory'

export interface PaginatedInventoryResponse {
  items: InventoryItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const getUserInventory = async (): Promise<Inventory> => {
  const response = await maltMasterApi.get('/inventory')
  return response.data
}

export const getInventoryStats = async (): Promise<InventoryStats> => {
  const response = await maltMasterApi.get('/inventory/stats')
  return response.data
}

export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await maltMasterApi.get('/inventory/items')
  return response.data
}

export const getInventoryItemsPaginated = async (
  page: number = 1,
  limit: number = 12,
  type?: InventoryItemType,
  search?: string,
): Promise<PaginatedInventoryResponse> => {
  const params: Record<string, string | number> = { page, take: limit }

  if (type) params.type = type

  if (search) params.search = search

  const response = await maltMasterApi.get('/inventory/items', { params })
  return response.data
}

export const getInventoryItemsByType = async (
  type: InventoryItemType,
): Promise<InventoryItem[]> => {
  const response = await maltMasterApi.get(`/inventory/items/type/${type}`)
  return response.data
}

export const getExpiringItems = async (): Promise<InventoryItem[]> => {
  const response = await maltMasterApi.get('/inventory/items/expiring')
  return response.data
}

export const getExpiredItems = async (): Promise<InventoryItem[]> => {
  const response = await maltMasterApi.get('/inventory/items/expired')
  return response.data
}

export const searchInventoryItems = async (
  searchTerm: string,
): Promise<InventoryItem[]> => {
  const response = await maltMasterApi.get('/inventory/search', {
    params: { search: searchTerm },
  })
  return response.data
}

export const addInventoryItem = async (
  itemData: CreateInventoryItemInput,
): Promise<InventoryItem> => {
  const response = await maltMasterApi.post('/inventory/items', itemData)
  return response.data
}

export const updateInventoryItem = async (
  itemId: string,
  updateData: UpdateInventoryItemInput,
): Promise<InventoryItem> => {
  const response = await maltMasterApi.patch(
    `/inventory/items/${itemId}`,
    updateData,
  )
  return response.data
}

export const updateItemQuantity = async (
  itemId: string,
  quantity: number,
): Promise<InventoryItem> => {
  const response = await maltMasterApi.patch(
    `/inventory/items/${itemId}/quantity`,
    { quantity },
  )
  return response.data
}

export const getInventoryItemById = async (
  itemId: string,
): Promise<InventoryItem> => {
  const response = await maltMasterApi.get(`/inventory-items/${itemId}`)
  return response.data
}

export const removeInventoryItem = async (
  itemId: string,
): Promise<{ message: string }> => {
  const response = await maltMasterApi.delete(`/inventory/items/${itemId}`)
  return response.data
}
