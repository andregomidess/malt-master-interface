import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  FermentationProfile,
  FermentationStep,
} from '../interfaces/FermentationProfile'

const FERMENTATION_PROFILES_BASE_URL = '/fermentation-profiles'

export interface FermentationStepInput {
  id?: string
  stepOrder: number
  name: string
  temperature: number
  duration: number
  targetGravity?: number | null
  pressureControl?: number | null
  isRamping: boolean
  rampTime?: number | null
  rampToTemperature?: number | null
  description?: string | null
}

export interface FermentationProfileInput {
  id?: string
  name: string
  type: string
  yeastStrain?: string | null
  targetFinalGravity?: number | null
  estimatedAttenuation?: number | null
  isMultiStage: boolean
  observations?: string | null
  isPublic: boolean
  steps: FermentationStepInput[]
}

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

  save: async (
    profile: FermentationProfileInput,
  ): Promise<FermentationProfile> => {
    const response = await maltMasterApi.put<FermentationProfile>(
      FERMENTATION_PROFILES_BASE_URL,
      profile,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${FERMENTATION_PROFILES_BASE_URL}/${id}`)
  },
}
