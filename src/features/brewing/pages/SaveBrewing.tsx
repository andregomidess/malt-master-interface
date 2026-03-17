import React, { useState, useMemo, useEffect, useRef } from 'react'
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
import { Card } from '../../../shared/components/Card'
import { InputText } from '../../../shared/components/InputText'
import { DecimalInput } from '../../../shared/components/DecimalInput'
import { DateInput } from '../../../shared/components/DateInput'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../recipes/components/Select'
import { COLORS } from '../../../shared/styles/colors'
import {
  BatchStatus,
  BatchStatusLabels,
  BatchDetail,
} from '../interfaces/Brewing'
import { useSaveBatch, type BatchInput } from '../hooks/useSaveBatch'
import { useRecipesList } from '../../recipes/hooks/useRecipes'
import { useEquipments } from '../../equipment/hooks/useEquipments'
import { MashProfileType } from '../../profiles/interfaces/MashProfile'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { recipesApi } from '../../recipes/api/recipesApi'
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
  spargeMethod: z.enum(['fly', 'batch', 'no_sparge']).optional(),
  spargeVolume: z.number().min(0).optional(),
  spargeTemperature: z.number().min(75).max(80).optional(),
  actualStrikeTemp: z.number().optional(),
  actualPreBoilVolume: z.number().min(0).optional(),
  actualPreBoilGravity: z.number().min(1.0).optional(),
  actualOriginalGravity: z.number().min(1.0).optional(),
  actualEfficiency: z.number().min(0).max(100).optional(),
  observations: z.string().optional(),
})

export type FormData = z.infer<typeof brewingSchema>

interface MashStepFromRecipe {
  id?: string
  stepOrder: number
  name: string
  stepType: 'infusion' | 'temperature' | 'decoction'
  temperature: number
  duration: number
  infusionAmount?: number | null
  infusionTemp?: number | null
  decoctionAmount?: number | null
  rampTime?: number | null
  description?: string | null
}

interface FullRecipeForBrewing {
  finalVolume?: number | null
  equipment?: { id?: string } | null
  mash?: {
    mashProfile?: {
      id?: string
      name?: string | null
      type?: MashProfileType | string | null
      grainTemperature?: number | null
      tunTemperature?: number | null
      spargeTemperature?: number | null
      tunWeight?: number | null
      tunSpecificHeat?: number | null
      mashThickness?: number | null
      estimatedEfficiency?: number | null
      steps?: MashStepFromRecipe[]
    }
  }
  fermentables?: Array<{ amount?: number; fermentable?: { yield?: number } }>
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
    'basic' | 'mash' | 'sparge'
  >('basic')
  const [showCalculations, setShowCalculations] = useState(false)
  const lastLoadedRecipeIdRef = useRef<string | null>(null)

  const { mutate: saveBatch, isPending: isSaving } = useSaveBatch()
  const { recipes, isLoading: isLoadingRecipes } = useRecipesList()
  const { data: equipmentsData, isLoading: isLoadingEquipments } =
    useEquipments()

