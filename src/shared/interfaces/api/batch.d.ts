import type { EntityRef, ISODateString } from './common'
import type { RecipeApi } from './recipe'
import type { EquipmentApi } from './equipment'

export enum BatchStatus {
  PLANNED = 'planned',
  FERMENTING = 'fermenting',
  MATURING = 'maturing',
  PACKAGED = 'packaged',
  COMPLETED = 'completed',
}

export interface BatchApi {
  id: string
  recipe: EntityRef<RecipeApi>
  user: string // não populado nas listagens atuais
  equipment: EntityRef<EquipmentApi> | null

  batchCode: string | null
  name: string | null

  brewDate: ISODateString | null
  packagingDate: ISODateString | null
  readyDate: ISODateString | null

  status: BatchStatus

  plannedVolume: number | null
  finalVolume: number | null
  actualOriginalGravity: number | null
  actualFinalGravity: number | null
  actualIbu: number | null
  actualColor: number | null
  actualAbv: number | null
  actualEfficiency: number | null
  fermentationTemperature: number | null
  fermentationTime: number | null
  actualCarbonation: number | null
  observations: string | null
}
