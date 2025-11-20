import { maltMasterApi } from '../../../shared/maltMasterApi'
import { CarbonationProfile } from '../interfaces/CarbonationProfile'

const CARBONATION_PROFILES_BASE_URL = '/carbonation-profiles'

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
}
