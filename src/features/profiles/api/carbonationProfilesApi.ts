import { maltMasterApi } from '../../../shared/maltMasterApi'
import { CarbonationProfile } from '../interfaces/CarbonationProfile'

const CARBONATION_PROFILES_BASE_URL = '/carbonation-profiles'

export interface CarbonationProfileInput {
  id?: string
  name: string
  type: string
  targetCO2Volumes: number
  servingTemperature: number
  primingSugarType?: string | null
  primingSugarAmount?: number | null
  kegPressure?: number | null
  carbonationTime?: number | null
  carbonationMethod?: string | null
  observations?: string | null
  isPublic: boolean
}

export const carbonationProfilesApi = {
  findAll: async (): Promise<CarbonationProfile[]> => {
    const response = await maltMasterApi.get<CarbonationProfile[]>(
      CARBONATION_PROFILES_BASE_URL,
    )
    return response.data
  },

  findPublic: async (): Promise<CarbonationProfile[]> => {
    const response = await maltMasterApi.get<CarbonationProfile[]>(
      `${CARBONATION_PROFILES_BASE_URL}/public`,
    )
    return response.data
  },

  findById: async (id: string): Promise<CarbonationProfile> => {
    const response = await maltMasterApi.get<CarbonationProfile>(
      `${CARBONATION_PROFILES_BASE_URL}/${id}`,
    )
    return response.data
  },

  save: async (
    profile: CarbonationProfileInput,
  ): Promise<CarbonationProfile> => {
    const response = await maltMasterApi.put<CarbonationProfile>(
      CARBONATION_PROFILES_BASE_URL,
      profile,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${CARBONATION_PROFILES_BASE_URL}/${id}`)
  },
}
