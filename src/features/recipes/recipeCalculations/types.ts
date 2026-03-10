/**
 * Tipos mínimos para os cálculos de receita.
 * Espelham a forma do recipe do RecipeContext para manter funções puras.
 */

import type {
  RecipeType,
  FermentableUsageType,
  WaterUsageType,
} from '../interfaces/Recipe'
import type {
  FermentableForm,
  FermentableType,
} from '../../fermentable/interfaces/Fermentable'
import type {
  KettleEquipment,
  FermenterEquipment,
} from '../../equipment/interfaces/equipment'

export interface CalculationFermentable {
  amount: number
  usageType?: FermentableUsageType | null
  fermentable?: {
    type?: FermentableType
    form?: FermentableForm
    ppg?: number | null
    yield?: number | null
    color?: number | null
  }
}

export interface CalculationHop {
  amount: number
  boilTime?: number | null
  stage?: 'boil' | 'whirlpool' | 'dry_hop'
  contactTime?: number | null
  temperature?: number | null
  hop?: { alphaAcids?: number }
}

export interface CalculationYeast {
  yeast?: { attenuation?: number | string | null }
}

export interface CalculationWater {
  amount: number
  usageType?: WaterUsageType | null
}

export interface CalculationMash {
  mashProfile?: {
    estimatedEfficiency?: number | null
    mashThickness?: number | null
  }
}

export interface RecipeForCalculations {
  type: RecipeType | ''
  mashEfficiency?: number | null
  preBoilVolume?: number | null
  postBoilVolume?: number | null
  boilTime?: number | null
  targetVolume?: number | null
  volumeIntoFermenter?: number | null
  packagedVolume?: number | null
  finalVolume?: number | null
  fermentables: CalculationFermentable[]
  hops: CalculationHop[]
  yeasts: CalculationYeast[]
  waters: CalculationWater[]
  mash?: CalculationMash | null
  equipment?: { type: string } | null
}

export type EquipmentForCalculations =
  | KettleEquipment
  | FermenterEquipment
  | null
  | undefined
