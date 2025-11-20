import { maltMasterApi } from '../../../shared/maltMasterApi'
import { FermentationProfile } from '../interfaces/FermentationProfile'

const FERMENTATION_PROFILES_BASE_URL = '/fermentation-profiles'

export const fermentationProfilesApi = {
  findAll: async (): Promise<FermentationProfile[]> => {
    const response = await maltMasterApi.get<FermentationProfile[]>(
      FERMENTATION_PROFILES_BASE_URL,
    )
    return response.data
  },

  findPublic: async (): Promise<FermentationProfile[]> => {
    const response = await maltMasterApi.get<FermentationProfile[]>(
      `${FERMENTATION_PROFILES_BASE_URL}/public`,
    )
    return response.data
  },

  findById: async (id: string): Promise<FermentationProfile> => {
    const response = await maltMasterApi.get<FermentationProfile>(
      `${FERMENTATION_PROFILES_BASE_URL}/${id}`,
    )
    return response.data
  },
}
