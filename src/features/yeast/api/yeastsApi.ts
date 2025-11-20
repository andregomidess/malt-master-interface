import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  Yeast,
  YeastInput,
  YeastQueryParams,
  PaginatedYeasts,
} from '../interfaces/Yeast'

const YEASTS_BASE_URL = '/yeasts'

export const yeastsApi = {
  findAll: async (): Promise<Yeast[]> => {
    const response = await maltMasterApi.get<Yeast[]>(YEASTS_BASE_URL)
    return response.data
  },

  findAllPaginated: async (
    params?: YeastQueryParams,
  ): Promise<PaginatedYeasts> => {
    const response = await maltMasterApi.get<PaginatedYeasts>(YEASTS_BASE_URL, {
      params,
    })
    return response.data
  },

  findById: async (id: string): Promise<Yeast> => {
    const response = await maltMasterApi.get<Yeast>(`${YEASTS_BASE_URL}/${id}`)
    return response.data
  },

  save: async (input: YeastInput): Promise<Yeast> => {
    const response = await maltMasterApi.put<Yeast>(YEASTS_BASE_URL, input)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${YEASTS_BASE_URL}/${id}`)
  },

  recovery: async (id: string): Promise<Yeast> => {
    const response = await maltMasterApi.patch<Yeast>(
      `${YEASTS_BASE_URL}/${id}/recovery`,
    )
    return response.data
  },
}
