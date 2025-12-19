import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  Recipe,
  RecipeQueryParams,
  PaginatedRecipes,
  RecipeUpsertInput,
} from '../interfaces/Recipe'

const RECIPES_BASE_URL = '/recipes'

export const recipesApi = {
  findAll: async (): Promise<Recipe[]> => {
    const response = await maltMasterApi.get<Recipe[]>(RECIPES_BASE_URL)
    return response.data
  },

  findAllPaginated: async (
    params?: RecipeQueryParams,
  ): Promise<PaginatedRecipes> => {
    const response = await maltMasterApi.get<PaginatedRecipes>(
      RECIPES_BASE_URL,
      { params },
    )
    return response.data
  },

  findById: async (id: string): Promise<Recipe> => {
    const response = await maltMasterApi.get<Recipe>(
      `${RECIPES_BASE_URL}/${id}`,
    )
    return response.data
  },

  create: async (input: RecipeUpsertInput): Promise<Recipe> => {
    const response = await maltMasterApi.post<Recipe>(RECIPES_BASE_URL, input)
    return response.data
  },

  update: async (id: string, input: RecipeUpsertInput): Promise<Recipe> => {
    const response = await maltMasterApi.put<Recipe>(
      `${RECIPES_BASE_URL}/${id}`,
      input,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${RECIPES_BASE_URL}/${id}`)
  },
}
