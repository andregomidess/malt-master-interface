import { User } from '../../recipes/interfaces/Recipe'

export interface WaterProfile {
  id: string
  name: string
  origin?: string | null
  ca?: number | null
  mg?: number | null
  na?: number | null
  so4?: number | null
  cl?: number | null
  hco3?: number | null
  ph?: number | null
  recommendedStyle?: string | null
  notes?: string | null
  createdAt: string
  updatedAt?: string | null
  user?: User | null
}

export interface WaterProfileInput {
  id?: string
  name: string
  origin?: string
  ca?: number
  mg?: number
  na?: number
  so4?: number
  cl?: number
  hco3?: number
  ph?: number
  recommendedStyle?: string | null
  notes?: string | null
}

export enum WaterProfileSortBy {
  NAME = 'name',
  CA = 'ca',
  SO4 = 'so4',
  CL = 'cl',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface WaterProfileQueryParams {
  search?: string
  sortBy?: WaterProfileSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedWaterProfiles {
  data: WaterProfile[]
  total: number
  page: number
  totalPages: number
}

// Enum para tipo de perfil baseado na relação SO4:Cl
export enum ProfileType {
  MALTY = 'malty', // SO4:Cl < 0.5
  BALANCED = 'balanced', // SO4:Cl 0.5-1.5
  HOPPY = 'hoppy', // SO4:Cl > 1.5
  VERY_HOPPY = 'very_hoppy', // SO4:Cl > 3.0
}

// Enum para dureza
export enum WaterHardness {
  VERY_SOFT = 'very_soft', // < 50 ppm
  SOFT = 'soft', // 50-150 ppm
  MODERATE = 'moderate', // 150-300 ppm
  HARD = 'hard', // > 300 ppm
}

// Traduções
export const profileTypeLabels: Record<ProfileType, string> = {
  [ProfileType.MALTY]: 'Maltado',
  [ProfileType.BALANCED]: 'Balanceado',
  [ProfileType.HOPPY]: 'Lupulado',
  [ProfileType.VERY_HOPPY]: 'Muito Lupulado',
}

export const hardnessLabels: Record<WaterHardness, string> = {
  [WaterHardness.VERY_SOFT]: 'Muito Macia',
  [WaterHardness.SOFT]: 'Macia',
  [WaterHardness.MODERATE]: 'Moderada',
  [WaterHardness.HARD]: 'Dura',
}
