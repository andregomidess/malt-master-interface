import {
  FermentableForm,
  FermentableType,
} from '../../fermentable/interfaces/Fermentable'
import { FermentableUsageType } from '../interfaces/Recipe'
import type { CalculationFermentable } from './types'
import { DEFAULT_PPG } from './constants'

export function getFermentablePpg(
  fermentable: CalculationFermentable['fermentable'],
): number {
  if (fermentable?.ppg != null) {
    return fermentable.ppg
  }
  if (fermentable?.yield != null) {
    return (46 * fermentable.yield) / 100
  }
  return DEFAULT_PPG
}

export function shouldAffectMashEfficiency(f: CalculationFermentable): boolean {
  const fermentable = f.fermentable

  const usageType = f.usageType
  if (usageType != null) {
    return (
      usageType === FermentableUsageType.MASH ||
      usageType === FermentableUsageType.STEEP
    )
  }

  const isExtractForm =
    fermentable?.form === FermentableForm.DRY_EXTRACT ||
    fermentable?.form === FermentableForm.LIQUID_EXTRACT ||
    fermentable?.form === FermentableForm.SYRUP
  if (isExtractForm) return false
  if (fermentable?.type === FermentableType.SUGAR) return false

  const isMashGrain =
    fermentable?.type === FermentableType.BASE ||
    fermentable?.type === FermentableType.SPECIALTY ||
    (fermentable?.type === FermentableType.ADJUNCT &&
      fermentable?.form === FermentableForm.GRAIN)
  return isMashGrain
}

export function isMashGrain(f: CalculationFermentable): boolean {
  const fermentable = f.fermentable
  return (
    fermentable?.type === FermentableType.BASE ||
    fermentable?.type === FermentableType.SPECIALTY ||
    (fermentable?.type === FermentableType.ADJUNCT &&
      fermentable?.form === FermentableForm.GRAIN)
  )
}
