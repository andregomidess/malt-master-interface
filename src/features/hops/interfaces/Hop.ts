export enum HopForm {
  PELLET = 'pellet',
  LEAF = 'leaf',
  CRYO = 'cryo',
  EXTRACT = 'extract',
}

export enum HopUse {
  BITTERING = 'bittering',
  AROMA = 'aroma',
  DRY_HOPPING = 'dry_hopping',
  DUAL_PURPOSE = 'dual_purpose',
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Hop {
  id: string
  name: string
  user?: User | null
  alphaAcids: number
  betaAcids: number
  cohumulone?: number | null
  totalOils?: number | null
  form: HopForm
  uses: HopUse[]
  aromaFlavor?: string | null
  harvestYear?: number | null
  storageCondition?: string | null
  hsi?: number | null
  costPerKilogram?: number | null
  notes?: string | null
  origin?: string | null
  supplier?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface HopInput {
  id?: string
  name: string
  alphaAcids: number
  betaAcids: number
  cohumulone?: number
  totalOils?: number
  form?: HopForm
  uses?: HopUse[]
  aromaFlavor?: string
  harvestYear?: number
  storageCondition?: string
  hsi?: number
  costPerKilogram?: number
  notes?: string
  origin?: string
  supplier?: string
}

export enum HopSortBy {
  NAME = 'name',
  ALPHA_ACIDS = 'alphaAcids',
  CREATED_AT = 'createdAt',
  COST = 'costPerKilogram',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface HopQueryParams {
  search?: string
  sortBy?: HopSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedHops {
  data: Hop[]
  total: number
  page: number
  totalPages: number
}

// Traduções
export const hopFormLabels: Record<HopForm, string> = {
  [HopForm.PELLET]: 'Pellets',
  [HopForm.LEAF]: 'Flor',
  [HopForm.CRYO]: 'Cryo',
  [HopForm.EXTRACT]: 'Extrato',
}

export const hopUseLabels: Record<HopUse, string> = {
  [HopUse.BITTERING]: 'Amargor',
  [HopUse.AROMA]: 'Aroma',
  [HopUse.DRY_HOPPING]: 'Dry Hopping',
  [HopUse.DUAL_PURPOSE]: 'Duplo Propósito',
}

export interface HopWithPublicFlag extends Omit<Hop, 'user'> {
  user: User | null
  isPublic: boolean
}

export const addPublicFlag = (hop: Hop): HopWithPublicFlag => {
  return {
    ...hop,
    user: hop.user ?? null,
    isPublic: hop.user === null,
  }
}
