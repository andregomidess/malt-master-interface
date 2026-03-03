import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { Button } from '../../../shared/components/Button'
import { RecipeProvider, useRecipe } from '../context/RecipeContext'
import { Tabs } from '../components/Tabs'
import { RecipeSidebar } from '../components/RecipeSidebar'
import { useRecipeCalculations } from '../hooks/useRecipeCalculations'
import { BasicTab } from '../components/tabs/BasicTab'
import { FermentablesTab } from '../components/tabs/FermentablesTab'
import { HopsTab } from '../components/tabs/HopsTab'
import { YeastsTab } from '../components/tabs/YeastsTab'
import { WaterTab } from '../components/tabs/WaterTab'
import { MashTab } from '../components/tabs/MashTab'
import { FermentationTab } from '../components/tabs/FermentationTab'
import { CarbonationTab } from '../components/tabs/CarbonationTab'
import { recipesApi } from '../api/recipesApi'
import { RecipeType } from '../interfaces/Recipe'
import {
  FermentableType,
  FermentableForm,
} from '../../fermentable/interfaces/Fermentable'
import { COLORS } from '../../../shared/styles/colors'
import toast from 'react-hot-toast'
import { generateRecipePdf } from '../utils/generateRecipePdf'
import { BiDownload } from 'react-icons/bi'

const toNumber = (
  value: number | string | null | undefined,
): number | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value
  }
  if (typeof value === 'string') {
    const num = parseFloat(value)
    return isNaN(num) ? undefined : num
  }
  return undefined
}

const recipeBasicSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  beerStyle: z.string().min(1, 'Estilo de cerveja é obrigatório'),
  type: z.nativeEnum(RecipeType, {
    required_error: 'Tipo de receita é obrigatório',
  }),
  equipmentId: z.string().min(1, 'Equipamento é obrigatório').nullable(),
  finalVolume: z.number().positive('Volume final deve ser positivo'),
  mashVolume: z
    .number()
    .positive('Volume de mostura deve ser positivo')
    .optional()
    .nullable(),
  boilTime: z
    .number()
    .int()
    .min(0, 'Tempo de fervura deve ser positivo')
    .optional()
    .nullable(),
  preBoilVolume: z
    .number()
    .positive('Volume pré-fervura deve ser positivo')
    .optional()
    .nullable(),
  postBoilVolume: z
    .number()
    .positive('Volume pós-fervura deve ser positivo')
    .optional()
    .nullable(),
  mashEfficiency: z.number().min(0).max(100).optional().nullable(),
  brewDate: z.string().optional().nullable(),
  imageUrl: z
    .string()
    .refine(
      val => {
        if (!val || val === '') return true
        return (
          val.startsWith('http://') ||
          val.startsWith('https://') ||
          val.startsWith('data:image/')
        )
      },
      { message: 'URL ou imagem inválida' },
    )
    .optional()
    .nullable()
    .or(z.literal('')),
  about: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type RecipeBasicFormData = z.infer<typeof recipeBasicSchema>

interface LoadedRecipe {
  id: string
  name: string
  beerStyle: { id: string; name: string } | string | null
  equipment: { id: string; name: string } | string | null
  type: string
  finalVolume: number | string | null
  mashVolume: number | string | null
  boilTime: number | string | null
  brewDate: string | null
  imageUrl: string | null
  about: string | null
  notes: string | null
  originalGravity: number | string | null
  finalGravity: number | string | null
  estimatedIbu: number | string | null
  estimatedColor: number | string | null
  estimatedAbv: number | string | null
  mashEfficiency?: number | string | null
  brewhouseEfficiency?: number | string | null
  preBoilVolume?: number | string | null
  postBoilVolume?: number | string | null
  fermentables?: Array<{
    id: string
    fermentable?: {
      id: string
      name: string
      type?: string
      color?: number
      yield?: number
      ppg?: number
      form?: string
    }
    amount: number | null
  }>
  hops?: Array<{
    id: string
    hop?: { id: string; name: string; alphaAcids?: number }
    amount: number | null
    boilTime?: string | null
    stage?: string
  }>
  yeasts?: Array<{
    id: string
    yeast?: { id: string; name: string; attenuation?: number }
    amount: number | null
    stage?: string
  }>
  waters?: Array<{
    id: string
    waterProfile?: { id: string; name: string }
    volume: number | null
  }>
  mash?: {
    mashProfile?: {
      id: string
      name: string
      estimatedEfficiency?: number | null
    }
    actualEfficiency?: number | null
  } | null
  fermentation?: {
    fermentationProfile?: {
      id: string
      name: string
      estimatedAttenuation?: number | null
    }
    actualAttenuation?: number | null
    finalAbv?: number | null
    observations?: string | null
  } | null
  carbonation?: {
    carbonationProfile?: {
      id: string
      name: string
      targetCO2Volumes?: number
    }
    amountUsed?: string | null
    temperature?: number | null
    co2Volumes?: number | null
  } | null
}

