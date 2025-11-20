export enum YeastType {
  ALE = 'ale',
  LAGER = 'lager',
  WILD = 'wild',
  BACTERIA = 'bacteria',
}

export enum YeastFlocculation {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum YeastFormat {
  DRY = 'dry',
  LIQUID = 'liquid',
  SLURRY = 'slurry',
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Yeast {
  id: string
  name: string
  user?: User | null
  type: YeastType
  attenuation?: number | null
  flocculation: YeastFlocculation
  minTemp?: number | null
  maxTemp?: number | null
  format: YeastFormat
  alcoholTolerance?: number | null
  origin?: string | null
  supplier?: string | null
  packagingDate?: string | null
  aromaFlavor?: string | null
  rehydrationNotes?: string | null
  starterNotes?: string | null
  notes?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface YeastInput {
  id?: string
  name: string
  type: YeastType
  attenuation?: number
  flocculation: YeastFlocculation
  minTemp?: number
  maxTemp?: number
  format: YeastFormat
  alcoholTolerance?: number
  origin?: string
  aromaFlavor?: string
  notes?: string
}

export enum YeastSortBy {
  NAME = 'name',
  ATTENUATION = 'attenuation',
  TYPE = 'type',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface YeastQueryParams {
  search?: string
  sortBy?: YeastSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedYeasts {
  data: Yeast[]
  total: number
  page: number
  totalPages: number
}

// Traduções
export const yeastTypeLabels: Record<YeastType, string> = {
  [YeastType.ALE]: 'Ale',
  [YeastType.LAGER]: 'Lager',
  [YeastType.WILD]: 'Selvagem',
  [YeastType.BACTERIA]: 'Bactéria',
}

export const yeastFlocculationLabels: Record<YeastFlocculation, string> = {
  [YeastFlocculation.LOW]: 'Baixa',
  [YeastFlocculation.MEDIUM]: 'Média',
  [YeastFlocculation.HIGH]: 'Alta',
}

export const yeastFormatLabels: Record<YeastFormat, string> = {
  [YeastFormat.DRY]: 'Seca',
  [YeastFormat.LIQUID]: 'Líquida',
  [YeastFormat.SLURRY]: 'Slurry',
}

// Helper para adicionar flag isPublic
export interface YeastWithPublicFlag extends Omit<Yeast, 'user'> {
  user: User | null
  isPublic: boolean
}

export const addPublicFlag = (yeast: Yeast): YeastWithPublicFlag => {
  return {
    ...yeast,
    user: yeast.user ?? null,
    isPublic: yeast.user === null,
  }
}
