import type { KettleEquipment } from '../../equipment/interfaces/equipment'
import type { EquipmentForCalculations, RecipeForCalculations } from './types'
import { EquipmentType } from '../../equipment/interfaces/equipment'
import { DEFAULT_THERMAL_SHRINKAGE_PERCENT } from './constants'

/**
 * Volume base pós-fervura, frio (após contração térmica).
 * Prioridade: preBoil+boilOff → postBoil → volumeIntoFermenter → packagedVolume → targetVolume → finalVolume (legado) → 20 L.
 * Usa do equipamento (kettle): boilOffRate (L/h), thermalShrinkagePercent (%).
 */
export function getPostBoilColdVolume(
  recipe: Pick<
    RecipeForCalculations,
    | 'preBoilVolume'
    | 'postBoilVolume'
    | 'volumeIntoFermenter'
    | 'packagedVolume'
    | 'targetVolume'
    | 'finalVolume'
    | 'boilTime'
  >,
  kettle: KettleEquipment | null,
): number {
  const boilTimeMin = recipe.boilTime ?? 60
  const thermalShrinkage =
    (kettle?.thermalShrinkagePercent ?? DEFAULT_THERMAL_SHRINKAGE_PERCENT) / 100
  const boilOffRatePerHour = kettle?.boilOffRate ?? 0

  if (
    recipe.preBoilVolume != null &&
    recipe.preBoilVolume > 0 &&
    boilOffRatePerHour > 0
  ) {
    const boilOff = boilOffRatePerHour * (boilTimeMin / 60)
    const postBoilHot = Math.max(0, recipe.preBoilVolume - boilOff)
    return postBoilHot * (1 - thermalShrinkage)
  }

  if (recipe.postBoilVolume != null && recipe.postBoilVolume > 0) {
    return recipe.postBoilVolume * (1 - thermalShrinkage)
  }

  if (recipe.volumeIntoFermenter != null && recipe.volumeIntoFermenter > 0) {
    return recipe.volumeIntoFermenter
  }

  if (recipe.packagedVolume != null && recipe.packagedVolume > 0) {
    return recipe.packagedVolume
  }

  if (recipe.targetVolume != null && recipe.targetVolume > 0) {
    return recipe.targetVolume
  }

  return recipe.finalVolume ?? 20
}

/**
 * Volume que entra no fermentador (L).
 * postBoilColdVolume menos perdas: kettleLoss (panela) + fermenterLoss (fermentador).
 * Fallback seguro: perdas 0 quando equipamento ausente.
 */
export function getVolumeIntoFermenter(
  postBoilColdVolume: number,
  equipment: EquipmentForCalculations,
): number {
  const kettle = equipment?.type === EquipmentType.KETTLE ? equipment : null
  const fermenter =
    equipment?.type === EquipmentType.FERMENTER ? equipment : null

  const kettleLoss = kettle?.kettleLoss ?? 0
  const fermenterLoss = fermenter?.fermenterLoss ?? 0

  return Math.max(0, postBoilColdVolume - kettleLoss - fermenterLoss)
}
