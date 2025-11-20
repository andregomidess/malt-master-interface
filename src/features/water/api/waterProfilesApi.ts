import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  WaterProfile,
  WaterProfileInput,
  WaterProfileQueryParams,
  PaginatedWaterProfiles,
} from '../interfaces/WaterProfile'

const WATER_PROFILES_BASE_URL = '/water-profiles'

export const waterProfilesApi = {
  findAll: async (): Promise<WaterProfile[]> => {
    const response = await maltMasterApi.get<WaterProfile[]>(
      WATER_PROFILES_BASE_URL,
    )
    return response.data
  },

  findAllPaginated: async (
    params?: WaterProfileQueryParams,
  ): Promise<PaginatedWaterProfiles> => {
    const response = await maltMasterApi.get<PaginatedWaterProfiles>(
      WATER_PROFILES_BASE_URL,
      { params },
    )
    return response.data
  },

  findById: async (id: string): Promise<WaterProfile> => {
    const response = await maltMasterApi.get<WaterProfile>(
      `${WATER_PROFILES_BASE_URL}/${id}`,
    )
    return response.data
  },

  save: async (input: WaterProfileInput): Promise<WaterProfile> => {
    const response = await maltMasterApi.put<WaterProfile>(
      WATER_PROFILES_BASE_URL,
      input,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${WATER_PROFILES_BASE_URL}/${id}`)
  },

  recovery: async (id: string): Promise<WaterProfile> => {
    const response = await maltMasterApi.patch<WaterProfile>(
      `${WATER_PROFILES_BASE_URL}/${id}/recovery`,
    )
    return response.data
  },
}
