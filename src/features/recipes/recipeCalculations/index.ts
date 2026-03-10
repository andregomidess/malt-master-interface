import { EquipmentType } from '../../equipment/interfaces/equipment'
import type { KettleEquipment } from '../../equipment/interfaces/equipment'
import type { RecipeForCalculations, EquipmentForCalculations } from './types'
import { getEffectiveMashEfficiency } from './efficiency'
import { getPostBoilColdVolume, getVolumeIntoFermenter } from './volume'
import { getAverageAttenuation } from './attenuation'
import { getOriginalGravity, getFinalGravity, getAbv } from './gravity'
import { getIbu } from './ibu'
import { getColorSrmAndEbc } from './color'
import { getWaterVolumes } from './water'

export interface RecipeCalculationsResult {
  originalGravity: number | null
  finalGravity: number | null
  estimatedAbv: number | null
  estimatedIbu: number | null
  estimatedColor: number | null
  estimatedEbc: number | null
  efficiency: number
  postBoilColdVolume: number
  volumeIntoFermenter: number
  strikeWaterVolume: number | null
  spargeWaterVolume: number | null
  totalWaterVolume: number | null
  plannedMashWater: number | null
  plannedSpargeWater: number | null
}

export function computeRecipeCalculations(
  recipe: RecipeForCalculations,
  equipment: EquipmentForCalculations,
): RecipeCalculationsResult {
  const kettle =
    equipment?.type === EquipmentType.KETTLE
      ? (equipment as KettleEquipment)
      : null

  const mashProfileEfficiency =
    recipe.mash?.mashProfile?.estimatedEfficiency ?? null
  const efficiency = getEffectiveMashEfficiency(
    recipe.mashEfficiency,
    recipe.type,
    mashProfileEfficiency,
  )

  const postBoilColdVolume = getPostBoilColdVolume(recipe, kettle)
  const volumeIntoFermenter = getVolumeIntoFermenter(
    postBoilColdVolume,
    equipment,
  )
  const volumeForOg = postBoilColdVolume

  const og = getOriginalGravity(recipe, volumeForOg, efficiency)
  const attenuation = getAverageAttenuation(recipe.yeasts)
  const fg = getFinalGravity(og, attenuation)
  const abv = getAbv(og, fg)

  const recipeBoilTimeMin = recipe.boilTime ?? 60
  const ibu = getIbu(recipe.hops, volumeForOg, og ?? null, recipeBoilTimeMin)
  const { srm: estimatedColor, ebc: estimatedEbc } = getColorSrmAndEbc(
    recipe,
    volumeForOg,
  )

  const water = getWaterVolumes(recipe, volumeForOg)

  return {
    originalGravity: og,
    finalGravity: fg,
    estimatedAbv: abv,
    estimatedIbu: ibu,
    estimatedColor,
    estimatedEbc,
    efficiency,
    postBoilColdVolume,
    volumeIntoFermenter,
    strikeWaterVolume: water.strikeWaterVolume,
    spargeWaterVolume: water.spargeWaterVolume,
    totalWaterVolume: water.totalWaterVolume,
    plannedMashWater: water.plannedMashWater,
    plannedSpargeWater: water.plannedSpargeWater,
  }
}

export { getEffectiveMashEfficiency } from './efficiency'
export { getPostBoilColdVolume, getVolumeIntoFermenter } from './volume'
export {
  getFermentablePpg,
  shouldAffectMashEfficiency,
  isMashGrain,
} from './fermentable'
export { getAverageAttenuation } from './attenuation'
export { getHopUtilization } from './ibu'
export type { RecipeForCalculations, EquipmentForCalculations } from './types'
