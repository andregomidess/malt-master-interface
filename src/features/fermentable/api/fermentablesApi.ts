import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  Fermentable,
  FermentableInput,
  FermentableQueryParams,
  PaginatedFermentables,
} from '../interfaces/Fermentable'

const FERMENTABLES_BASE_URL = '/fermentables'

export const fermentablesApi = {
  findAll: async (): Promise<Fermentable[]> => {
    const response = await maltMasterApi.get<Fermentable[]>(
      FERMENTABLES_BASE_URL,
    )
    return response.data
  },

  findAllPaginated: async (
    params?: FermentableQueryParams,
  ): Promise<PaginatedFermentables> => {
    const response = await maltMasterApi.get<PaginatedFermentables>(
      FERMENTABLES_BASE_URL,
      { params },
    )
    return response.data
  },

  findById: async (id: string): Promise<Fermentable> => {
    const response = await maltMasterApi.get<Fermentable>(
      `${FERMENTABLES_BASE_URL}/${id}`,
    )
    return response.data
  },

  save: async (input: FermentableInput): Promise<Fermentable> => {
    const response = await maltMasterApi.put<Fermentable>(
      FERMENTABLES_BASE_URL,
      input,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${FERMENTABLES_BASE_URL}/${id}`)
  },

  recovery: async (id: string): Promise<Fermentable> => {
    const response = await maltMasterApi.patch<Fermentable>(
      `${FERMENTABLES_BASE_URL}/${id}/recovery`,
    )
    return response.data
  },
}
