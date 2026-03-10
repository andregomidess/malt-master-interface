/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react'
import { useRecipe } from '../context/RecipeContext'
import {
  computeRecipeCalculations,
  type RecipeForCalculations,
  type EquipmentForCalculations,
} from '../recipeCalculations'

export const useRecipeCalculations = () => {
  const { recipe } = useRecipe()

  return useMemo(() => {
    return computeRecipeCalculations(
      recipe as RecipeForCalculations,
      recipe.equipment as EquipmentForCalculations,
    )
  }, [
    recipe.fermentables,
    recipe.hops,
    recipe.yeasts,
    recipe.waters,
    recipe.finalVolume,
    recipe.preBoilVolume,
    recipe.postBoilVolume,
    recipe.targetVolume,
    recipe.volumeIntoFermenter,
    recipe.packagedVolume,
    recipe.mashEfficiency,
    recipe.boilTime,
    recipe.type,
    recipe.equipment,
    recipe.mash?.mashProfile?.estimatedEfficiency,
    recipe.mash?.mashProfile?.mashThickness,
  ])
}
