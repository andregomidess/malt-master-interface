import { maltMasterApi } from '../../../shared/maltMasterApi'
import { MashProfile, MashStep } from '../interfaces/MashProfile'

const MASH_PROFILES_BASE_URL = '/mash-profiles'

export interface MashStepInput {
  id?: string
  stepOrder: number
  name: string
  stepType: string
  temperature: number
  duration: number
  infusionAmount?: number | null
  infusionTemp?: number | null
  decoctionAmount?: number | null
  rampTime?: number | null
  description?: string | null
}

export interface MashProfileInput {
  id?: string
  name: string
  type: string
  estimatedEfficiency?: number | null
  grainTemperature: number
  tunTemperature: number
  spargeTemperature: number
  tunWeight?: number | null
  tunSpecificHeat: number
  mashThickness: number
  observations?: string | null
  isPublic: boolean
  steps: MashStepInput[]
}

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

  save: async (profile: MashProfileInput): Promise<MashProfile> => {
    const response = await maltMasterApi.put<MashProfile>(
      MASH_PROFILES_BASE_URL,
      profile,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${MASH_PROFILES_BASE_URL}/${id}`)
  },
}
