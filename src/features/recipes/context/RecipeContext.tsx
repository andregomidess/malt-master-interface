import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  RecipeInput,
  RecipeUpsertInput,
  RecipeType,
  BeerStyle,
  Equipment,
} from '../interfaces/Recipe'
import { FermentableForm } from '../../fermentable/interfaces/Fermentable'

export interface RecipeFermentable {
  id?: string
  fermentableId: string
  amount: number
  fermentable?: {
    name: string
    color?: number
    yield?: number
    ppg?: number
    form?: FermentableForm
  }
}

export interface RecipeHop {
  id?: string
  hopId: string
  amount: number
  boilTime?: number
  stage?: 'boil' | 'whirlpool' | 'dry_hop'
  hop?: {
    name: string
    alphaAcids?: number
  }
}

export interface RecipeYeast {
  id?: string
  yeastId: string
  amount?: number
  stage?: 'primary' | 'secondary' | 'starter'
  yeast?: {
    name: string
    attenuation?: number
  }
}

export interface RecipeWater {
  id?: string
  waterId: string
  amount: number
  water?: {
    name: string
  }
}

export interface RecipeMash {
  mashProfileId?: string
  mashProfile?: {
    id: string
    name: string
    estimatedEfficiency?: number | null
  }
  actualEfficiency?: number | null
}

export interface RecipeFermentation {
  fermentationProfileId?: string
  fermentationProfile?: {
    id: string
    name: string
    estimatedAttenuation?: number | null
  }
  actualAttenuation?: number | null
  finalAbv?: number | null
  observations?: string | null
}

export interface RecipeCarbonation {
  carbonationProfileId?: string
  carbonationProfile?: {
    id: string
    name: string
    targetCO2Volumes?: number
  }
  amountUsed?: string | null
  temperature?: number | null
  co2Volumes?: number | null
}

export interface RecipeFormState {
  name: string
  beerStyle: BeerStyle | null
  type: RecipeType | ''
  equipment: Equipment | null
  finalVolume: number | null
  mashVolume: number | null
  boilTime: number | null
  brewDate: string | null
  imageUrl: string | null
  about: string | null
  notes: string | null

  fermentables: RecipeFermentable[]
  hops: RecipeHop[]
  yeasts: RecipeYeast[]
  waters: RecipeWater[]

  mash: RecipeMash | null
  fermentation: RecipeFermentation | null
  carbonation: RecipeCarbonation | null

  originalGravity: number | null
  finalGravity: number | null
  estimatedIbu: number | null
  estimatedColor: number | null
  estimatedAbv: number | null
  plannedEfficiency: number | null
}

interface RecipeContextType {
  recipe: RecipeFormState
  updateRecipe: (updates: Partial<RecipeFormState>) => void
  addFermentable: (fermentable: RecipeFermentable) => void
  removeFermentable: (id: string) => void
  addHop: (hop: RecipeHop) => void
  removeHop: (id: string) => void
  addYeast: (yeast: RecipeYeast) => void
  removeYeast: (id: string) => void
  addWater: (water: RecipeWater) => void
  removeWater: (id: string) => void
  resetRecipe: () => void
  getRecipeInput: () => RecipeInput
  getRecipeUpsertInput: () => RecipeUpsertInput
}

