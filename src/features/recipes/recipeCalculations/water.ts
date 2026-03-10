import type { RecipeForCalculations } from './types'
import { WaterUsageType } from '../interfaces/Recipe'
import { DEFAULT_MASH_THICKNESS, GRAIN_ABSORPTION_L_PER_KG } from './constants'
import { roundTo } from './utils'
import { isMashGrain } from './fermentable'
import { RecipeType } from '../interfaces/Recipe'

export interface WaterVolumes {
  strikeWaterVolume: number | null
  spargeWaterVolume: number | null
  totalWaterVolume: number | null
  plannedMashWater: number | null
  plannedSpargeWater: number | null
}

export function getWaterVolumes(
  recipe: Pick<
    RecipeForCalculations,
    'type' | 'fermentables' | 'waters' | 'mash' | 'preBoilVolume'
  >,
  volumeForOg: number,
): WaterVolumes {
  const result: WaterVolumes = {
    strikeWaterVolume: null,
    spargeWaterVolume: null,
    totalWaterVolume: null,
    plannedMashWater: null,
    plannedSpargeWater: null,
  }

  const grainWeight = recipe.fermentables
    .filter(isMashGrain)
    .reduce((sum, f) => sum + (f.amount || 0), 0)

  if (
    recipe.type !== RecipeType.EXTRACT &&
    recipe.fermentables.length > 0 &&
    volumeForOg > 0 &&
    grainWeight > 0
  ) {
    const mashThickness =
      recipe.mash?.mashProfile?.mashThickness ?? DEFAULT_MASH_THICKNESS
    const strike = grainWeight * mashThickness
    const grainAbsorption = grainWeight * GRAIN_ABSORPTION_L_PER_KG
    const preBoil = recipe.preBoilVolume ?? volumeForOg * 1.2
    const firstRunnings = Math.max(0, strike - grainAbsorption)
    const sparge = Math.max(0, preBoil - firstRunnings)

    result.strikeWaterVolume = roundTo(strike, 2)
    result.spargeWaterVolume = roundTo(sparge, 2)
    result.totalWaterVolume = roundTo(strike + sparge, 2)
  }

  if (recipe.waters?.length > 0) {
    const mashSum = recipe.waters
      .filter(w => w.usageType === WaterUsageType.MASH)
      .reduce((sum, w) => sum + (w.amount || 0), 0)
    const spargeSum = recipe.waters
      .filter(w => w.usageType === WaterUsageType.SPARGE)
      .reduce((sum, w) => sum + (w.amount || 0), 0)
    result.plannedMashWater = mashSum > 0 ? roundTo(mashSum, 2) : null
    result.plannedSpargeWater = spargeSum > 0 ? roundTo(spargeSum, 2) : null
  }

  return result
}
