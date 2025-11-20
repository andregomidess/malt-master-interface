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
    const response = await maltMasterApi.get<BatchDetail>(
      `${BATCHES_BASE_URL}/${id}`,
    )
    return response.data
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