type TabKey =
  | 'basic'
  | 'fermentables'
  | 'hops'
  | 'yeasts'
  | 'water'
  | 'mash'
  | 'fermentation'
  | 'carbonation'

const tabs = [
  { key: 'basic' as TabKey, label: 'Básico' },
  { key: 'fermentables' as TabKey, label: 'Fermentáveis' },
  { key: 'hops' as TabKey, label: 'Lúpulos' },
  { key: 'yeasts' as TabKey, label: 'Leveduras' },
  { key: 'water' as TabKey, label: 'Água' },
  { key: 'mash' as TabKey, label: 'Mostura' },
  { key: 'fermentation' as TabKey, label: 'Fermentação' },
  { key: 'carbonation' as TabKey, label: 'Carbonatação' },
]

const SaveRecipesContent: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id
  const { recipe, updateRecipe, getRecipeUpsertInput, resetRecipe } =
    useRecipe()
  const calculations = useRecipeCalculations()
  const [activeTab, setActiveTab] = useState<TabKey>('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false)

  const {
    control,
    setValue,
    reset: resetForm,
    formState: { errors, isValid },
  } = useForm<RecipeBasicFormData>({
    resolver: zodResolver(recipeBasicSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      beerStyle: '',
      type: RecipeType.ALL_GRAIN,
      equipmentId: null,
      finalVolume: undefined,
      mashVolume: undefined,
      preBoilVolume: undefined,
      boilTime: undefined,
      postBoilVolume: undefined,
      mashEfficiency: undefined,
      brewDate: new Date().toISOString().split('T')[0],
      imageUrl: null,
      about: null,
      notes: null,
    },
  })

  useEffect(() => {
    const loadRecipe = async () => {
      if (!isEditMode || !id) return

      try {
        setIsLoadingRecipe(true)
        const loadedRecipe = (await recipesApi.findById(id)) as LoadedRecipe

        const beerStyleId =
          typeof loadedRecipe.beerStyle === 'string'
            ? loadedRecipe.beerStyle
            : loadedRecipe.beerStyle?.id || ''
        const beerStyleObj =
          typeof loadedRecipe.beerStyle === 'object' && loadedRecipe.beerStyle
            ? loadedRecipe.beerStyle
            : null

        const equipmentId =
          typeof loadedRecipe.equipment === 'string'
            ? loadedRecipe.equipment
            : loadedRecipe.equipment?.id || ''
        const equipmentObj =
          typeof loadedRecipe.equipment === 'object' && loadedRecipe.equipment
            ? loadedRecipe.equipment
            : null

        resetForm({
          name: loadedRecipe.name || '',
          beerStyle: beerStyleId,
          type: (loadedRecipe.type as RecipeType) || RecipeType.ALL_GRAIN,
          equipmentId: equipmentId || null,
          finalVolume: toNumber(loadedRecipe.finalVolume),
          mashVolume: toNumber(loadedRecipe.mashVolume),
          preBoilVolume: toNumber(loadedRecipe.preBoilVolume),
          boilTime: toNumber(loadedRecipe.boilTime),
          postBoilVolume: toNumber(loadedRecipe.postBoilVolume),
          mashEfficiency: toNumber(loadedRecipe.mashEfficiency),
          brewDate: loadedRecipe.brewDate || null,
          imageUrl: loadedRecipe.imageUrl || null,
          about: loadedRecipe.about || null,
          notes: loadedRecipe.notes || null,
        })

        updateRecipe({
          name: loadedRecipe.name || '',
          beerStyle: beerStyleObj,
          type: (loadedRecipe.type as RecipeType) || '',
          equipment: equipmentObj,
          finalVolume: toNumber(loadedRecipe.finalVolume) || null,
          mashVolume: toNumber(loadedRecipe.mashVolume) || null,
          boilTime: toNumber(loadedRecipe.boilTime) || null,
          brewDate: loadedRecipe.brewDate || null,
          imageUrl: loadedRecipe.imageUrl || null,
          about: loadedRecipe.about || null,
          notes: loadedRecipe.notes || null,
          originalGravity: toNumber(loadedRecipe.originalGravity) || null,
          finalGravity: toNumber(loadedRecipe.finalGravity) || null,
          estimatedIbu: toNumber(loadedRecipe.estimatedIbu) || null,
          estimatedColor: toNumber(loadedRecipe.estimatedColor) || null,
          estimatedAbv: toNumber(loadedRecipe.estimatedAbv) || null,
          mashEfficiency: toNumber(loadedRecipe.mashEfficiency) || null,
          brewhouseEfficiency:
            toNumber(loadedRecipe.brewhouseEfficiency) || null,
          preBoilVolume: toNumber(loadedRecipe.preBoilVolume) || null,
          postBoilVolume: toNumber(loadedRecipe.postBoilVolume) || null,
          fermentables:
            loadedRecipe.fermentables?.map(f => ({
              id: f.id,
              fermentableId: f.fermentable?.id || '',
              amount: f.amount || 0,
              fermentable: f.fermentable
                ? {
                    name: f.fermentable.name || '',
                    type: f.fermentable.type as FermentableType | undefined,
                    color: f.fermentable.color || undefined,
                    yield: f.fermentable.yield || undefined,
                    ppg: f.fermentable.ppg || undefined,
                    form: f.fermentable.form as FermentableForm | undefined,
                  }
                : undefined,
            })) || [],
          hops:
            loadedRecipe.hops?.map(h => ({
              id: h.id,
              hopId: h.hop?.id || '',
              amount: h.amount || 0,
              boilTime: h.boilTime ? parseFloat(h.boilTime) : undefined,
              stage: (h.stage as 'boil' | 'whirlpool' | 'dry_hop') || 'boil',
              hop: h.hop
                ? {
                    name: h.hop.name || '',
                    alphaAcids: h.hop.alphaAcids || undefined,
                  }
                : undefined,
            })) || [],
          yeasts:
            loadedRecipe.yeasts?.map(y => ({
              id: y.id,
              yeastId: y.yeast?.id || '',
              amount: y.amount || undefined,
              stage:
                (y.stage as 'primary' | 'secondary' | 'starter') || 'primary',
              yeast: y.yeast
                ? {
                    name: y.yeast.name || '',
                    attenuation: y.yeast.attenuation || undefined,
                  }
                : undefined,
            })) || [],
          waters:
            loadedRecipe.waters?.map(w => ({
              id: w.id,
              waterId: w.waterProfile?.id || '',
              amount: w.volume || 0,
              water: w.waterProfile
                ? {
                    name: w.waterProfile.name || '',
                  }
                : undefined,
            })) || [],
          mash: loadedRecipe.mash
            ? {
                mashProfileId: loadedRecipe.mash.mashProfile?.id,
                mashProfile: loadedRecipe.mash.mashProfile
                  ? {
                      id: loadedRecipe.mash.mashProfile.id,
                      name: loadedRecipe.mash.mashProfile.name || '',
                      estimatedEfficiency:
                        loadedRecipe.mash.mashProfile.estimatedEfficiency ||
                        null,
                      mashThickness:
                        (
                          loadedRecipe.mash.mashProfile as {
                            mashThickness?: number
                          }
                        )?.mashThickness ?? null,
                    }
                  : undefined,
                actualEfficiency: loadedRecipe.mash.actualEfficiency || null,
              }
            : null,
          fermentation: loadedRecipe.fermentation
            ? {
                fermentationProfileId:
                  loadedRecipe.fermentation.fermentationProfile?.id,
                fermentationProfile: loadedRecipe.fermentation
                  .fermentationProfile
                  ? {
                      id: loadedRecipe.fermentation.fermentationProfile.id,
                      name:
                        loadedRecipe.fermentation.fermentationProfile.name ||
                        '',
                      estimatedAttenuation:
                        loadedRecipe.fermentation.fermentationProfile
                          .estimatedAttenuation || null,
                    }
                  : undefined,
                actualAttenuation:
                  loadedRecipe.fermentation.actualAttenuation || null,
                finalAbv: loadedRecipe.fermentation.finalAbv || null,
                observations: loadedRecipe.fermentation.observations || null,
              }
            : null,
          carbonation: loadedRecipe.carbonation
            ? {
                carbonationProfileId:
                  loadedRecipe.carbonation.carbonationProfile?.id,
                carbonationProfile: loadedRecipe.carbonation.carbonationProfile
                  ? {
                      id: loadedRecipe.carbonation.carbonationProfile.id,
                      name:
                        loadedRecipe.carbonation.carbonationProfile.name || '',
                      targetCO2Volumes:
                        loadedRecipe.carbonation.carbonationProfile
                          .targetCO2Volumes || undefined,
                    }
                  : undefined,
                amountUsed: loadedRecipe.carbonation.amountUsed || null,
                temperature: loadedRecipe.carbonation.temperature || null,
                co2Volumes: loadedRecipe.carbonation.co2Volumes || null,
              }
            : null,
        })
      } catch (error) {
        console.error('Erro ao carregar receita:', error)
        toast.error('Erro ao carregar receita')
        navigate('/recipes')
      } finally {
        setIsLoadingRecipe(false)
      }
    }

    loadRecipe()
  }, [isEditMode, id, updateRecipe, navigate, resetForm])

  useEffect(() => {
    updateRecipe({
      originalGravity: calculations.originalGravity,
      finalGravity: calculations.finalGravity,
      estimatedIbu: calculations.estimatedIbu,
      estimatedColor: calculations.estimatedColor,
      estimatedAbv: calculations.estimatedAbv,
    })
  }, [calculations, updateRecipe])

  const validations = {
    basic: isValid && !!recipe.beerStyle && !!recipe.equipment,
    fermentables: recipe.fermentables.length > 0,
    hops: recipe.hops.length > 0,
    yeasts: recipe.yeasts.length > 0,
    waters: recipe.waters.length > 0,
    mash: !!recipe.mash,
    fermentation: !!recipe.fermentation,
    carbonation: !!recipe.carbonation,
  }

  const allValid = Object.values(validations).every(v => v)

  const handleSave = async () => {
    if (!allValid) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setIsSaving(true)
      updateRecipe({
        originalGravity: calculations.originalGravity,
        finalGravity: calculations.finalGravity,
        estimatedIbu: calculations.estimatedIbu,
        estimatedColor: calculations.estimatedColor,
        estimatedAbv: calculations.estimatedAbv,
      })

      const recipeInput = getRecipeUpsertInput()

      recipeInput.recipe.originalGravity =
        calculations.originalGravity ?? recipeInput.recipe.originalGravity
      recipeInput.recipe.finalGravity =
        calculations.finalGravity ?? recipeInput.recipe.finalGravity
      recipeInput.recipe.estimatedIbu =
        calculations.estimatedIbu ?? recipeInput.recipe.estimatedIbu
      recipeInput.recipe.estimatedColor =
        calculations.estimatedColor ?? recipeInput.recipe.estimatedColor
      recipeInput.recipe.estimatedAbv =
        calculations.estimatedAbv ?? recipeInput.recipe.estimatedAbv

      if (isEditMode && id) {
        recipeInput.recipe.id = id
        await recipesApi.update(id, recipeInput)
        toast.success('Receita atualizada com sucesso!')
      } else {
        await recipesApi.create(recipeInput)
        toast.success('Receita salva com sucesso!')
      }

      resetRecipe()
      navigate('/recipes')
    } catch (error) {
      toast.error(
        isEditMode ? 'Erro ao atualizar receita' : 'Erro ao salvar receita',
      )
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    resetRecipe()
    navigate('/recipes')
  }

  const handleExportPdf = async () => {
    try {
      await generateRecipePdf({
        recipe,
        calculations,
        brewDate: recipe.brewDate,
      })
      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicTab control={control} setValue={setValue} errors={errors} />
        )
      case 'fermentables':
        return <FermentablesTab />
      case 'hops':
        return <HopsTab />
      case 'yeasts':
        return <YeastsTab />
      case 'water':
        return <WaterTab />
      case 'mash':
        return <MashTab />
      case 'fermentation':
        return <FermentationTab />
      case 'carbonation':
        return <CarbonationTab />
      default:
        return (
          <BasicTab control={control} setValue={setValue} errors={errors} />
        )
    }
  }

  if (isEditMode && isLoadingRecipe) {
    return (
      <Layout activeMenuItem="recipes">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primary} />
          <Text style={styles.loadingText}>Carregando receita...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="recipes">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Receita' : 'Detalhes Básicos da Receita'}
          </Heading>
          <View style={styles.headerActions}>
            {isEditMode && (
              <Button
                variant="outline"
                size="medium"
                onPress={handleExportPdf}
                disabled={isSaving}
                style={styles.exportButton}
              >
                <View style={styles.buttonContent}>
                  <BiDownload size={18} color={COLORS.brand.primary} />
                  <Text style={styles.buttonText}>Exportar PDF</Text>
                </View>
              </Button>
            )}
            <Button
              variant="outline"
              size="medium"
              onPress={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.leftColumn}>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabKey: string) => setActiveTab(tabKey as TabKey)}
            />
            <View style={styles.tabContent}>{renderTabContent()}</View>
          </View>

          <View style={styles.rightColumn}>
            <RecipeSidebar />
            <Button
              variant="primary"
              size="large"
              onPress={handleSave}
              disabled={!allValid || isSaving}
              style={styles.saveButton}
            >
              {isSaving
                ? 'Salvando...'
                : isEditMode
                  ? 'Atualizar Receita'
                  : 'Salvar Receita'}
            </Button>
          </View>
        </View>
      </View>
    </Layout>
  )
}

export const SaveRecipes: React.FC = () => {
  return (
    <RecipeProvider>
      <SaveRecipesContent />
    </RecipeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    color: COLORS.text.primary,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    color: COLORS.brand.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    flexDirection: 'row',
    gap: 24,
    flex: 1,
  },
  leftColumn: {
    flex: 0.7,
    minWidth: 0,
  },
  rightColumn: {
    flex: 0.3,
    minWidth: 300,
  },
  tabContent: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  saveButton: {
    marginTop: 24,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
})
