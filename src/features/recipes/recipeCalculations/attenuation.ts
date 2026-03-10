import type { CalculationYeast } from './types'
import { TYPICAL_ATTENUATION_PERCENTAGE } from './constants'

export function getAverageAttenuation(
  yeasts: CalculationYeast[],
): number | null {
  if (yeasts.length === 0) return null

  let sum = 0
  for (const y of yeasts) {
    let yeastAttenuation = y.yeast?.attenuation
    if (yeastAttenuation === undefined || yeastAttenuation === null) {
      yeastAttenuation = TYPICAL_ATTENUATION_PERCENTAGE * 100
    }
    const num =
      typeof yeastAttenuation === 'string'
        ? parseFloat(yeastAttenuation)
        : yeastAttenuation
    const decimal = num > 1 ? num / 100 : num
    sum += decimal
  }
  return sum / yeasts.length
}
