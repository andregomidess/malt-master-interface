import React, { useState, useMemo } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { DateInput } from '../../../shared/components/DateInput'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../recipes/components/Select'
import { COLORS } from '../../../shared/styles/colors'
import {
  BatchStatus,
  BatchStatusLabels,
  BatchDetail,
  MashStep,
} from '../interfaces/Brewing'
import { useSaveBatch, type BatchInput } from '../hooks/useSaveBatch'
import { useRecipesList } from '../../recipes/hooks/useRecipes'
import { useEquipments } from '../../equipment/hooks/useEquipments'
import { MashProfileType } from '../../profiles/interfaces/MashProfile'
import {
  BiPlus,
  BiTrash,
  BiChevronDown,
  BiChevronUp,
  BiChevronUp as BiArrowUp,
  BiChevronDown as BiArrowDown,
} from 'react-icons/bi'
import { recipesApi } from '../../recipes/api/recipesApi'
import { useEffect } from 'react'
import { batchesApi } from '../api/batchesApi'

const BATCH_STATUS_VALUES: BatchStatus[] = [
  'planned',
  'fermenting',
  'maturing',
  'packaged',
  'completed',
]

const brewingSchema = z.object({
  recipeId: z.string().min(1, 'Receita é obrigatória'),
  equipment: z.string().optional(),
  name: z.string().optional(),
  batchCode: z.string().optional(),
  brewDate: z.string().optional(),
  status: z.enum([
    'planned',
    'fermenting',
    'maturing',
    'packaged',
    'completed',
  ]),
  plannedVolume: z.number().positive().optional(),
  mashProfileType: z.nativeEnum(MashProfileType),
  grainTemperature: z.number().min(10).max(30).optional(),
  tunTemperature: z.number().min(10).max(30).optional(),
  spargeTemperature: z.number().min(75).max(80).optional(),
  tunWeight: z.number().min(0).optional(),
  tunSpecificHeat: z.number().min(0.1).max(0.5).optional(),
  mashThickness: z.number().min(2.0).max(5.0).optional(),
  estimatedEfficiency: z.number().min(50).max(95).optional(),
  spargeMethod: z.enum(['fly', 'batch', 'no_sparge']).optional(),
  spargeVolume: z.number().min(0).optional(),
  actualStrikeTemp: z.number().optional(),
  actualPreBoilVolume: z.number().min(0).optional(),
  actualPreBoilGravity: z.number().min(1.0).optional(),
  actualOriginalGravity: z.number().min(1.0).optional(),
  actualEfficiency: z.number().min(0).max(100).optional(),
  observations: z.string().optional(),
})

export type FormData = z.infer<typeof brewingSchema>

interface MashStepForm {
  id?: string
  stepOrder: number
  name: string
  stepType: 'infusion' | 'temperature' | 'decoction'
  temperature: number
  duration: number
  infusionAmount?: number
  infusionTemp?: number
  decoctionAmount?: number
  rampTime?: number
  description?: string
}

const PPG_TO_METRIC_CONVERSION = 8.345404
const GRAVITY_POINTS_DIVISOR = 1000
const SPECIFIC_GRAVITY_BASE = 1.0
const DEFAULT_YIELD = 37

