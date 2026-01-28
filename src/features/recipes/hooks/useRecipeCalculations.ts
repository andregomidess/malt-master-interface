import { useMemo } from 'react'
import { useRecipe } from '../context/RecipeContext'
import { RecipeType } from '../interfaces/Recipe'

const DEFAULT_EFFICIENCY = 70
const DEFAULT_PPG = 37

const getEffectiveEfficiency = (
  plannedEfficiency: number | null | undefined,
  recipeType: RecipeType | '',
  mashProfileEstimatedEfficiency?: number | null,
): number => {
  if (plannedEfficiency && plannedEfficiency > 0) {
    return plannedEfficiency
  }

  if (mashProfileEstimatedEfficiency && mashProfileEstimatedEfficiency > 0) {
    return mashProfileEstimatedEfficiency
  }

  if (recipeType === RecipeType.EXTRACT) {
    return 100
  }

  return DEFAULT_EFFICIENCY
}
// const PPG_TO_METRIC_CONVERSION = 8.345404
const GRAVITY_POINTS_DIVISOR = 1000
const SPECIFIC_GRAVITY_BASE = 1.0
const ABV_CONVERSION_FACTOR = 131.25
const TYPICAL_ATTENUATION_PERCENTAGE = 0.75
const WHIRLPOOL_HOT_UTILIZATION = 0.15
const WHIRLPOOL_COLD_UTILIZATION = 0.05
const DRY_HOP_UTILIZATION = 0.0
const IBU_METRIC_CONVERSION_FACTOR = 1000
const DEFAULT_ALPHA_ACIDS = 6.0
const DEFAULT_COLOR_LOVIBOND = 2
const KG_TO_LBS = 2.20462
const LITERS_TO_GALLONS = 0.264172
const MOREY_COEFFICIENT = 1.4922
const MOREY_EXPONENT = 0.6859
const TINSETH_GRAVITY_COEFFICIENT = 1.65
const TINSETH_GRAVITY_BASE = 0.000125
const TINSETH_TIME_COEFFICIENT = 0.04
const TINSETH_TIME_DIVISOR = 4.15
const SRM_TO_EBC = 1.97

