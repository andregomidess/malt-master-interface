import type { RecipeForCalculations } from './types'
import {
  SPECIFIC_GRAVITY_BASE,
  ABV_CONVERSION_FACTOR,
  KG_TO_LBS,
  LITERS_TO_GALLONS,
} from './constants'
import { roundTo } from './utils'
import { getFermentablePpg, shouldAffectMashEfficiency } from './fermentable'

export function getOriginalGravity(
  recipe: Pick<RecipeForCalculations, 'fermentables'>,
  volumeLiters: number,
  mashEfficiency: number,
): number | null {
  if (recipe.fermentables.length === 0 || volumeLiters <= 0) return null

  const volumeGallons = volumeLiters * LITERS_TO_GALLONS
  let totalPoints = 0

  for (const f of recipe.fermentables) {
    const amountKg = f.amount || 0
    const amountLbs = amountKg * KG_TO_LBS
    const ppg = getFermentablePpg(f.fermentable)
    const points = amountLbs * ppg
    const factor = shouldAffectMashEfficiency(f) ? mashEfficiency / 100 : 1
    totalPoints += points * factor
  }

  const pointsPerGallon = totalPoints / volumeGallons
  const og = SPECIFIC_GRAVITY_BASE + pointsPerGallon / 1000
  return roundTo(og, 3)
}

export function getFinalGravity(
  og: number | null,
  attenuation: number | null,
): number | null {
  if (attenuation === null) return null
  const ogForCalc = og ?? 1.05
  const gravityPoints = ogForCalc - SPECIFIC_GRAVITY_BASE
  const remaining = gravityPoints * (1 - attenuation)
  const fg = SPECIFIC_GRAVITY_BASE + remaining
  return roundTo(fg, 3)
}

export function getAbv(og: number | null, fg: number | null): number | null {
  if (og == null || fg == null) return null
  const abv = (og - fg) * ABV_CONVERSION_FACTOR
  return roundTo(abv, 1)
}
