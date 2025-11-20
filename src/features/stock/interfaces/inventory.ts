// Enums baseados no backend
export enum InventoryItemType {
  FERMENTABLE = 'fermentable',
  HOP = 'hop',
  YEAST = 'yeast',
}

export enum FermentableInventoryUnit {
  G = 'g',
  KG = 'kg',
  LB = 'lb',
  SACK = 'sack',
}

export enum HopInventoryUnit {
  G = 'g',
  KG = 'kg',
  OZ = 'oz',
}

export enum YeastInventoryUnit {
  PACK = 'pack',
  VIAL = 'vial',
  SLURRY_ML = 'slurry_ml',
  CELLS_BILLION = 'cells_billion',
}

export interface BaseInventoryItem {
  id: string
  name: string
  type: InventoryItemType
  quantity: number
  purchaseDate: string | null
  bestBeforeDate: string | null
  costPerUnit: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
  totalValue: number
  isExpired: boolean
  isNearExpiry: boolean
  daysUntilExpiry: number | null
}

// Interface para Fermentáveis
export interface FermentableInventoryItem extends BaseInventoryItem {
  type: InventoryItemType.FERMENTABLE
  fermentable: {
    id: string
    name: string
    description?: string
    color?: number
    origin?: string
    maltster?: string
  }
  unit: FermentableInventoryUnit
  extractPotential: number | null
  lotNumber: string | null
  moisture: number | null
  protein: number | null
  // Propriedades computadas do backend
  isQualityAcceptable: boolean
  adjustedExtractPotential: number | null
}

// Interface para Lúpulos
export interface HopInventoryItem extends BaseInventoryItem {
  type: InventoryItemType.HOP
  hop: {
    id: string
    name: string
    description?: string
    origin?: string
    alphaAcids?: number
  }
  unit: HopInventoryUnit
  alphaAcidsAtPurchase: number | null
  harvestYear: number | null
  storageCondition: string | null
  // Propriedades computadas do backend
  currentAlphaAcids: number | null
  isStillFresh: boolean
}

// Interface para Leveduras
export interface YeastInventoryItem extends BaseInventoryItem {
  type: InventoryItemType.YEAST
  yeast: {
    id: string
    name: string
    description?: string
    laboratory?: string
    type?: string
  }
  unit: YeastInventoryUnit
  productionDate: string | null
  viability: number | null
  cellCount: number | null
  starter: boolean | null
  pitchingRate: number | null
  // Propriedades computadas do backend
  currentViability: number | null
  needsStarter: boolean
  currentCellCount: number | null
}

// Union type para todos os itens de inventário
export type InventoryItem =
  | FermentableInventoryItem
  | HopInventoryItem
  | YeastInventoryItem

// Interface para estatísticas do inventário
export interface InventoryStats {
  totalValue: number
  totalItems: number
  itemsNearExpiry: number
  expiredItems: number
  fermentableCount: number
  hopCount: number
  yeastCount: number
}

// Interface para o inventário completo
export interface Inventory {
  id: string
  fermentableItems: FermentableInventoryItem[]
  hopItems: HopInventoryItem[]
  yeastItems: YeastInventoryItem[]
  createdAt: string
  updatedAt: string
}

// Inputs para criar/atualizar itens
export interface CreateFermentableInventoryItemInput {
  type: InventoryItemType.FERMENTABLE
  fermentable: string
  quantity: number
  unit: FermentableInventoryUnit
  purchaseDate?: string
  bestBeforeDate?: string
  costPerUnit?: number
  extractPotential?: number
  lotNumber?: string
  moisture?: number
  protein?: number
  notes?: string
}

export interface CreateHopInventoryItemInput {
  type: InventoryItemType.HOP
  hop: string
  quantity: number
  unit: HopInventoryUnit
  purchaseDate?: string
  bestBeforeDate?: string
  costPerUnit?: number
  alphaAcidsAtPurchase?: number
  harvestYear?: number
  storageCondition?: string
  notes?: string
}

export interface CreateYeastInventoryItemInput {
  type: InventoryItemType.YEAST
  yeast: string
  quantity: number
  unit: YeastInventoryUnit
  purchaseDate?: string
  bestBeforeDate?: string
  costPerUnit?: number
  productionDate?: string
  viability?: number
  cellCount?: number
  starter?: boolean
  pitchingRate?: number
  notes?: string
}

export type CreateInventoryItemInput =
  | CreateFermentableInventoryItemInput
  | CreateHopInventoryItemInput
  | CreateYeastInventoryItemInput

export type UpdateInventoryItemInput = Partial<CreateInventoryItemInput>
