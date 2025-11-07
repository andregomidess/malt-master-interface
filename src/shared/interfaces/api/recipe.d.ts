import type { EntityRef, ISODateString } from './common'
import type { EquipmentApi } from './equipment'

export enum RecipeType {
  ALL_GRAIN = 'all_grain',
  PARTIAL_MASH = 'partial_mash',
  EXTRACT = 'extract',
}

export interface RecipeApi {
  id: string
  user: string | null
  beerStyle: string // id ou objeto populado em futuras respostas
  equipment: EntityRef<EquipmentApi> | null

  // Relacionamentos detalhados (quando populados em outras rotas)
  mash?: unknown
  fermentation?: unknown
  carbonation?: unknown
  fermentables?: unknown[]
  hops?: unknown[]
  yeasts?: unknown[]
  waters?: unknown[]

  name: string
  imageUrl: string | null
  about: string | null
  notes: string | null
  type: RecipeType

  plannedVolume: number | null
  finalVolume: number | null
  originalGravity: number | null
  finalGravity: number | null
  estimatedIbu: number | null
  estimatedColor: number | null
  estimatedAbv: number | null
  plannedEfficiency: number | null
  actualEfficiency: number | null

  createdAt: ISODateString
  updatedAt: ISODateString
  brewDate: ISODateString | null
}
