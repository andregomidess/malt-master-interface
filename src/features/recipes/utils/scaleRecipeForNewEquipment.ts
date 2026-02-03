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
import type {
  RecipeFormState,
  RecipeFermentable,
  RecipeHop,
  RecipeYeast,
  RecipeWater,
} from '../context/RecipeContext'

const DEFAULT_THERMAL_SHRINKAGE_PERCENT = 4
const DEFAULT_EFFICIENCY = 70

const round = (n: number, decimals: number) => {
  const p = 10 ** decimals
  return Math.round(n * p) / p
}

const safeNum = (n: number | null | undefined, fallback: number) =>
  typeof n === 'number' && !Number.isNaN(n) ? n : fallback

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max)

const getEffectiveMashEfficiency = (
  mashEfficiency: number | null | undefined,
  recipeType: RecipeType | '',
  mashProfileEstimatedEfficiency?: number | null,
): number => {
  if (mashEfficiency != null && mashEfficiency > 0) {
    return clamp(mashEfficiency, 55, 85)
  }
  if (
    mashProfileEstimatedEfficiency != null &&
    mashProfileEstimatedEfficiency > 0
  ) {
    return clamp(mashProfileEstimatedEfficiency, 55, 85)
  }
  if (recipeType === RecipeType.EXTRACT) return 100
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
  const boilTimeMin = safeNum(recipe.boilTime, 60)
  const thermalShrinkage =
    safeNum(
      kettle?.thermalShrinkagePercent,
      DEFAULT_THERMAL_SHRINKAGE_PERCENT,
    ) / 100
  const boilOffRatePerHour = safeNum(kettle?.boilOffRate, 0)

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

  return safeNum(recipe.finalVolume, 20)
}

const computeVolumesFromTargetCold = (
  targetPostBoilCold: number,
  boilTimeMin: number,
  kettle: KettleEquipment | null,
) => {
  const shrink =
    safeNum(
      kettle?.thermalShrinkagePercent,
      DEFAULT_THERMAL_SHRINKAGE_PERCENT,
    ) / 100
  const boilOffRatePerHour = safeNum(kettle?.boilOffRate, 0)
  const boilOff = boilOffRatePerHour * (boilTimeMin / 60)

  const postBoilHot = targetPostBoilCold / Math.max(1 - shrink, 0.0001)
  const preBoil = postBoilHot + boilOff

  return {
    finalVolume: round(targetPostBoilCold, 2),
    postBoilVolume: round(postBoilHot, 2),
    preBoilVolume: round(preBoil, 2),
  }
}

export type EquipmentUnion = (KettleEquipment | FermenterEquipment) & {
  type: EquipmentType
}

export interface ScaleRecipeResult {
  equipment: EquipmentUnion
  finalVolume: number
  preBoilVolume?: number
  postBoilVolume?: number
  fermentables: RecipeFermentable[]
  hops: RecipeHop[]
  yeasts: RecipeYeast[]
  waters: RecipeWater[]
}

export function scaleRecipeForNewEquipment(
  recipe: RecipeFormState,
  oldEquipment: EquipmentUnion | null,
  newEquipment: EquipmentUnion,
  opts?: {
    targetFinalColdVolume?: number
    preserveOg?: boolean
  },
): ScaleRecipeResult {
  const preserveOg = opts?.preserveOg ?? true

  const oldKettle =
    oldEquipment?.type === EquipmentType.KETTLE
      ? (oldEquipment as KettleEquipment)
      : null
  const newKettle =
    newEquipment.type === EquipmentType.KETTLE
      ? (newEquipment as KettleEquipment)
      : null

  const oldCold = getPostBoilColdVolume(
    {
      preBoilVolume: recipe.preBoilVolume,
      postBoilVolume: recipe.postBoilVolume,
      finalVolume: recipe.finalVolume,
      boilTime: recipe.boilTime,
    },
    oldKettle,
  )

  const targetCold = safeNum(
    opts?.targetFinalColdVolume,
    safeNum(newEquipment.usableVolume, oldCold),
  )

  const factorVolume = targetCold / Math.max(oldCold, 0.0001)

  const mashProfileEstimatedEfficiency =
    recipe.mash?.mashProfile?.estimatedEfficiency ?? null
  const effOld = getEffectiveMashEfficiency(
    recipe.mashEfficiency,
    recipe.type,
    mashProfileEstimatedEfficiency,
  )
  const effNew = effOld

  const factorGrain = preserveOg
    ? factorVolume * (effOld / Math.max(effNew, 1))
    : factorVolume

  const fermentables = (recipe.fermentables ?? []).map(
    (f: RecipeFermentable) => {
      const fermentable = f.fermentable

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

      const factor = affectedByEfficiency ? factorGrain : factorVolume

      return {
        ...f,
        amount: round(safeNum(f.amount, 0) * factor, 3),
      }
    },
  )

  const hops = (recipe.hops ?? []).map((h: RecipeHop) => ({
    ...h,
    amount: Math.round(safeNum(h.amount, 0) * factorVolume),
  }))

  const yeasts = (recipe.yeasts ?? []).map((y: RecipeYeast) => ({
    ...y,
    amount:
      y.amount == null
        ? y.amount
        : round(safeNum(y.amount, 0) * factorVolume, 2),
  }))

  const waters = (recipe.waters ?? []).map((w: RecipeWater) => ({
    ...w,
    amount: round(safeNum(w.amount, 0) * factorVolume, 2),
  }))

  const boilTimeMin = safeNum(recipe.boilTime, 60)

  const volumePatch =
    newEquipment.type === EquipmentType.KETTLE
      ? computeVolumesFromTargetCold(targetCold, boilTimeMin, newKettle)
      : {
          finalVolume: round(targetCold, 2),
        }

  return {
    equipment: newEquipment,
    ...volumePatch,
    fermentables,
    hops,
    yeasts,
    waters,
  }
}