export const SaveBrewing = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const isEditMode = !!id
  const recipeIdFromQuery = searchParams.get('recipeId')

  const [activeSection, setActiveSection] = useState<
    'basic' | 'mash' | 'sparge' | 'brewday'
  >('basic')
  const [mashSteps, setMashSteps] = useState<MashStepForm[]>([])
  const [showCalculations, setShowCalculations] = useState(false)

  const { mutate: saveBatch, isPending: isSaving } = useSaveBatch()
  const { recipes, isLoading: isLoadingRecipes } = useRecipesList()
  const { data: equipmentsData, isLoading: isLoadingEquipments } =
    useEquipments()

  const [fullRecipe, setFullRecipe] = useState<{
    fermentables?: Array<{ amount?: number; fermentable?: { yield?: number } }>
  } | null>(null)
  const [isLoadingBatch, setIsLoadingBatch] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(brewingSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'planned' as BatchStatus,
      mashProfileType: MashProfileType.INFUSION,
      grainTemperature: 20,
      tunTemperature: 20,
      spargeTemperature: 78,
      tunSpecificHeat: 0.3,
      mashThickness: 3.0,
      spargeMethod: 'fly',
    },
  })

  const watchedValues = watch()
  const recipeId = watch('recipeId')
  const equipment = watch('equipment')
  const selectedRecipe = useMemo(
    () => recipes.find(r => r.id === recipeId),
    [recipes, recipeId],
  )

  useEffect(() => {
    if (recipeIdFromQuery && !isEditMode && !recipeId) {
      setValue('recipeId', recipeIdFromQuery)
    }
  }, [recipeIdFromQuery, isEditMode, recipeId, setValue])

  useEffect(() => {
    if (recipeId && !fullRecipe) {
      recipesApi
        .findById(recipeId)
        .then(recipe => {
          setFullRecipe(recipe as unknown as typeof fullRecipe)
        })
        .catch(() => {
          setFullRecipe(null)
        })
    }
  }, [recipeId, fullRecipe])

  useEffect(() => {
    if (isEditMode && id) {
      setIsLoadingBatch(true)
      batchesApi
        .findById(id)
        .then(response => {
          const batch =
            'batch' in response ? (response as BatchDetail).batch : response

          if (batch.recipe?.id) {
            setValue('recipeId', batch.recipe.id)
          }
          if (batch.equipment?.id) {
            setValue('equipment', batch.equipment.id)
          }
          if (batch.name) {
            setValue('name', batch.name)
          }
          if (batch.batchCode) {
            setValue('batchCode', batch.batchCode)
          }
          if (batch.brewDate) {
            const date = new Date(batch.brewDate)
            const formattedDate = date.toISOString().split('T')[0]
            setValue('brewDate', formattedDate)
          }
          if (batch.status) {
            setValue('status', batch.status)
          }
          if (batch.plannedVolume) {
            setValue('plannedVolume', Number(batch.plannedVolume))
          }
          if (batch.actualOriginalGravity) {
            setValue(
              'actualOriginalGravity',
              Number(batch.actualOriginalGravity),
            )
          }
          if (batch.actualEfficiency) {
            setValue('actualEfficiency', Number(batch.actualEfficiency))
          }
          if (batch.observations) {
            setValue('observations', batch.observations)
          }

          let mashStepsToLoad: MashStep[] = []

          if (
            'mashSteps' in response &&
            response.mashSteps &&
            Array.isArray(response.mashSteps)
          ) {
            mashStepsToLoad = response.mashSteps
          } else {
            const recipeWithMash = batch.recipe as unknown as {
              mash?: {
                mashProfile?: {
                  steps?: MashStep[]
                }
              }
            }
            if (
              recipeWithMash?.mash?.mashProfile?.steps &&
              Array.isArray(recipeWithMash.mash.mashProfile.steps)
            ) {
              mashStepsToLoad = recipeWithMash.mash.mashProfile.steps
            }
          }

          if (mashStepsToLoad.length > 0) {
            const steps: MashStepForm[] = mashStepsToLoad.map(step => ({
              id: step.id,
              stepOrder: step.stepOrder,
              name: step.name,
              stepType: step.stepType,
              temperature: step.temperature,
              duration: step.duration,
              infusionAmount: step.infusionAmount || undefined,
              infusionTemp: step.infusionTemp || undefined,
              rampTime: step.rampTime || undefined,
              description: step.description || undefined,
            }))
            setMashSteps(steps)
          }
        })
        .catch(error => {
          console.error('Erro ao carregar batch:', error)
        })
        .finally(() => {
          setIsLoadingBatch(false)
        })
    }
  }, [isEditMode, id, setValue])

  useEffect(() => {
    if (equipment && equipmentsData?.pages) {
      const allEquipments = equipmentsData.pages.flatMap(page => page.data)
      const selectedEquipment = allEquipments.find(eq => eq.id === equipment)
      if (selectedEquipment) {
        const materialSpecificHeat: Record<string, number> = {
          stainless_steel: 0.5,
          aluminum: 0.9,
          copper: 0.385,
          plastic: 0.5,
          glass: 0.84,
        }
        const specificHeat =
          materialSpecificHeat[selectedEquipment.material] || 0.3
        setValue('tunSpecificHeat', specificHeat)
        const estimatedWeight = selectedEquipment.totalCapacity * 0.1
        setValue('tunWeight', estimatedWeight)
      }
    }
  }, [equipment, equipmentsData, setValue])

  const equipmentOptions = useMemo(() => {
    if (!equipmentsData?.pages) return []
    const allEquipments = equipmentsData.pages.flatMap(page => page.data)
    return allEquipments.map(eq => ({
      value: eq.id,
      label: eq.name,
    }))
  }, [equipmentsData])

  const recipeOptions = useMemo(
    () =>
      recipes.map(recipe => ({
        value: recipe.id,
        label: recipe.name,
      })),
    [recipes],
  )

  const mashProfileTypeOptions = [
    { value: MashProfileType.INFUSION, label: 'Infusão Simples' },
    { value: MashProfileType.STEP_MASH, label: 'Mostura por Rampa' },
    { value: MashProfileType.DECOCTION, label: 'Mostura por Decocção' },
    { value: MashProfileType.BIAB, label: 'Brew In A Bag (BIAB)' },
  ]

  const spargeMethodOptions = [
    { value: 'fly', label: 'Fly Sparge (Contínuo)' },
    { value: 'batch', label: 'Batch Sparge (Múltiplas Adições)' },
    { value: 'no_sparge', label: 'No Sparge (Sem Lavagem)' },
  ]

  const statusOptions = BATCH_STATUS_VALUES.map(status => ({
    value: status,
    label: BatchStatusLabels[status],
  }))

  const calculations = useMemo(() => {
    let grainWeight = 0
    if (fullRecipe?.fermentables) {
      grainWeight = fullRecipe.fermentables.reduce(
        (sum: number, f) => sum + (f.amount || 0),
        0,
      )
    }
    if (grainWeight === 0) {
      grainWeight = 5.0
    }

    const mashThickness = watchedValues.mashThickness || 3.0
    const strikeWaterVolume = grainWeight * mashThickness
    const grainAbsorption = grainWeight * 0.1 // ~0.1 L/kg
    const preBoilVolume =
      (watchedValues.plannedVolume || selectedRecipe?.plannedVolume || 20) +
      grainAbsorption
    const spargeVolume = Math.max(0, preBoilVolume - strikeWaterVolume)
    const totalWaterVolume = strikeWaterVolume + spargeVolume

    const targetTemp = mashSteps[0]?.temperature || 65
    const grainTemp = watchedValues.grainTemperature || 20
    const tunTemp = watchedValues.tunTemperature || 20
    const tunWeight = watchedValues.tunWeight || 0
    const tunSpecificHeat = watchedValues.tunSpecificHeat || 0.3

    // Cálculo melhorado da temperatura de infusão
    const strikeTemp =
      targetTemp +
      ((targetTemp - grainTemp) * grainWeight * 0.4 +
        (targetTemp - tunTemp) * tunWeight * tunSpecificHeat) /
        (strikeWaterVolume * 4.18)

    // Calcular densidade pré-fervura
    let preBoilGravity: number | null = null
    const efficiency = watchedValues.estimatedEfficiency || 75
    if (fullRecipe?.fermentables && grainWeight > 0 && preBoilVolume > 0) {
      const totalPointsPerLiterExtracted = fullRecipe.fermentables.reduce(
        (total: number, f) => {
          const amount = f.amount || 0
          const yieldPPG = f.fermentable?.yield || DEFAULT_YIELD
          const yieldPPL = yieldPPG * PPG_TO_METRIC_CONVERSION
          return total + amount * yieldPPL
        },
        0,
      )

      const ogPoints =
        (totalPointsPerLiterExtracted * (efficiency / 100)) / preBoilVolume
      preBoilGravity = SPECIFIC_GRAVITY_BASE + ogPoints / GRAVITY_POINTS_DIVISOR
      preBoilGravity = Math.round(preBoilGravity * 1000) / 1000
    }

    return {
      grainWeight: grainWeight,
      strikeWaterVolume: strikeWaterVolume.toFixed(2),
      grainAbsorption: grainAbsorption.toFixed(2),
      preBoilVolume: preBoilVolume.toFixed(2),
      spargeVolume: spargeVolume.toFixed(2),
      totalWaterVolume: totalWaterVolume.toFixed(2),
      strikeTemp: strikeTemp.toFixed(1),
      estimatedEfficiency: efficiency,
      preBoilGravity: preBoilGravity ? preBoilGravity.toFixed(3) : '—',
    }
  }, [selectedRecipe, watchedValues, mashSteps, fullRecipe])

  const addMashStep = () => {
    const newStep: MashStepForm = {
      stepOrder: mashSteps.length + 1,
      name: `Descanso ${mashSteps.length + 1}`,
      stepType: 'temperature',
      temperature: 65,
      duration: 60,
    }
    setMashSteps([...mashSteps, newStep])
  }

  const removeMashStep = (index: number) => {
    const newSteps = mashSteps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepOrder: i + 1 }))
    setMashSteps(newSteps)
  }

  const updateMashStep = (index: number, updates: Partial<MashStepForm>) => {
    const newSteps = [...mashSteps]
    newSteps[index] = { ...newSteps[index], ...updates }
    setMashSteps(newSteps)
  }

  const moveMashStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === mashSteps.length - 1)
    ) {
      return
    }

    const newSteps = [...mashSteps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ]
    // Atualizar stepOrder
    newSteps.forEach((step, i) => {
      step.stepOrder = i + 1
    })
    setMashSteps(newSteps)
  }

  const stepTypeOptions = [
    { value: 'infusion', label: 'Infusão' },
    { value: 'temperature', label: 'Aumento de Temperatura' },
    { value: 'decoction', label: 'Decocção' },
  ]

  const onSubmit = (data: FormData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!user?.id) {
      return
    }

    const batchData: BatchInput = {
      ...(isEditMode && id && { id }),
      user: user.id,
      recipe: data.recipeId,
      ...(data.equipment && { equipment: data.equipment }),
      name: data.name || null,
      batchCode: data.batchCode || null,
      brewDate: data.brewDate || null,
      status: data.status,
      plannedVolume: data.plannedVolume || null,
      actualOriginalGravity: data.actualOriginalGravity || null,
      actualEfficiency: data.actualEfficiency || null,
      observations: data.observations || null,
      mashSteps:
        mashSteps.length > 0
          ? mashSteps.map(step => ({
              ...(step.id && { id: step.id }),
              stepOrder: step.stepOrder,
              name: step.name,
              stepType: step.stepType,
              temperature: step.temperature,
              duration: step.duration,
              infusionAmount: step.infusionAmount || null,
              infusionTemp: step.infusionTemp || null,
              decoctionAmount: step.decoctionAmount || null,
              rampTime: step.rampTime || null,
              description: step.description || null,
            }))
          : undefined,
    }

    saveBatch(batchData)
    navigate('/brewings')
  }

  const handleCancel = () => {
    navigate('/brewings')
  }

  if (isLoadingRecipes || isLoadingEquipments || isLoadingBatch) {
    return (
      <Layout activeMenuItem="brewings">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primary} />
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="brewings">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Brassagem' : 'Nova Brassagem'}
          </Heading>
        </View>

        <View style={styles.sectionTabs}>
          {[
            { key: 'basic', label: 'Básico' },
            { key: 'mash', label: 'Mostura' },
            { key: 'sparge', label: 'Sparging' },
            { key: 'brewday', label: 'Brew Day' },
          ].map(section => (
            <TouchableOpacity
              key={section.key}
              style={[
                styles.sectionTab,
                activeSection === section.key && styles.sectionTabActive,
              ]}
              onPress={() =>
                setActiveSection(section.key as typeof activeSection)
              }
            >
              <Text
                style={[
                  styles.sectionTabText,
                  activeSection === section.key && styles.sectionTabTextActive,
                ]}
              >
                {section.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          {activeSection === 'basic' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="recipeId"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Receita *"
                      placeholder="Selecione uma receita"
                      value={value}
                      options={recipeOptions}
                      onSelect={onChange}
                      error={!!errors.recipeId}
                      errorMessage={errors.recipeId?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="equipment"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Equipamento"
                      placeholder="Selecione um equipamento"
                      value={value}
                      options={equipmentOptions}
                      onSelect={onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Nome do Lote"
                        placeholder="Ex: IPA #001"
                        value={value || ''}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="batchCode"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Código do Lote"
                        placeholder="Ex: BATCH-2024-001"
                        value={value || ''}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="brewDate"
                    render={({ field: { value, onChange } }) => (
                      <DateInput
                        label="Data da Brassagem"
                        placeholder="Selecione uma data"
                        value={value || undefined}
                        onChange={date => onChange(date || '')}
                      />
                    )}
                  />
                </View>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label="Status"
                        value={value}
                        options={statusOptions}
                        onSelect={onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="plannedVolume"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Volume Planejado (L)"
                      placeholder="Ex: 20"
                      value={value?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        onChange(isNaN(num) ? undefined : num)
                      }}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
            </View>
          )}

          {activeSection === 'mash' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Perfil de Mostura</Text>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="mashProfileType"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Tipo de Mostura *"
                      value={value}
                      options={mashProfileTypeOptions}
                      onSelect={onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="grainTemperature"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Temp. dos Grãos (°C)"
                        placeholder="20"
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? 20 : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="tunTemperature"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Temp. da Tina (°C)"
                        placeholder="20"
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? 20 : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="mashThickness"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Relação Água/Grão (L/kg)"
                        placeholder="3.0"
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? 3.0 : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="estimatedEfficiency"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Eficiência Estimada (%)"
                        placeholder="75"
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? undefined : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>

              <View style={styles.mashStepsSection}>
                <View style={styles.mashStepsHeader}>
                  <Text style={styles.sectionTitle}>Rampas/Descansos</Text>
                  <Button variant="outline" size="small" onPress={addMashStep}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <BiPlus size={16} />
                      <Text>Adicionar</Text>
                    </View>
                  </Button>
                </View>

                {mashSteps.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      Nenhum descanso adicionado.
                    </Text>
                  </View>
                )}

                {mashSteps.map((step, index) => (
                  <View key={index} style={styles.mashStepCard}>
                    <View style={styles.mashStepHeader}>
                      <View style={styles.mashStepHeaderLeft}>
                        <Text style={styles.mashStepOrder}>
                          {step.stepOrder}
                        </Text>
                        <Text style={styles.mashStepTitle}>{step.name}</Text>
                      </View>
                      <View style={styles.mashStepActions}>
                        <TouchableOpacity
                          onPress={() => moveMashStep(index, 'up')}
                          style={[
                            styles.moveButton,
                            index === 0 && styles.moveButtonDisabled,
                          ]}
                          disabled={index === 0}
                        >
                          <BiArrowUp
                            size={16}
                            color={
                              index === 0
                                ? COLORS.text.tertiary
                                : COLORS.brand.primary
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => moveMashStep(index, 'down')}
                          style={[
                            styles.moveButton,
                            index === mashSteps.length - 1 &&
                              styles.moveButtonDisabled,
                          ]}
                          disabled={index === mashSteps.length - 1}
                        >
                          <BiArrowDown
                            size={16}
                            color={
                              index === mashSteps.length - 1
                                ? COLORS.text.tertiary
                                : COLORS.brand.primary
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => removeMashStep(index)}
                          style={styles.deleteButton}
                        >
                          <BiTrash size={18} color={COLORS.status.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={[styles.field, styles.halfWidth]}>
                        <InputText
                          label="Nome"
                          placeholder="Ex: Beta-Amilase"
                          value={step.name}
                          onChangeText={name => updateMashStep(index, { name })}
                        />
                      </View>
                      <View style={[styles.field, styles.halfWidth]}>
                        <Select
                          label="Tipo de Passo"
                          value={step.stepType}
                          options={stepTypeOptions}
                          onSelect={stepType =>
                            updateMashStep(index, {
                              stepType: stepType as
                                | 'infusion'
                                | 'temperature'
                                | 'decoction',
                            })
                          }
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={[styles.field, styles.halfWidth]}>
                        <InputText
                          label="Temperatura (°C)"
                          placeholder="65"
                          value={step.temperature.toString()}
                          onChangeText={val => {
                            const num = parseFloat(val)
                            if (!isNaN(num))
                              updateMashStep(index, { temperature: num })
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={[styles.field, styles.halfWidth]}>
                        <InputText
                          label="Duração (min)"
                          placeholder="60"
                          value={step.duration.toString()}
                          onChangeText={val => {
                            const num = parseInt(val)
                            if (!isNaN(num))
                              updateMashStep(index, { duration: num })
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    {/* Campos condicionais baseados no tipo de passo */}
                    {step.stepType === 'infusion' && (
                      <View style={styles.row}>
                        <View style={[styles.field, styles.halfWidth]}>
                          <InputText
                            label="Volume de Infusão (L)"
                            placeholder="0"
                            value={step.infusionAmount?.toString() || ''}
                            onChangeText={val => {
                              const num = parseFloat(val)
                              if (!isNaN(num))
                                updateMashStep(index, {
                                  infusionAmount: num,
                                })
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={[styles.field, styles.halfWidth]}>
                          <InputText
                            label="Temp. de Infusão (°C)"
                            placeholder="100"
                            value={step.infusionTemp?.toString() || ''}
                            onChangeText={val => {
                              const num = parseFloat(val)
                              if (!isNaN(num))
                                updateMashStep(index, { infusionTemp: num })
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    )}

                    {step.stepType === 'temperature' && (
                      <View style={styles.field}>
                        <InputText
                          label="Tempo de Rampa (min)"
                          placeholder="15"
                          value={step.rampTime?.toString() || ''}
                          onChangeText={val => {
                            const num = parseInt(val)
                            if (!isNaN(num))
                              updateMashStep(index, { rampTime: num })
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                    )}

                    {step.stepType === 'decoction' && (
                      <View style={styles.field}>
                        <InputText
                          label="Volume de Decocção (L)"
                          placeholder="0"
                          value={step.decoctionAmount?.toString() || ''}
                          onChangeText={val => {
                            const num = parseFloat(val)
                            if (!isNaN(num))
                              updateMashStep(index, {
                                decoctionAmount: num,
                              })
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                    )}

                    <View style={styles.field}>
                      <InputText
                        label="Descrição (opcional)"
                        placeholder="Observações sobre este passo..."
                        value={step.description || ''}
                        onChangeText={description =>
                          updateMashStep(index, { description })
                        }
                        multiline
                        numberOfLines={2}
                      />
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.calculationsToggle}
                onPress={() => setShowCalculations(!showCalculations)}
              >
                <Text style={styles.calculationsToggleText}>
                  {showCalculations ? 'Ocultar' : 'Mostrar'} Cálculos
                </Text>
                {showCalculations ? (
                  <BiChevronUp size={20} color={COLORS.brand.primary} />
                ) : (
                  <BiChevronDown size={20} color={COLORS.brand.primary} />
                )}
              </TouchableOpacity>

              {showCalculations && (
                <View style={styles.calculationsCard}>
                  <Text style={styles.calculationsTitle}>Cálculos</Text>
                  <View style={styles.calculationsGrid}>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Volume de Água de Mostura
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.strikeWaterVolume} L
                      </Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Temperatura de Infusão
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.strikeTemp} °C
                      </Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Volume Pré-Fervura
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.preBoilVolume} L
                      </Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Densidade Pré-Fervura Estimada
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.preBoilGravity}
                      </Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Peso Total dos Grãos
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.grainWeight} kg
                      </Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Volume Total de Água
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.totalWaterVolume} L
                      </Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Absorção de Água
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.grainAbsorption} L
                      </Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={styles.calculationLabel}>
                        Eficiência Estimada
                      </Text>
                      <Text style={styles.calculationValue}>
                        {calculations.estimatedEfficiency}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {activeSection === 'sparge' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sparging (Lavagem)</Text>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="spargeMethod"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Método de Sparge *"
                      value={value}
                      options={spargeMethodOptions}
                      onSelect={onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="spargeVolume"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Volume de Água de Sparge (L)"
                      placeholder={calculations.spargeVolume}
                      value={value?.toString() || calculations.spargeVolume}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        onChange(isNaN(num) ? undefined : num)
                      }}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="spargeTemperature"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Temperatura da Água de Sparge (°C)"
                      placeholder="78"
                      value={value?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        onChange(isNaN(num) ? 78 : num)
                      }}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
            </View>
          )}

          {activeSection === 'brewday' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Acompanhamento do Dia da Brassagem
              </Text>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="actualStrikeTemp"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Temperatura Real de Infusão (°C)"
                      placeholder={calculations.strikeTemp}
                      value={value?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        onChange(isNaN(num) ? undefined : num)
                      }}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="actualPreBoilVolume"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Volume Real Pré-Fervura (L)"
                        placeholder={calculations.preBoilVolume}
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? undefined : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="actualPreBoilGravity"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Densidade Real Pré-Fervura"
                        placeholder="1.045"
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? undefined : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="actualOriginalGravity"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="OG Real"
                        placeholder="1.050"
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? undefined : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
                <View style={[styles.field, styles.halfWidth]}>
                  <Controller
                    control={control}
                    name="actualEfficiency"
                    render={({ field: { value, onChange } }) => (
                      <InputText
                        label="Eficiência Real (%)"
                        placeholder="75"
                        value={value?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          onChange(isNaN(num) ? undefined : num)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="observations"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Observações e Notas"
                      placeholder="Anotações sobre o lote..."
                      value={value || ''}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={4}
                    />
                  )}
                />
              </View>
            </View>
          )}

          <View style={styles.actions}>
            <Button variant="ghost" size="medium" onPress={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="medium"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isSaving}
              loading={isSaving}
            >
              {isSaving ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Criar'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  sectionTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  sectionTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  sectionTabActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  sectionTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  sectionTabTextActive: {
    color: COLORS.neutral.white,
  },
  form: {
    gap: 24,
  },
  section: {
    gap: 16,
    backgroundColor: COLORS.neutral.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  mashStepsSection: {
    marginTop: 24,
    gap: 16,
  },
  mashStepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    backgroundColor: COLORS.neutral.gray[50],
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  mashStepCard: {
    backgroundColor: COLORS.neutral.gray[50],
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 12,
  },
  mashStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mashStepHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  mashStepOrder: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brand.primary,
    backgroundColor: COLORS.neutral.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 28,
    textAlign: 'center',
  },
  mashStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  mashStepActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moveButton: {
    padding: 4,
  },
  moveButtonDisabled: {
    opacity: 0.3,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 4,
  },
  calculationsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: COLORS.neutral.gray[50],
    borderRadius: 8,
    marginTop: 16,
  },
  calculationsToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.brand.primary,
  },
  calculationsCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.neutral.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  calculationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  calculationsGrid: {
    gap: 12,
  },
  calculationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  calculationLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    flex: 1,
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brand.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
})