export const useRecipeCalculations = () => {
  const { recipe } = useRecipe()

  const calculations = useMemo(() => {
    const mashProfileEstimatedEfficiency =
      recipe.mash?.mashProfile?.estimatedEfficiency ?? null

    const efficiency = getEffectiveEfficiency(
      recipe.plannedEfficiency,
      recipe.type,
      mashProfileEstimatedEfficiency,
    )

    const finalVolume = recipe.finalVolume || 20

    let og: number | null = null
    if (recipe.fermentables.length > 0 && finalVolume > 0) {
      const volumeGallons = finalVolume * LITERS_TO_GALLONS

      const totalGravityPoints = recipe.fermentables.reduce((total, f) => {
        const amountKg = f.amount || 0
        const amountLbs = amountKg * KG_TO_LBS

        const fermentable = f.fermentable

        const ppg =
          fermentable?.ppg ??
          (fermentable?.yield != null
            ? (46 * fermentable.yield) / 100
            : DEFAULT_PPG)

        const points = amountLbs * ppg

        const affectedByEfficiency = fermentable?.form === 'grain'

        return total + points * (affectedByEfficiency ? efficiency / 100 : 1)
      }, 0)

      const pointsPerGallon = totalGravityPoints / volumeGallons
      og = 1 + pointsPerGallon / 1000

      og = Math.round(og * 1000) / 1000
    }

    let fg: number | null = null

    const getAttenuation = (): number | null => {
      if (recipe.yeasts.length === 0) {
        return null
      }

      const totalAttenuation = recipe.yeasts.reduce((sum, y) => {
        let yeastAttenuation = y.yeast?.attenuation
        if (yeastAttenuation === undefined || yeastAttenuation === null) {
          yeastAttenuation = TYPICAL_ATTENUATION_PERCENTAGE * 100
        }

        const attenuationNum =
          typeof yeastAttenuation === 'string'
            ? parseFloat(yeastAttenuation)
            : yeastAttenuation
        const decimalAttenuation =
          attenuationNum > 1 ? attenuationNum / 100 : attenuationNum
        return sum + decimalAttenuation
      }, 0)

      return totalAttenuation / recipe.yeasts.length
    }

    const attenuation = getAttenuation()

    if (attenuation !== null) {
      const ogForCalc = og || 1.05
      const gravityPoints = ogForCalc - SPECIFIC_GRAVITY_BASE
      const remainingPoints = gravityPoints * (1 - attenuation)
      fg = SPECIFIC_GRAVITY_BASE + remainingPoints
      fg = Math.round(fg * 1000) / 1000
    }

    let abv: number | null = null
    if (og && fg) {
      abv = (og - fg) * ABV_CONVERSION_FACTOR
      abv = Math.round(abv * 10) / 10
    }

    let ibu: number | null = null
    if (recipe.hops.length > 0 && finalVolume > 0) {
      const ogForIbuCalc = og !== null ? og : 1.05

      const totalIbuContribution = recipe.hops.reduce((total, hop) => {
        const hopAmount = hop.amount || 0
        const alphaAcidPercentage = hop.hop?.alphaAcids || DEFAULT_ALPHA_ACIDS
        const stage = hop.stage || 'boil'

        let boilTimeForCalc = 0
        if (stage === 'boil') {
          if (hop.boilTime !== undefined && hop.boilTime !== null) {
            boilTimeForCalc = hop.boilTime
          } else {
            boilTimeForCalc = recipe.boilTime || 60
          }
        }

        let utilization: number
        if (stage === 'dry_hop') {
          utilization = DRY_HOP_UTILIZATION
        } else if (stage === 'whirlpool') {
          utilization = WHIRLPOOL_HOT_UTILIZATION
        } else if (stage === 'boil') {
          const gravityPoints = ogForIbuCalc - SPECIFIC_GRAVITY_BASE
          const gravityFactor =
            TINSETH_GRAVITY_COEFFICIENT *
            Math.pow(TINSETH_GRAVITY_BASE, gravityPoints)
          const exponentialDecay =
            1 - Math.exp(-TINSETH_TIME_COEFFICIENT * boilTimeForCalc)
          const timeFactor = exponentialDecay / TINSETH_TIME_DIVISOR
          utilization = gravityFactor * timeFactor
        } else {
          utilization = WHIRLPOOL_COLD_UTILIZATION
        }

        const alphaAcidMass = hopAmount * (alphaAcidPercentage / 100)
        const ibuContribution = alphaAcidMass * utilization

        return total + ibuContribution
      }, 0)

      if (totalIbuContribution > 0) {
        ibu =
          (totalIbuContribution / Math.max(finalVolume, 1)) *
          IBU_METRIC_CONVERSION_FACTOR
        ibu = Math.round(ibu * 10) / 10
      }
    }

    let srm: number | null = null
    let ebc: number | null = null
    if (recipe.fermentables.length > 0 && finalVolume > 0) {
      const volumeGallons = finalVolume * LITERS_TO_GALLONS

      const mcu = recipe.fermentables.reduce((total, f) => {
        const amountKg = f.amount || 0
        const colorLovibond = f.fermentable?.color || DEFAULT_COLOR_LOVIBOND
        const amountLbs = amountKg * KG_TO_LBS
        return total + (amountLbs * colorLovibond) / volumeGallons
      }, 0)

      srm = MOREY_COEFFICIENT * Math.pow(mcu, MOREY_EXPONENT)
      srm = Math.round(srm * 10) / 10

      ebc = srm * SRM_TO_EBC
      ebc = Math.round(ebc * 10) / 10
    }

    return {
      originalGravity: og,
      finalGravity: fg,
      estimatedAbv: abv,
      estimatedIbu: ibu,
      estimatedColor: srm,
      estimatedEbc: ebc,
      efficiency: efficiency,
    }
  }, [
    recipe.fermentables,
    recipe.hops,
    recipe.yeasts,
    recipe.finalVolume,
    recipe.plannedEfficiency,
    recipe.boilTime,
    recipe.type,
    recipe.mash?.mashProfile?.estimatedEfficiency,
  ])

  return calculations
}
