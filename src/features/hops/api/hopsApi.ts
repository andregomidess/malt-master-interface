import { maltMasterApi } from '../../../shared/maltMasterApi'
import { Hop, HopInput, HopQueryParams, PaginatedHops } from '../interfaces/Hop'

const HOPS_BASE_URL = '/hops'

export const hopsApi = {
  findAll: async (): Promise<Hop[]> => {
    const response = await maltMasterApi.get<Hop[]>(HOPS_BASE_URL)
    return response.data
  },

  findAllPaginated: async (params?: HopQueryParams): Promise<PaginatedHops> => {
    const response = await maltMasterApi.get<PaginatedHops>(HOPS_BASE_URL, {
      params,
    })
    return response.data
  },

  findById: async (id: string): Promise<Hop> => {
    const response = await maltMasterApi.get<Hop>(`${HOPS_BASE_URL}/${id}`)
    return response.data
  },

  save: async (input: HopInput): Promise<Hop> => {
    const response = await maltMasterApi.put<Hop>(HOPS_BASE_URL, input)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${HOPS_BASE_URL}/${id}`)
  },

  recovery: async (id: string): Promise<Hop> => {
    const response = await maltMasterApi.patch<Hop>(
      `${HOPS_BASE_URL}/${id}/recovery`,
    )
    return response.data
  },
}
