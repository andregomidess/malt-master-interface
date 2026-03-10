import { RecipeType } from '../interfaces/Recipe'
import { DEFAULT_EFFICIENCY, EFFICIENCY_MIN, EFFICIENCY_MAX } from './constants'
import { clamp } from './utils'

export function getEffectiveMashEfficiency(
  mashEfficiency: number | null | undefined,
  recipeType: RecipeType | '',
  mashProfileEstimatedEfficiency?: number | null,
): number {
  if (recipeType === RecipeType.EXTRACT) {
    return 100
  }
  if (mashEfficiency != null && mashEfficiency > 0) {
    return clamp(mashEfficiency, EFFICIENCY_MIN, EFFICIENCY_MAX)
  }
  if (
    mashProfileEstimatedEfficiency != null &&
    mashProfileEstimatedEfficiency > 0
  ) {
    return clamp(mashProfileEstimatedEfficiency, EFFICIENCY_MIN, EFFICIENCY_MAX)
  }
  return DEFAULT_EFFICIENCY
}