  const [fullRecipe, setFullRecipe] = useState<FullRecipeForBrewing | null>(
    null,
  )
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
      spargeTemperature: 78,
      spargeMethod: 'fly',
    },
  })

  const watchedValues = watch()
  const recipeId = watch('recipeId')
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
    if (!recipeId) {
      setFullRecipe(null)
      lastLoadedRecipeIdRef.current = null
      return
    }

    if (lastLoadedRecipeIdRef.current === recipeId) {
      return
    }

    let cancelled = false
    lastLoadedRecipeIdRef.current = recipeId

    recipesApi
      .findById(recipeId)
      .then(recipe => {
        if (cancelled) return

        const typedRecipe = recipe as unknown as FullRecipeForBrewing
        setFullRecipe(typedRecipe)

        if (isEditMode) return

        if (typedRecipe.finalVolume != null) {
          setValue('plannedVolume', Number(typedRecipe.finalVolume))
        }

        const profile = typedRecipe.mash?.mashProfile
        if (profile?.spargeTemperature != null) {
          setValue('spargeTemperature', Number(profile.spargeTemperature))
        }

        const equipmentId = typedRecipe.equipment?.id
        if (equipmentId) {
          setValue('equipment', equipmentId)
        }
      })
      .catch(() => {
        if (cancelled) return
        setFullRecipe(null)
        lastLoadedRecipeIdRef.current = null
      })

    return () => {
      cancelled = true
    }
  }, [recipeId, isEditMode, setValue])

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
            lastLoadedRecipeIdRef.current = batch.recipe.id
            const recipeWithMash =
              batch.recipe as unknown as FullRecipeForBrewing
            setFullRecipe(recipeWithMash)
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
          if (batch.preBoilVolume != null) {
            setValue('actualPreBoilVolume', Number(batch.preBoilVolume))
          }
          if (batch.preBoilGravity != null) {
            setValue('actualPreBoilGravity', Number(batch.preBoilGravity))
          }
          if (batch.actualStrikeTemp != null) {
            setValue('actualStrikeTemp', Number(batch.actualStrikeTemp))
          }
          if (batch.spargeMethod) {
            setValue(
              'spargeMethod',
              batch.spargeMethod as 'fly' | 'batch' | 'no_sparge',
            )
          }
          if (batch.spargeVolume != null) {
            setValue('spargeVolume', Number(batch.spargeVolume))
          }
          if (batch.spargeTemperature != null) {
            setValue('spargeTemperature', Number(batch.spargeTemperature))
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

  const mashProfileTypeLabels: Record<string, string> = {
    [MashProfileType.INFUSION]: 'Infusão Simples',
    [MashProfileType.STEP_MASH]: 'Mostura por Rampa',
    [MashProfileType.DECOCTION]: 'Mostura por Decocção',
    [MashProfileType.BIAB]: 'Brew In A Bag (BIAB)',
  }

  const spargeMethodOptions = [
    { value: 'fly', label: 'Fly Sparge (Contínuo)' },
    { value: 'batch', label: 'Batch Sparge (Múltiplas Adições)' },
    { value: 'no_sparge', label: 'No Sparge (Sem Lavagem)' },
  ]

  const statusOptions = BATCH_STATUS_VALUES.map(status => ({
    value: status,
    label: BatchStatusLabels[status],
  }))

  const recipeMashSteps = useMemo((): MashStepFromRecipe[] => {
    const steps = fullRecipe?.mash?.mashProfile?.steps
    if (!Array.isArray(steps)) return []
    return steps.slice().sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0))
  }, [fullRecipe?.mash?.mashProfile?.steps])

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

    const profile = fullRecipe?.mash?.mashProfile
    const mashThickness = profile?.mashThickness ?? 3.0
    const strikeWaterVolume = grainWeight * mashThickness
    const grainAbsorption = grainWeight * 0.1 // ~0.1 L/kg
    const preBoilVolume =
      (watchedValues.plannedVolume || selectedRecipe?.plannedVolume || 20) +
      grainAbsorption
    const spargeVolume = Math.max(0, preBoilVolume - strikeWaterVolume)
    const totalWaterVolume = strikeWaterVolume + spargeVolume

    const targetTemp = recipeMashSteps[0]?.temperature ?? 65
    const grainTemp = profile?.grainTemperature ?? 20
    const tunTemp = profile?.tunTemperature ?? 20
    const tunWeight = profile?.tunWeight ?? 0
    const tunSpecificHeat = profile?.tunSpecificHeat ?? 0.3

    const strikeTemp =
      strikeWaterVolume > 0
        ? targetTemp +
          ((targetTemp - grainTemp) * grainWeight * 0.4 +
            (targetTemp - tunTemp) * tunWeight * tunSpecificHeat) /
            (strikeWaterVolume * 4.18)
        : targetTemp

    let preBoilGravity: number | null = null
    const efficiency = profile?.estimatedEfficiency ?? 75
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
  }, [selectedRecipe, watchedValues, fullRecipe, recipeMashSteps])

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
      plannedVolume: data.plannedVolume ?? null,
      actualOriginalGravity: data.actualOriginalGravity ?? null,
      actualEfficiency: data.actualEfficiency ?? null,
      actualStrikeTemp: data.actualStrikeTemp ?? null,
      preBoilVolume: data.actualPreBoilVolume ?? null,
      preBoilGravity: data.actualPreBoilGravity ?? null,
      spargeMethod: data.spargeMethod || null,
      spargeVolume: data.spargeVolume ?? null,
      spargeTemperature: data.spargeTemperature ?? null,
      observations: data.observations || null,
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
                    <DecimalInput
                      label="Volume Planejado (L)"
                      placeholder="Ex: 20"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </View>
            </View>
          )}

          {activeSection === 'mash' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Perfil de Mostura</Text>
              <Text variant="bodySmall" style={styles.readOnlyHint}>
                O perfil de mostura é definido na receita e não pode ser editado
                aqui.
              </Text>

              {!recipeId ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Selecione uma receita na aba Básico para ver o perfil de
                    mostura.
                  </Text>
                </View>
              ) : !fullRecipe?.mash?.mashProfile ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    A receita selecionada não possui perfil de mostura
                    configurado.
                  </Text>
                </View>
              ) : (
                <>
                  <Card style={styles.mashProfileCard}>
                    <View style={styles.mashProfileHeader}>
                      <Heading variant="h5" style={styles.mashProfileName}>
                        {fullRecipe.mash.mashProfile.name || 'Perfil sem nome'}
                      </Heading>
                      <Button
                        variant="outline"
                        size="small"
                        onPress={() => {
                          if (recipeId) {
                            navigate(`/recipes/${recipeId}/edit`)
                          }
                        }}
                      >
                        Editar receita
                      </Button>
                    </View>

                    <View style={styles.mashProfileMeta}>
                      <View style={styles.mashProfileMetaRow}>
                        <Text style={styles.mashProfileMetaLabel}>Tipo:</Text>
                        <Text style={styles.mashProfileMetaValue}>
                          {mashProfileTypeLabels[
                            fullRecipe.mash.mashProfile.type || ''
                          ] ||
                            fullRecipe.mash.mashProfile.type ||
                            '—'}
                        </Text>
                      </View>
                      {fullRecipe.mash.mashProfile.grainTemperature != null && (
                        <View style={styles.mashProfileMetaRow}>
                          <Text style={styles.mashProfileMetaLabel}>
                            Temp. grãos:
                          </Text>
                          <Text style={styles.mashProfileMetaValue}>
                            {fullRecipe.mash.mashProfile.grainTemperature} °C
                          </Text>
                        </View>
                      )}
                      {fullRecipe.mash.mashProfile.tunTemperature != null && (
                        <View style={styles.mashProfileMetaRow}>
                          <Text style={styles.mashProfileMetaLabel}>
                            Temp. tina:
                          </Text>
                          <Text style={styles.mashProfileMetaValue}>
                            {fullRecipe.mash.mashProfile.tunTemperature} °C
                          </Text>
                        </View>
                      )}
                      {fullRecipe.mash.mashProfile.spargeTemperature !=
                        null && (
                        <View style={styles.mashProfileMetaRow}>
                          <Text style={styles.mashProfileMetaLabel}>
                            Temp. sparge:
                          </Text>
                          <Text style={styles.mashProfileMetaValue}>
                            {fullRecipe.mash.mashProfile.spargeTemperature} °C
                          </Text>
                        </View>
                      )}
                      {fullRecipe.mash.mashProfile.mashThickness != null && (
                        <View style={styles.mashProfileMetaRow}>
                          <Text style={styles.mashProfileMetaLabel}>
                            Relação água/grão:
                          </Text>
                          <Text style={styles.mashProfileMetaValue}>
                            {fullRecipe.mash.mashProfile.mashThickness} L/kg
                          </Text>
                        </View>
                      )}
                      {fullRecipe.mash.mashProfile.estimatedEfficiency !=
                        null && (
                        <View style={styles.mashProfileMetaRow}>
                          <Text style={styles.mashProfileMetaLabel}>
                            Eficiência estimada:
                          </Text>
                          <Text style={styles.mashProfileMetaValue}>
                            {fullRecipe.mash.mashProfile.estimatedEfficiency}%
                          </Text>
                        </View>
                      )}
                    </View>

                    {recipeMashSteps.length > 0 && (
                      <View style={styles.mashStepsReadOnly}>
                        <Text style={styles.mashStepsReadOnlyTitle}>
                          Passos
                        </Text>
                        {recipeMashSteps.map((step, index) => (
                          <View
                            key={step.id || index}
                            style={styles.mashStepReadOnlyRow}
                          >
                            <Text style={styles.mashStepReadOnlyOrder}>
                              {step.stepOrder}
                            </Text>
                            <View style={styles.mashStepReadOnlyContent}>
                              <Text style={styles.mashStepReadOnlyName}>
                                {step.name}
                              </Text>
                              <Text style={styles.mashStepReadOnlyDetail}>
                                {step.stepType} • {step.temperature} °C •{' '}
                                {step.duration} min
                              </Text>
                              {step.infusionAmount != null &&
                                step.stepType === 'infusion' && (
                                  <Text style={styles.mashStepReadOnlyExtra}>
                                    Infusão: {step.infusionAmount} L
                                    {step.infusionTemp != null &&
                                      ` @ ${step.infusionTemp} °C`}
                                  </Text>
                                )}
                              {step.rampTime != null &&
                                step.stepType === 'temperature' && (
                                  <Text style={styles.mashStepReadOnlyExtra}>
                                    Rampa: {step.rampTime} min
                                  </Text>
                                )}
                              {step.decoctionAmount != null &&
                                step.stepType === 'decoction' && (
                                  <Text style={styles.mashStepReadOnlyExtra}>
                                    Decocção: {step.decoctionAmount} L
                                  </Text>
                                )}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </Card>

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
                </>
              )}
            </View>
          )}

          {activeSection === 'sparge' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sparging (Lavagem)</Text>
              <Text style={styles.sectionHint}>
                Lavagem dos grãos com água quente após a mostura. Método, volume
                e temperatura são salvos no lote para referência e
                repetibilidade. Temperatura padrão vem do perfil de mostura da
                receita.
              </Text>
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
                    <DecimalInput
                      label="Volume de Água de Sparge (L)"
                      placeholder={calculations.spargeVolume}
                      value={value ?? undefined}
                      onChange={val => onChange(val ?? undefined)}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name="spargeTemperature"
                  render={({ field: { value, onChange } }) => (
                    <DecimalInput
                      label="Temperatura da Água de Sparge (°C)"
                      placeholder="78"
                      value={value ?? undefined}
                      onChange={val => onChange(val ?? undefined)}
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
  sectionHint: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  readOnlyHint: {
    color: COLORS.text.secondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  mashProfileCard: {
    padding: 16,
    marginBottom: 16,
  },
  mashProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  mashProfileName: {
    color: COLORS.text.primary,
    flex: 1,
  },
  mashProfileMeta: {
    gap: 8,
    marginBottom: 16,
  },
  mashProfileMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mashProfileMetaLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    minWidth: 140,
  },
  mashProfileMetaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  mashStepsReadOnly: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  mashStepsReadOnlyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  mashStepReadOnlyRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  mashStepReadOnlyOrder: {
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
  mashStepReadOnlyContent: {
    flex: 1,
  },
  mashStepReadOnlyName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  mashStepReadOnlyDetail: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  mashStepReadOnlyExtra: {
    fontSize: 11,
    color: COLORS.text.tertiary,
    marginTop: 2,
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
