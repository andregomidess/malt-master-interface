import { maltMasterApi } from '../../../shared/maltMasterApi'
import { MashProfile } from '../interfaces/MashProfile'

const MASH_PROFILES_BASE_URL = '/mash-profiles'

export const mashProfilesApi = {
  findAll: async (): Promise<MashProfile[]> => {
    const response = await maltMasterApi.get<MashProfile[]>(
      MASH_PROFILES_BASE_URL,
    )
    return response.data
  },

  findPublic: async (): Promise<MashProfile[]> => {
    const response = await maltMasterApi.get<MashProfile[]>(
      `${MASH_PROFILES_BASE_URL}/public`,
    )
    return response.data
  },

  findById: async (id: string): Promise<MashProfile> => {
    const response = await maltMasterApi.get<MashProfile>(
      `${MASH_PROFILES_BASE_URL}/${id}`,
    )
    return response.data
  },
}
