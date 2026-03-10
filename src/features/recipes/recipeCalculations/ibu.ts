import type { CalculationHop } from './types'
import {
  SPECIFIC_GRAVITY_BASE,
  DEFAULT_ALPHA_ACIDS,
  DRY_HOP_UTILIZATION,
  WHIRLPOOL_HOT_UTILIZATION,
  WHIRLPOOL_COLD_UTILIZATION,
  IBU_METRIC_CONVERSION_FACTOR,
  TINSETH_GRAVITY_COEFFICIENT,
  TINSETH_GRAVITY_BASE,
  TINSETH_TIME_COEFFICIENT,
  TINSETH_TIME_DIVISOR,
  WHIRLPOOL_HOT_TEMP_THRESHOLD,
} from './constants'
import { roundTo } from './utils'

export function getHopUtilization(
  hop: CalculationHop,
  recipeBoilTimeMin: number,
  og: number,
): number {
  const stage = hop.stage || 'boil'

  if (stage === 'dry_hop') {
    return DRY_HOP_UTILIZATION
  }

  if (stage === 'whirlpool') {
    const temp = hop.temperature ?? 90
    const contactMin = hop.contactTime ?? 20
    const isHot = temp >= WHIRLPOOL_HOT_TEMP_THRESHOLD
    const baseUtil = isHot
      ? WHIRLPOOL_HOT_UTILIZATION
      : WHIRLPOOL_COLD_UTILIZATION
    const timeFactor = Math.min(contactMin / 20, 1.5)
    return baseUtil * timeFactor
  }

  if (stage === 'boil') {
    const boilTimeForCalc =
      hop.boilTime != null ? hop.boilTime : recipeBoilTimeMin
    const gravityPoints = og - SPECIFIC_GRAVITY_BASE
    const gravityFactor =
      TINSETH_GRAVITY_COEFFICIENT *
      Math.pow(TINSETH_GRAVITY_BASE, gravityPoints)
    const exponentialDecay =
      1 - Math.exp(-TINSETH_TIME_COEFFICIENT * boilTimeForCalc)
    const timeFactor = exponentialDecay / TINSETH_TIME_DIVISOR
    return gravityFactor * timeFactor
  }

  return WHIRLPOOL_COLD_UTILIZATION
}

export function getIbu(
  hops: CalculationHop[],
  volumeLiters: number,
  og: number | null,
  recipeBoilTimeMin: number,
): number | null {
  if (hops.length === 0 || volumeLiters <= 0) return null
  const ogForCalc = og ?? 1.05

  let totalContribution = 0
  for (const hop of hops) {
    const hopAmount = hop.amount || 0
    const alphaPct = hop.hop?.alphaAcids ?? DEFAULT_ALPHA_ACIDS
    const utilization = getHopUtilization(hop, recipeBoilTimeMin, ogForCalc)
    const alphaMass = hopAmount * (alphaPct / 100)
    totalContribution += alphaMass * utilization
  }

  if (totalContribution <= 0) return null
  const ibu =
    (totalContribution / Math.max(volumeLiters, 1)) *
    IBU_METRIC_CONVERSION_FACTOR
  return roundTo(ibu, 1)
}
