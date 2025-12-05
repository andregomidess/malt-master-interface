import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  Batch,
  BatchDetail,
  BrewLog,
  BatchQueryParams,
  PaginatedBatches,
} from '../interfaces/Brewing'

const BATCHES_BASE_URL = '/batches'

export const batchesApi = {
  findAllPaginated: async (
    params?: BatchQueryParams,
  ): Promise<PaginatedBatches> => {
    const response = await maltMasterApi.get<PaginatedBatches>(
      BATCHES_BASE_URL,
      { params },
    )
    const data = (response.data.data || []).filter(
      (item): item is Batch => item != null && item.id != null,
    )
    return {
      ...response.data,
      data,
    }
  },

  findById: async (id: string): Promise<BatchDetail> => {
    const response = await maltMasterApi.get<BatchDetail>(
      `${BATCHES_BASE_URL}/${id}`,
    )
    return response.data
  },

  save: async (input: Partial<Batch>): Promise<Batch> => {
    const response = await maltMasterApi.put<Batch>(BATCHES_BASE_URL, input)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${BATCHES_BASE_URL}/${id}`)
  },
}

export async function findBatchById(id: string): Promise<BatchDetail | null> {
  try {
    const response = await maltMasterApi.get<Batch | BatchDetail>(
      `${BATCHES_BASE_URL}/${id}`,
    )
    const data = response.data

    if ('batch' in data && 'mashSteps' in data) {
      return data as BatchDetail
    }

    const batch = data as Batch
    const recipeWithMash = batch.recipe as typeof batch.recipe & {
      mash?: {
        mashProfile?: {
          steps?: Array<{
            id: string
            stepOrder: number
            name: string
            stepType: string
            temperature: number
            duration: number
            infusionAmount?: number | null
            infusionTemp?: number | null
            rampTime?: number | null
            description?: string | null
          }>
        }
      }
      fermentation?: {
        fermentationProfile?: {
          steps?: Array<{
            id: string
            stepOrder: number
            name: string
            temperature: number
            duration: number
          }>
        }
      }
      hops?: Array<{
        time: number
        name: string
        amount: number
        unit: 'g' | 'oz'
        alphaAcid?: number
      }>
    }

    const mashSteps =
      recipeWithMash?.mash?.mashProfile?.steps?.map(step => ({
        id: step.id,
        stepOrder: step.stepOrder,
        name: step.name,
        stepType: step.stepType as 'infusion' | 'temperature' | 'decoction',
        temperature: step.temperature,
        duration: step.duration,
        infusionAmount: step.infusionAmount || null,
        infusionTemp: step.infusionTemp || null,
        rampTime: step.rampTime || null,
        description: step.description || null,
      })) || []

    const fermentationSteps =
      recipeWithMash?.fermentation?.fermentationProfile?.steps?.map(step => ({
        id: step.id,
        stepOrder: step.stepOrder,
        name: step.name,
        temperature: step.temperature,
        duration: step.duration,
      })) || []

    const hopSchedule =
      recipeWithMash?.hops?.map(hop => ({
        time: hop.time,
        name: hop.name,
        amount: hop.amount,
        unit: hop.unit,
        alphaAcid: hop.alphaAcid,
      })) || []

    return {
      batch,
      mashSteps,
      fermentationSteps,
      hopSchedule,
    }
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function findBatchLogs(_id: string): Promise<BrewLog[]> {
  // TODO: Implement when backend supports batch logs
  return []
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function addBatchLog(_log: Omit<BrewLog, 'id'>): Promise<BrewLog> {
  // TODO: Implement when backend supports batch logs
  throw new Error('Not implemented')
}

export async function deleteBatch(id: string): Promise<void> {
  await batchesApi.delete(id)
}
