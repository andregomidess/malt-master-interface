import { maltMasterApi } from '../../../shared/maltMasterApi'
import type {
  Equipment,
  EquipmentInput,
  EquipmentQueryParams,
  PaginatedEquipments,
} from '../interfaces/equipment'

export const getAllEquipments = async (
  params?: EquipmentQueryParams,
): Promise<PaginatedEquipments> => {
  const response = await maltMasterApi.get<PaginatedEquipments>('/equipments', {
    params,
  })
  return response.data
}

export const getEquipmentById = async (id: string): Promise<Equipment> => {
  const response = await maltMasterApi.get<Equipment>(`/equipments/${id}`)
  return response.data
}

export const getKettles = async (
  params?: EquipmentQueryParams,
): Promise<PaginatedEquipments> => {
  const response = await maltMasterApi.get<PaginatedEquipments>(
    '/equipments/kettles',
    { params },
  )
  return response.data
}

export const getFermenters = async (
  params?: EquipmentQueryParams,
): Promise<PaginatedEquipments> => {
  const response = await maltMasterApi.get<PaginatedEquipments>(
    '/equipments/fermenters',
    { params },
  )
  return response.data
}

export const getChillers = async (
  params?: EquipmentQueryParams,
): Promise<PaginatedEquipments> => {
  const response = await maltMasterApi.get<PaginatedEquipments>(
    '/equipments/chillers',
    { params },
  )
  return response.data
}

export const saveEquipment = async (
  equipment: EquipmentInput,
): Promise<Equipment> => {
  const response = await maltMasterApi.put<Equipment>('/equipments', equipment)
  return response.data
}

export const deleteEquipment = async (id: string): Promise<void> => {
  await maltMasterApi.delete(`/equipments/${id}`)
}

export const recoveryEquipment = async (id: string): Promise<Equipment> => {
  const response = await maltMasterApi.patch<Equipment>(
    `/equipments/${id}/recovery`,
  )
  return response.data
}