const initialState: RecipeFormState = {
  name: '',
  beerStyle: null,
  type: '',
  equipment: null,
  finalVolume: null,
  mashVolume: null,
  boilTime: null,
  brewDate: new Date().toISOString().split('T')[0],
  imageUrl: null,
  about: null,
  notes: null,
  fermentables: [],
  hops: [],
  yeasts: [],
  waters: [],
  mash: null,
  fermentation: null,
  carbonation: null,
  originalGravity: null,
  finalGravity: null,
  estimatedIbu: null,
  estimatedColor: null,
  estimatedAbv: null,
  plannedEfficiency: null,
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recipe, setRecipe] = useState<RecipeFormState>(initialState)

  const updateRecipe = useCallback((updates: Partial<RecipeFormState>) => {
    setRecipe(prev => ({ ...prev, ...updates }))
  }, [])

  const addFermentable = useCallback((fermentable: RecipeFermentable) => {
    setRecipe(prev => ({
      ...prev,
      fermentables: [
        ...prev.fermentables,
        { ...fermentable, id: Date.now().toString() },
      ],
    }))
  }, [])

  const removeFermentable = useCallback((id: string) => {
    setRecipe(prev => ({
      ...prev,
      fermentables: prev.fermentables.filter(f => f.id !== id),
    }))
  }, [])

  const addHop = useCallback((hop: RecipeHop) => {
    setRecipe(prev => ({
      ...prev,
      hops: [...prev.hops, { ...hop, id: Date.now().toString() }],
    }))
  }, [])

  const removeHop = useCallback((id: string) => {
    setRecipe(prev => ({
      ...prev,
      hops: prev.hops.filter(h => h.id !== id),
    }))
  }, [])

  const addYeast = useCallback((yeast: RecipeYeast) => {
    setRecipe(prev => ({
      ...prev,
      yeasts: [...prev.yeasts, { ...yeast, id: Date.now().toString() }],
    }))
  }, [])

  const removeYeast = useCallback((id: string) => {
    setRecipe(prev => ({
      ...prev,
      yeasts: prev.yeasts.filter(y => y.id !== id),
    }))
  }, [])

  const addWater = useCallback((water: RecipeWater) => {
    setRecipe(prev => ({
      ...prev,
      waters: [...prev.waters, { ...water, id: Date.now().toString() }],
    }))
  }, [])

  const removeWater = useCallback((id: string) => {
    setRecipe(prev => ({
      ...prev,
      waters: prev.waters.filter(w => w.id !== id),
    }))
  }, [])

  const resetRecipe = useCallback(() => {
    setRecipe(initialState)
  }, [])

  const getRecipeInput = useCallback((): RecipeInput => {
    return {
      name: recipe.name,
      beerStyle: recipe.beerStyle?.id || '',
      equipment: recipe.equipment?.id || null,
      imageUrl: recipe.imageUrl || null,
      about: recipe.about || null,
      notes: recipe.notes || null,
      type: recipe.type as RecipeType,
      finalVolume: recipe.finalVolume ?? undefined,
      mashVolume: recipe.mashVolume ?? undefined,
      boilTime: recipe.boilTime ?? undefined,
      originalGravity: recipe.originalGravity ?? undefined,
      finalGravity: recipe.finalGravity ?? undefined,
      estimatedIbu: recipe.estimatedIbu ?? undefined,
      estimatedColor: recipe.estimatedColor ?? undefined,
      estimatedAbv: recipe.estimatedAbv ?? undefined,
      plannedEfficiency: recipe.plannedEfficiency ?? undefined,
      brewDate: recipe.brewDate || null,
    }
  }, [recipe])

  const getRecipeUpsertInput = useCallback((): RecipeUpsertInput => {
    return {
      recipe: getRecipeInput(),
      fermentables: recipe.fermentables.map(f => ({
        fermentable: f.fermentableId,
        amount: f.amount,
      })),
      hops: recipe.hops.map(h => ({
        hop: h.hopId,
        amount: h.amount,
        boilTime: h.boilTime ?? null,
        stage: h.stage,
      })),
      yeasts: recipe.yeasts.map(y => ({
        yeast: y.yeastId,
        amount: y.amount ? String(y.amount) : null,
        stage: y.stage || 'primary',
      })),
      waters: recipe.waters.map(w => ({
        waterProfile: w.waterId,
        volume: w.amount,
      })),
      mash: recipe.mash?.mashProfileId
        ? {
            mashProfile: recipe.mash.mashProfileId,
            actualEfficiency: recipe.mash.actualEfficiency ?? null,
          }
        : undefined,
      fermentation: recipe.fermentation?.fermentationProfileId
        ? {
            fermentationProfile: recipe.fermentation.fermentationProfileId,
            actualAttenuation: recipe.fermentation.actualAttenuation ?? null,
            finalAbv: recipe.fermentation.finalAbv ?? null,
            observations: recipe.fermentation.observations ?? null,
          }
        : undefined,
      carbonation: recipe.carbonation?.carbonationProfileId
        ? {
            carbonationProfile: recipe.carbonation.carbonationProfileId,
            amountUsed: recipe.carbonation.amountUsed ?? null,
            temperature: recipe.carbonation.temperature ?? null,
            co2Volumes: recipe.carbonation.co2Volumes ?? null,
          }
        : undefined,
    }
  }, [recipe, getRecipeInput])

  return (
    <RecipeContext.Provider
      value={{
        recipe,
        updateRecipe,
        addFermentable,
        removeFermentable,
        addHop,
        removeHop,
        addYeast,
        removeYeast,
        addWater,
        removeWater,
        resetRecipe,
        getRecipeInput,
        getRecipeUpsertInput,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}

export const useRecipe = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipe must be used within RecipeProvider')
  }
  return context
}
