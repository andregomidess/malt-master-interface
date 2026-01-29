import { useMemo } from 'react'
import { useRecipe } from '../context/RecipeContext'
import { RecipeType } from '../interfaces/Recipe'
import {
  EquipmentType,
  type KettleEquipment,
  type FermenterEquipment,
} from '../../equipment/interfaces/equipment'
import {
  FermentableForm,
  FermentableType,
} from '../../fermentable/interfaces/Fermentable'

const DEFAULT_EFFICIENCY = 70
const DEFAULT_PPG = 37
const DEFAULT_THERMAL_SHRINKAGE_PERCENT = 4

const getEffectiveMashEfficiency = (
  mashEfficiency: number | null | undefined,
  recipeType: RecipeType | '',
  mashProfileEstimatedEfficiency?: number | null,
): number => {
  if (mashEfficiency != null && mashEfficiency > 0) {
    const mashEfficiencyClamped = Math.min(Math.max(mashEfficiency, 55), 85)
    return mashEfficiencyClamped
  }
  if (
    mashProfileEstimatedEfficiency != null &&
    mashProfileEstimatedEfficiency > 0
  ) {
    const clamped = Math.min(Math.max(mashProfileEstimatedEfficiency, 55), 85)
    return clamped
  }
  if (recipeType === RecipeType.EXTRACT) {
    return 100
  }
  return DEFAULT_EFFICIENCY
}

const getPostBoilColdVolume = (
  recipe: {
    preBoilVolume?: number | null
    postBoilVolume?: number | null
    finalVolume?: number | null
    boilTime?: number | null
  },
  kettle: KettleEquipment | null,
): number => {
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

  return recipe.finalVolume ?? 20
}

const getVolumeIntoFermenter = (
  postBoilColdVolume: number,
  equipment: { type: string } | null | undefined,
): number => {
  const kettle =
    equipment?.type === EquipmentType.KETTLE
      ? (equipment as KettleEquipment)
      : null
  const fermenter =
    equipment?.type === EquipmentType.FERMENTER
      ? (equipment as FermenterEquipment)
      : null

  const kettleLoss = kettle?.kettleLoss ?? 0
  const fermenterLoss = fermenter?.fermenterLoss ?? 0

  return Math.max(0, postBoilColdVolume - kettleLoss - fermenterLoss)
}
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

    const mashEfficiency = getEffectiveMashEfficiency(
      recipe.mashEfficiency,
      recipe.type,
      mashProfileEstimatedEfficiency,
    )

    const equipmentWithType = recipe.equipment as
      | (KettleEquipment | FermenterEquipment)
      | null
      | undefined
    const kettle =
      equipmentWithType?.type === EquipmentType.KETTLE
        ? (equipmentWithType as KettleEquipment)
        : null

    const recipeVolumes = {
      preBoilVolume: recipe.preBoilVolume,
      postBoilVolume: recipe.postBoilVolume,
      finalVolume: recipe.finalVolume,
      boilTime: recipe.boilTime,
    }

    if (
      recipe.preBoilVolume != null &&
      recipe.preBoilVolume > 0 &&
      recipe.finalVolume != null &&
      recipe.finalVolume > 0 &&
      recipe.preBoilVolume < recipe.finalVolume
    ) {
      console.warn('preBoilVolume menor que finalVolume — dados inválidos', {
        preBoilVolume: recipe.preBoilVolume,
        finalVolume: recipe.finalVolume,
      })
    }

    const postBoilColdVolume = getPostBoilColdVolume(recipeVolumes, kettle)

    const volumeIntoFermenter = getVolumeIntoFermenter(
      postBoilColdVolume,
      equipmentWithType,
    )

    const volumeForOg = postBoilColdVolume

    let og: number | null = null
    if (recipe.fermentables.length > 0 && volumeForOg > 0) {
      const volumeGallons = volumeForOg * LITERS_TO_GALLONS

      const totalGravityPoints = recipe.fermentables.reduce((total, f) => {
        const amountKg = f.amount || 0
        const amountLbs = amountKg * KG_TO_LBS

        const fermentable = f.fermentable

        let ppg: number
        if (fermentable?.ppg != null) {
          ppg = fermentable.ppg
        } else if (fermentable?.yield != null) {
          ppg = (46 * fermentable.yield) / 100
        } else {
          ppg = DEFAULT_PPG
        }

        const points = amountLbs * ppg

        const isExtractForm =
          fermentable?.form === FermentableForm.DRY_EXTRACT ||
          fermentable?.form === FermentableForm.LIQUID_EXTRACT ||
          fermentable?.form === FermentableForm.SYRUP
        const affectedByEfficiency =
          !isExtractForm &&
          fermentable?.type !== FermentableType.SUGAR &&
          (fermentable?.type === FermentableType.BASE ||
            fermentable?.type === FermentableType.SPECIALTY ||
            (fermentable?.type === FermentableType.ADJUNCT &&
              fermentable?.form === FermentableForm.GRAIN))

        return (
          total + points * (affectedByEfficiency ? mashEfficiency / 100 : 1)
        )
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
    if (recipe.hops.length > 0 && volumeForOg > 0) {
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
          (totalIbuContribution / Math.max(volumeForOg, 1)) *
          IBU_METRIC_CONVERSION_FACTOR
        ibu = Math.round(ibu * 10) / 10
      }
    }

    let srm: number | null = null
    let ebc: number | null = null
    if (recipe.fermentables.length > 0 && volumeForOg > 0) {
      const volumeGallons = volumeForOg * LITERS_TO_GALLONS

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
      efficiency: mashEfficiency,
      postBoilColdVolume,
      volumeIntoFermenter,
    }
  }, [
    recipe.fermentables,
    recipe.hops,
    recipe.yeasts,
    recipe.finalVolume,
    recipe.preBoilVolume,
    recipe.postBoilVolume,
    recipe.mashEfficiency,
    recipe.boilTime,
    recipe.type,
    recipe.equipment,
    recipe.mash?.mashProfile?.estimatedEfficiency,
  ])

  return calculations
}
