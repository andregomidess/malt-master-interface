export enum FermentableType {
  BASE = 'base',
  SPECIALTY = 'specialty',
  SUGAR = 'sugar',
  ADJUNCT = 'adjunct',
}

export enum FermentableForm {
  GRAIN = 'grain',
  DRY_EXTRACT = 'dry_extract',
  LIQUID_EXTRACT = 'liquid_extract',
  SYRUP = 'syrup',
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Fermentable {
  id: string
  name: string
  user?: User | null
  type: FermentableType
  color?: number | null
  yield?: number | null
  origin?: string | null
  supplier?: string | null
  form: FermentableForm
  notes?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface FermentableInput {
  id?: string
  name: string
  type: FermentableType
  color?: number
  yield?: number
  origin?: string
  supplier?: string
  form: FermentableForm
  notes?: string
}

export enum FermentableSortBy {
  NAME = 'name',
  COLOR = 'color',
  YIELD = 'yield',
  CREATED_AT = 'createdAt',
  TYPE = 'type',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface FermentableQueryParams {
  search?: string
  sortBy?: FermentableSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedFermentables {
  data: Fermentable[]
  total: number
  page: number
  totalPages: number
}

// Traduções
export const fermentableTypeLabels: Record<FermentableType, string> = {
  [FermentableType.BASE]: 'Malte Base',
  [FermentableType.SPECIALTY]: 'Malte Especial',
  [FermentableType.SUGAR]: 'Açúcar',
  [FermentableType.ADJUNCT]: 'Adjunto',
}

export const fermentableFormLabels: Record<FermentableForm, string> = {
  [FermentableForm.GRAIN]: 'Grãos',
  [FermentableForm.DRY_EXTRACT]: 'Extrato Seco',
  [FermentableForm.LIQUID_EXTRACT]: 'Extrato Líquido',
  [FermentableForm.SYRUP]: 'Xarope',
}

// Helper para adicionar flag isPublic
export interface FermentableWithPublicFlag extends Omit<Fermentable, 'user'> {
  user: User | null
  isPublic: boolean
}

export const addPublicFlag = (
  fermentable: Fermentable,
): FermentableWithPublicFlag => {
  return {
    ...fermentable,
    user: fermentable.user ?? null,
    isPublic: fermentable.user === null,
  }
}
