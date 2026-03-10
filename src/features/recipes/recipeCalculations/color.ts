import type { RecipeForCalculations } from './types'
import {
  KG_TO_LBS,
  LITERS_TO_GALLONS,
  MOREY_COEFFICIENT,
  MOREY_EXPONENT,
  DEFAULT_COLOR_LOVIBOND,
  SRM_TO_EBC,
} from './constants'
import { roundTo } from './utils'

export function getColorSrmAndEbc(
  recipe: Pick<RecipeForCalculations, 'fermentables'>,
  volumeLiters: number,
): { srm: number | null; ebc: number | null } {
  if (recipe.fermentables.length === 0 || volumeLiters <= 0) {
    return { srm: null, ebc: null }
  }

  const volumeGallons = volumeLiters * LITERS_TO_GALLONS
  let mcu = 0
  for (const f of recipe.fermentables) {
    const amountKg = f.amount || 0
    const colorLovibond = f.fermentable?.color ?? DEFAULT_COLOR_LOVIBOND
    const amountLbs = amountKg * KG_TO_LBS
    mcu += (amountLbs * colorLovibond) / volumeGallons
  }

  const srm = MOREY_COEFFICIENT * Math.pow(mcu, MOREY_EXPONENT)
  const ebc = srm * SRM_TO_EBC
  return {
    srm: roundTo(srm, 1),
    ebc: roundTo(ebc, 1),
  }
}
