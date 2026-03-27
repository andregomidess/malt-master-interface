import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  RecipeInput,
  RecipeUpsertInput,
  RecipeType,
  BeerStyle,
  Equipment,
  FermentableUsageType,
  WaterUsageType,
} from '../interfaces/Recipe'
import {
  FermentableForm,
  FermentableType,
} from '../../fermentable/interfaces/Fermentable'
import { computeRecipeIsDraft } from '../utils/recipeDraft'

export interface RecipeFermentable {
  id?: string
  fermentableId: string
  amount: number
  usageType?: FermentableUsageType | null
  fermentable?: {
    name: string
    type?: FermentableType
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
  contactTime?: number | null
  temperature?: number | null
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
  usageType?: WaterUsageType | null
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
    mashThickness?: number | null
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
  mashEfficiency: number | null
  brewhouseEfficiency: number | null
  preBoilVolume: number | null
  postBoilVolume: number | null
  /** v2 */
  targetVolume?: number | null
  volumeIntoFermenter?: number | null
  packagedVolume?: number | null
}

/** Opções ao montar o payload de API (ex.: forçar rascunho mesmo com receita “completa”). */
export type RecipeUpsertOptions = {
  forceDraft?: boolean
}

interface RecipeContextType {
  recipe: RecipeFormState
  updateRecipe: (updates: Partial<RecipeFormState>) => void
  addFermentable: (fermentable: RecipeFermentable) => void
  updateFermentable: (id: string, fermentable: RecipeFermentable) => void
  removeFermentable: (id: string) => void
  addHop: (hop: RecipeHop) => void
  updateHop: (id: string, hop: RecipeHop) => void
  removeHop: (id: string) => void
  addYeast: (yeast: RecipeYeast) => void
  updateYeast: (id: string, yeast: RecipeYeast) => void
  removeYeast: (id: string) => void
  addWater: (water: RecipeWater) => void
  removeWater: (id: string) => void
  resetRecipe: () => void
  getRecipeInput: (
    override?: Partial<RecipeFormState>,
    options?: RecipeUpsertOptions,
  ) => RecipeInput
  getRecipeUpsertInput: (
    override?: Partial<RecipeFormState>,
    options?: RecipeUpsertOptions,
  ) => RecipeUpsertInput
}

const initialState: RecipeFormState = {
  name: '',
  beerStyle: null,
  type: RecipeType.ALL_GRAIN,
  equipment: null,
  finalVolume: null,
  mashVolume: null,
  boilTime: 60,
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
  mashEfficiency: null,
  brewhouseEfficiency: null,
  preBoilVolume: null,
  postBoilVolume: null,
  targetVolume: null,
  volumeIntoFermenter: null,
  packagedVolume: null,
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

  const updateFermentable = useCallback(
    (id: string, fermentable: RecipeFermentable) => {
      setRecipe(prev => ({
        ...prev,
        fermentables: prev.fermentables.map(f =>
          f.id === id ? { ...fermentable, id } : f,
        ),
      }))
    },
    [],
  )

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

  const updateHop = useCallback((id: string, hop: RecipeHop) => {
    setRecipe(prev => ({
      ...prev,
      hops: prev.hops.map(h => (h.id === id ? { ...hop, id } : h)),
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

  const updateYeast = useCallback((id: string, yeast: RecipeYeast) => {
    setRecipe(prev => ({
      ...prev,
      yeasts: prev.yeasts.map(y => (y.id === id ? { ...yeast, id } : y)),
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

  const getRecipeInput = useCallback(
    (
      override?: Partial<RecipeFormState>,
      options?: RecipeUpsertOptions,
    ): RecipeInput => {
      const r = override ? { ...recipe, ...override } : recipe
      const styleId = r.beerStyle?.id
      return {
        name: r.name.trim(),
        ...(styleId ? { beerStyle: styleId } : { beerStyle: null }),
        isDraft: options?.forceDraft ? true : computeRecipeIsDraft(r),
        equipment: r.equipment?.id || null,
        imageUrl: r.imageUrl || null,
        about: r.about || null,
        notes: r.notes || null,
        type: r.type as RecipeType,
        finalVolume: r.finalVolume ?? undefined,
        targetVolume: r.targetVolume ?? undefined,
        volumeIntoFermenter: r.volumeIntoFermenter ?? undefined,
        packagedVolume: r.packagedVolume ?? undefined,
        mashVolume: r.mashVolume ?? undefined,
        boilTime: r.boilTime ?? undefined,
        originalGravity: r.originalGravity ?? undefined,
        finalGravity: r.finalGravity ?? undefined,
        estimatedIbu: r.estimatedIbu ?? undefined,
        estimatedColor: r.estimatedColor ?? undefined,
        estimatedAbv: r.estimatedAbv ?? undefined,
        mashEfficiency: r.mashEfficiency ?? undefined,
        brewhouseEfficiency: r.brewhouseEfficiency ?? undefined,
        preBoilVolume: r.preBoilVolume ?? undefined,
        postBoilVolume: r.postBoilVolume ?? undefined,
        brewDate: r.brewDate || null,
      }
    },
    [recipe],
  )

  const getRecipeUpsertInput = useCallback(
    (
      override?: Partial<RecipeFormState>,
      options?: RecipeUpsertOptions,
    ): RecipeUpsertInput => {
      const r = override ? { ...recipe, ...override } : recipe
      return {
        recipe: getRecipeInput(override, options),
        fermentables: r.fermentables
          .filter(f => f.fermentableId?.trim())
          .map(f => ({
            fermentable: f.fermentableId,
            amount: f.amount,
            usageType: f.usageType ?? undefined,
          })),
        hops: r.hops
          .filter(h => h.hopId?.trim())
          .map(h => ({
            hop: h.hopId,
            amount: h.amount,
            boilTime: h.boilTime ?? null,
            stage: h.stage,
          })),
        yeasts: r.yeasts
          .filter(y => y.yeastId?.trim())
          .map(y => ({
            yeast: y.yeastId,
            amount: y.amount ? String(y.amount) : null,
            stage: y.stage || 'primary',
          })),
        waters: r.waters
          .filter(w => w.waterId?.trim())
          .map(w => ({
            waterProfile: w.waterId,
            volume: w.amount > 0 ? w.amount : 0,
          })),
        mash: r.mash?.mashProfileId
          ? {
              mashProfile: r.mash.mashProfileId,
              actualEfficiency: r.mash.actualEfficiency ?? null,
            }
          : undefined,
        fermentation: r.fermentation?.fermentationProfileId
          ? {
              fermentationProfile: r.fermentation.fermentationProfileId,
              actualAttenuation: r.fermentation.actualAttenuation ?? null,
              finalAbv: r.fermentation.finalAbv ?? null,
              observations: r.fermentation.observations ?? null,
            }
          : undefined,
        carbonation: r.carbonation?.carbonationProfileId
          ? {
              carbonationProfile: r.carbonation.carbonationProfileId,
              amountUsed: r.carbonation.amountUsed ?? null,
              temperature: r.carbonation.temperature ?? null,
              co2Volumes: r.carbonation.co2Volumes ?? null,
            }
          : undefined,
      }
    },
    [recipe, getRecipeInput],
  )

  return (
    <RecipeContext.Provider
      value={{
        recipe,
        updateRecipe,
        addFermentable,
        updateFermentable,
        removeFermentable,
        addHop,
        updateHop,
        removeHop,
        addYeast,
        updateYeast,
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
