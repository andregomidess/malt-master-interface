export interface BeerStyle {
  id: string
  name: string
  category?: string | null
  subCategory?: string | null
}

export interface Equipment {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
}

export enum RecipeType {
  ALL_GRAIN = 'all_grain',
  PARTIAL_MASH = 'partial_mash',
  EXTRACT = 'extract',
}

export interface Recipe {
  id: string
  name: string
  user?: User | null
  beerStyle: BeerStyle
  equipment?: Equipment | null
  imageUrl?: string | null
  about?: string | null
  notes?: string | null
  type: RecipeType
  plannedVolume?: number | null
  finalVolume?: number | null
  mashVolume?: number | null
  boilTime?: number | null
  originalGravity?: number | null
  finalGravity?: number | null
  estimatedIbu?: number | null
  estimatedColor?: number | null
  estimatedAbv?: number | null
  plannedEfficiency?: number | null
  actualEfficiency?: number | null
  brewDate?: string | null
  createdAt: string
  updatedAt: string
}

export interface RecipeInput {
  id?: string
  name: string
  beerStyle: string
  equipment?: string | null
  imageUrl?: string | null
  about?: string | null
  notes?: string | null
  type: RecipeType
  plannedVolume?: number
  finalVolume?: number
  mashVolume?: number
  boilTime?: number
  originalGravity?: number
  finalGravity?: number
  estimatedIbu?: number
  estimatedColor?: number
  estimatedAbv?: number
  plannedEfficiency?: number
  actualEfficiency?: number
  brewDate?: string | null
}

export interface RecipeMashInput {
  id?: string
  mashProfile: string
  actualEfficiency?: number | null
}

export interface RecipeFermentationInput {
  id?: string
  fermentationProfile: string
  actualAttenuation?: number | null
  finalAbv?: number | null
  observations?: string | null
}

export interface RecipeCarbonationInput {
  id?: string
  carbonationProfile: string
  amountUsed?: string | null
  temperature?: number | null
  co2Volumes?: number | null
}

export interface RecipeUpsertInput {
  recipe: RecipeInput
  fermentables: Array<{
    fermentable: string
    amount: number
  }>
  hops: Array<{
    hop: string
    amount: number
    boilTime?: number | null
    stage?: string
  }>
  yeasts: Array<{
    yeast: string
    amount?: string | null
    stage: string
  }>
  waters: Array<{
    waterProfile: string
    volume: number
  }>
  mash?: RecipeMashInput
  fermentation?: RecipeFermentationInput
  carbonation?: RecipeCarbonationInput
}

export enum RecipeSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  BREW_DATE = 'brewDate',
  ESTIMATED_ABV = 'estimatedAbv',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface RecipeQueryParams {
  search?: string
  type?: RecipeType
  sortBy?: RecipeSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedRecipes {
  data: Recipe[]
  total: number
  page: number
  totalPages: number
}

// Traduções
export const recipeTypeLabels: Record<RecipeType, string> = {
  [RecipeType.ALL_GRAIN]: 'All Grain',
  [RecipeType.PARTIAL_MASH]: 'Partial Mash',
  [RecipeType.EXTRACT]: 'Extract',
}
