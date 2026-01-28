import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  BeerStyle,
  BeerStyleInput,
  BeerStyleQueryParams,
  PaginatedBeerStyles,
} from '../interfaces/BeerStyle'

const BEER_STYLES_BASE_URL = '/beer-styles'

export const beerStylesApi = {
  findAll: async (): Promise<PaginatedBeerStyles> => {
    const response =
      await maltMasterApi.get<PaginatedBeerStyles>(BEER_STYLES_BASE_URL)
    return response.data
  },

  findAllPaginated: async (
    params?: BeerStyleQueryParams,
  ): Promise<PaginatedBeerStyles> => {
    const response = await maltMasterApi.get<PaginatedBeerStyles>(
      BEER_STYLES_BASE_URL,
      { params },
    )
    return response.data
  },

  findById: async (id: string): Promise<BeerStyle> => {
    const response = await maltMasterApi.get<BeerStyle>(
      `${BEER_STYLES_BASE_URL}/${id}`,
    )
    return response.data
  },

  save: async (input: BeerStyleInput): Promise<BeerStyle> => {
    const response = await maltMasterApi.put<BeerStyle>(
      BEER_STYLES_BASE_URL,
      input,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${BEER_STYLES_BASE_URL}/${id}`)
  },

  recovery: async (id: string): Promise<BeerStyle> => {
    const response = await maltMasterApi.patch<BeerStyle>(
      `${BEER_STYLES_BASE_URL}/${id}/recovery`,
    )
    return response.data
  },
}
