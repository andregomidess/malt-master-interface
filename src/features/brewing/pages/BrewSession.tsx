import { useState, useMemo, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Layout } from '../../../shared/components/Layout'
import { Text, Heading } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { useBatchDetail } from '../hooks/useBatchDetail'
import { BatchStatusBadge } from '../components/BatchStatusBadge'
import { BrewTimer } from '../components/BrewTimer'
import { GuidedStepCard } from '../components/GuidedStepCard'
import { MeasuredValuesPanel } from '../components/MeasuredValuesPanel'
import { HopSchedule } from '../components/HopSchedule'
import {
  formatGravity,
  formatPercentage,
  BatchStatus,
} from '../interfaces/Brewing'
import { useSaveBatch, type BatchInput } from '../hooks/useSaveBatch'
import { Button } from '../../../shared/components/Button'
import { InputText } from '../../../shared/components/InputText'
import { DateInput } from '../../../shared/components/DateInput'
import { BiChevronLeft, BiChevronRight, BiDownload } from 'react-icons/bi'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { generateBrewPdf } from '../utils/generateBrewPdf'

type PhaseType = 'planning' | 'mash' | 'fermenting' | 'completed'

interface BrewSessionProps {
  batchId: string
}

export function BrewSession({ batchId }: BrewSessionProps) {
  const navigate = useNavigate()
  const { detail, loading, error, refetch } = useBatchDetail(batchId)
  const { mutate: saveBatch, isPending: isSaving } = useSaveBatch()
  const [activePhase, setActivePhase] = useState<PhaseType>('mash')
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [measuredValues, setMeasuredValues] = useState({
    mashPh: null as number | null,
    preBoilGravity: null as number | null,
    preBoilVolume: null as number | null,
    postBoilGravity: null as number | null,
    postBoilVolume: null as number | null,
    waterInFermenter: null as number | null,
    fermenterVolume: null as number | null,
    actualFinalGravity: null as number | null,
    peakFermentationTemp: null as number | null,
    bottlingVolume: null as number | null,
  })
  console.log(detail)

  const [finalValues, setFinalValues] = useState({
    finalVolume: null as number | null,
    actualAbv: null as number | null,
    actualIbu: null as number | null,
    actualColor: null as number | null,
    actualCarbonation: null as number | null,
    fermentationTemperature: null as number | null,
    fermentationTime: null as number | null,
    packagingDate: null as string | null,
    readyDate: null as string | null,
  })

  useEffect(() => {
    const saved = localStorage.getItem(`brew_session_${batchId}`)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCompletedSteps(new Set(data.completedSteps || []))
        if (data.measuredValues) {
          setMeasuredValues(data.measuredValues)
        }
        if (data.finalValues) {
          setFinalValues(data.finalValues)
        }
        setActiveStepIndex(data.activeStepIndex || 0)
      } catch {
        console.error('Erro ao carregar estado do localStorage')
      }
    }
  }, [batchId])

  useEffect(() => {
    if (detail?.batch) {
      const batch = detail.batch
      setMeasuredValues(prev => {
        const toNum = (v: number | string | null | undefined) => {
          if (v == null) return null
          const n = typeof v === 'string' ? parseFloat(v) : v
          return isNaN(n) ? null : n
        }
        return {
          ...prev,
          mashPh: toNum(batch.mashPh) ?? prev.mashPh,
          preBoilGravity: toNum(batch.preBoilGravity) ?? prev.preBoilGravity,
          preBoilVolume: toNum(batch.preBoilVolume) ?? prev.preBoilVolume,
          postBoilGravity:
            toNum(batch.actualOriginalGravity) ?? prev.postBoilGravity,
          postBoilVolume: toNum(batch.postBoilVolume) ?? prev.postBoilVolume,
          waterInFermenter:
            toNum(batch.waterInFermenter) ?? prev.waterInFermenter,
          fermenterVolume: toNum(batch.fermenterVolume) ?? prev.fermenterVolume,
          actualFinalGravity:
            toNum(batch.actualFinalGravity) ?? prev.actualFinalGravity,
          peakFermentationTemp:
            toNum(batch.peakFermentationTemp) ?? prev.peakFermentationTemp,
          bottlingVolume: toNum(batch.bottlingVolume) ?? prev.bottlingVolume,
        }
      })
      setFinalValues({
        finalVolume: batch.finalVolume || null,
        actualAbv: batch.actualAbv || null,
        actualIbu: batch.actualIbu || null,
        actualColor: batch.actualColor || null,
        actualCarbonation: batch.actualCarbonation || null,
        fermentationTemperature: batch.fermentationTemperature || null,
        fermentationTime: batch.fermentationTime || null,
        packagingDate: batch.packagingDate || null,
        readyDate: batch.readyDate || null,
      })
    }
  }, [detail])

  useEffect(() => {
    const data = {
      completedSteps: Array.from(completedSteps),
      measuredValues,
      finalValues,
      activeStepIndex,
    }
    localStorage.setItem(`brew_session_${batchId}`, JSON.stringify(data))
  }, [completedSteps, measuredValues, finalValues, activeStepIndex, batchId])

  const currentSteps = useMemo(() => {
    if (!detail) return []

    if (activePhase === 'mash') {
      const mashStepsToUse = detail.mashSteps || []

      return mashStepsToUse.map(step => ({
        id: step.id,
        order: step.stepOrder,
        title: step.name,
        description: step.description || undefined,
        duration: step.duration,
        temperature: step.temperature,
        stepType: step.stepType,
        details: [
          { label: 'Temperatura', value: `${step.temperature}°C` },
          { label: 'Duração', value: `${step.duration} min` },
          ...(step.infusionAmount
            ? [{ label: 'Infusão', value: `${step.infusionAmount} L` }]
            : []),
        ],
      }))
    }
    return []
  }, [activePhase, detail])

  if (loading) {
    return (
      <Layout activeMenuItem="brewings">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primary} />
        </View>
      </Layout>
    )
  }

  if (error || !detail) {
    return (
      <Layout activeMenuItem="brewings">
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Lote não encontrado'}</Text>
        </View>
      </Layout>
    )
  }

  const { batch, fermentationSteps, hopSchedule } = detail

  const activeStep = currentSteps[activeStepIndex]
  const isStepCompleted = activeStep ? completedSteps.has(activeStep.id) : false

  const handleToggleStepComplete = (stepId: string) => {
    const isMarkingComplete = !completedSteps.has(stepId)
    const isActiveStep = activeStep?.id === stepId

    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })

    // Ao marcar a etapa ativa como concluída, avança para a próxima (timer atualiza)
    if (
      isMarkingComplete &&
      isActiveStep &&
      activeStepIndex < currentSteps.length - 1
    ) {
      setActiveStepIndex(prev => prev + 1)
    }
  }

  const handleNextStep = () => {
    if (activeStepIndex < currentSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1)
    }
  }

  const handlePreviousStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1)
    }
  }

  const handleUpdateMeasuredValue = (id: string, value: number | null) => {
    setMeasuredValues(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSaveMeasuredValues = async () => {
    try {
      // Salvar valores medidos no batch
      // Nota: actualPreBoilGravity não existe na interface Batch atual
      // Os valores são salvos localmente e podem ser adicionados ao backend depois
      toast.success('Valores salvos localmente!')
    } catch {
      toast.error('Erro ao salvar valores')
    }
  }

  const calculateABV = (
    og: number | null,
    fg: number | null,
  ): number | null => {
    if (!og || !fg) return null
    // Fórmula padrão de ABV: ((OG - FG) * 131.25)
    return (og - fg) * 131.25
  }

  const handleUpdateFinalValue = (
    field: string,
    value: number | string | null,
  ) => {
    setFinalValues(prev => {
      return { ...prev, [field]: value }
    })
  }

  const handleUpdateMeasuredValueWithABV = (
    id: string,
    value: number | null,
  ) => {
    handleUpdateMeasuredValue(id, value)

    // Calcular ABV automaticamente se FG foi atualizado
    if (id === 'actualFinalGravity') {
      const og =
        measuredValues.postBoilGravity ||
        detail?.batch.actualOriginalGravity ||
        null
      if (og && value) {
        const calculatedABV = calculateABV(og, value)
        setFinalValues(prev => ({ ...prev, actualAbv: calculatedABV }))
      }
    }
  }

  const calculateAttenuation = (
    og: number | null,
    fg: number | null,
  ): number | null => {
    if (!og || !fg) return null
    return ((og - fg) / (og - 1.0)) * 100
  }

  const handleSaveBatchValues = () => {
    if (!detail?.batch) {
      toast.error('Erro ao carregar dados do lote')
      return
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) {
      toast.error('Usuário não encontrado')
      return
    }

    const toNumberOrNull = (
      value: number | string | null | undefined,
    ): number | null => {
      if (value === null || value === undefined) return null
      const num = typeof value === 'string' ? parseFloat(value) : value
      return isNaN(num) ? null : num
    }

    const batchData: BatchInput = {
      id: detail.batch.id,
      user: user.id,
      recipe: detail.batch.recipe?.id || '',
      ...(detail.batch.equipment?.id && {
        equipment: detail.batch.equipment.id,
      }),
      name: detail.batch.name || null,
      batchCode: detail.batch.batchCode || null,
      brewDate: detail.batch.brewDate || null,
      packagingDate:
        finalValues.packagingDate ?? detail.batch.packagingDate ?? null,
      readyDate: finalValues.readyDate ?? detail.batch.readyDate ?? null,
      status: detail.batch.status,
      plannedVolume: toNumberOrNull(detail.batch.plannedVolume),
      finalVolume: toNumberOrNull(
        finalValues.finalVolume ?? detail.batch.finalVolume,
      ),
      ...(measuredValues.postBoilGravity && {
        actualOriginalGravity: measuredValues.postBoilGravity,
      }),
      actualFinalGravity: toNumberOrNull(measuredValues.actualFinalGravity),
      actualAbv: toNumberOrNull(finalValues.actualAbv),
      actualIbu: toNumberOrNull(
        finalValues.actualIbu ?? detail.batch.actualIbu,
      ),
      actualColor: toNumberOrNull(
        finalValues.actualColor ?? detail.batch.actualColor,
      ),
      actualCarbonation: toNumberOrNull(finalValues.actualCarbonation),
      actualEfficiency: toNumberOrNull(detail.batch.actualEfficiency),
      fermentationTemperature: toNumberOrNull(
        finalValues.fermentationTemperature,
      ),
      fermentationTime: toNumberOrNull(finalValues.fermentationTime),
      // Valores medidos durante a sessão
      mashPh: toNumberOrNull(measuredValues.mashPh),
      preBoilGravity: toNumberOrNull(measuredValues.preBoilGravity),
      preBoilVolume: toNumberOrNull(measuredValues.preBoilVolume),
      postBoilVolume: toNumberOrNull(measuredValues.postBoilVolume),
      waterInFermenter: toNumberOrNull(measuredValues.waterInFermenter),
      fermenterVolume: toNumberOrNull(measuredValues.fermenterVolume),
      peakFermentationTemp: toNumberOrNull(measuredValues.peakFermentationTemp),
      bottlingVolume: toNumberOrNull(measuredValues.bottlingVolume),
      observations: detail.batch.observations || null,
    }

    saveBatch(batchData, {
      onSuccess: () => {
        toast.success('Valores salvos no lote com sucesso!')
        setTimeout(() => {
          refetch()
        }, 500)
      },
    })
  }

  const handleChangeStatus = (newStatus: BatchStatus) => {
    if (!detail?.batch) {
      toast.error('Erro ao carregar dados do lote')
      return
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) {
      toast.error('Usuário não encontrado')
      return
    }

    const toNumberOrNull = (
      value: number | string | null | undefined,
    ): number | null => {
      if (value === null || value === undefined) return null
      const num = typeof value === 'string' ? parseFloat(value) : value
      return isNaN(num) ? null : num
    }

    // Calcular ABV se OG e FG estiverem disponíveis
    const og =
      measuredValues.postBoilGravity ||
      detail.batch.actualOriginalGravity ||
      null
    const fg =
      measuredValues.actualFinalGravity ||
      detail.batch.actualFinalGravity ||
      null
    const calculatedABV =
      og && fg ? calculateABV(og, fg) : finalValues.actualAbv

    const batchData: BatchInput = {
      id: detail.batch.id,
      user: user.id,
      recipe: detail.batch.recipe?.id || '',
      ...(detail.batch.equipment?.id && {
        equipment: detail.batch.equipment.id,
      }),
      name: detail.batch.name || null,
      batchCode: detail.batch.batchCode || null,
      brewDate: detail.batch.brewDate || null,
      packagingDate:
        finalValues.packagingDate || detail.batch.packagingDate || null,
      readyDate: finalValues.readyDate || detail.batch.readyDate || null,
      status: newStatus,
      plannedVolume: toNumberOrNull(detail.batch.plannedVolume),
      finalVolume: toNumberOrNull(
        finalValues.finalVolume || detail.batch.finalVolume,
      ),
      ...(measuredValues.postBoilGravity && {
        actualOriginalGravity: measuredValues.postBoilGravity,
      }),
      actualFinalGravity: toNumberOrNull(measuredValues.actualFinalGravity),
      actualAbv: toNumberOrNull(calculatedABV || detail.batch.actualAbv),
      actualIbu: toNumberOrNull(
        finalValues.actualIbu || detail.batch.actualIbu,
      ),
      actualColor: toNumberOrNull(
        finalValues.actualColor || detail.batch.actualColor,
      ),
      actualCarbonation: toNumberOrNull(finalValues.actualCarbonation),
      actualEfficiency: toNumberOrNull(detail.batch.actualEfficiency),
      fermentationTemperature: toNumberOrNull(
        finalValues.fermentationTemperature,
      ),
      fermentationTime: toNumberOrNull(finalValues.fermentationTime),
      // Valores medidos durante a sessão
      mashPh: toNumberOrNull(measuredValues.mashPh),
      preBoilGravity: toNumberOrNull(measuredValues.preBoilGravity),
      preBoilVolume: toNumberOrNull(measuredValues.preBoilVolume),
      postBoilVolume: toNumberOrNull(measuredValues.postBoilVolume),
      waterInFermenter: toNumberOrNull(measuredValues.waterInFermenter),
      fermenterVolume: toNumberOrNull(measuredValues.fermenterVolume),
      peakFermentationTemp: toNumberOrNull(measuredValues.peakFermentationTemp),
      bottlingVolume: toNumberOrNull(measuredValues.bottlingVolume),
      observations: detail.batch.observations || null,
    }

    saveBatch(batchData, {
      onSuccess: () => {
        const statusLabels: Record<BatchStatus, string> = {
          planned: 'Planejada',
          fermenting: 'Fermentando',
          maturing: 'Maturando',
          packaged: 'Envasada',
          completed: 'Finalizada',
        }
        toast.success(
          `Status alterado para "${statusLabels[newStatus]}" com sucesso!`,
        )
        setTimeout(() => {
          refetch()
        }, 500)
      },
    })
  }

  const handleCompleteBatch = () => {
    if (!detail?.batch) {
      toast.error('Erro ao carregar dados do lote')
      return
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) {
      toast.error('Usuário não encontrado')
      return
    }

    const toNumberOrNull = (
      value: number | string | null | undefined,
    ): number | null => {
      if (value === null || value === undefined) return null
      const num = typeof value === 'string' ? parseFloat(value) : value
      return isNaN(num) ? null : num
    }

    // Calcular ABV se OG e FG estiverem disponíveis
    const og =
      measuredValues.postBoilGravity ||
      detail.batch.actualOriginalGravity ||
      null
    const fg =
      measuredValues.actualFinalGravity ||
      detail.batch.actualFinalGravity ||
      null
    const calculatedABV =
      og && fg ? calculateABV(og, fg) : finalValues.actualAbv

    const batchData: BatchInput = {
      id: detail.batch.id,
      user: user.id,
      recipe: detail.batch.recipe?.id || '',
      ...(detail.batch.equipment?.id && {
        equipment: detail.batch.equipment.id,
      }),
      name: detail.batch.name || null,
      batchCode: detail.batch.batchCode || null,
      brewDate: detail.batch.brewDate || null,
      packagingDate: finalValues.packagingDate || null,
      readyDate: finalValues.readyDate || null,
      status: 'completed',
      plannedVolume: toNumberOrNull(detail.batch.plannedVolume),
      finalVolume: toNumberOrNull(finalValues.finalVolume),
      ...(measuredValues.postBoilGravity && {
        actualOriginalGravity: measuredValues.postBoilGravity,
      }),
      actualFinalGravity: toNumberOrNull(measuredValues.actualFinalGravity),
      actualAbv: toNumberOrNull(calculatedABV),
      actualIbu: toNumberOrNull(finalValues.actualIbu),
      actualColor: toNumberOrNull(finalValues.actualColor),
      actualCarbonation: toNumberOrNull(finalValues.actualCarbonation),
      actualEfficiency: toNumberOrNull(detail.batch.actualEfficiency),
      fermentationTemperature: toNumberOrNull(
        finalValues.fermentationTemperature,
      ),
      fermentationTime: toNumberOrNull(finalValues.fermentationTime),
      // Valores medidos durante a sessão
      mashPh: toNumberOrNull(measuredValues.mashPh),
      preBoilGravity: toNumberOrNull(measuredValues.preBoilGravity),
      preBoilVolume: toNumberOrNull(measuredValues.preBoilVolume),
      postBoilVolume: toNumberOrNull(measuredValues.postBoilVolume),
      waterInFermenter: toNumberOrNull(measuredValues.waterInFermenter),
      fermenterVolume: toNumberOrNull(measuredValues.fermenterVolume),
      peakFermentationTemp: toNumberOrNull(measuredValues.peakFermentationTemp),
      bottlingVolume: toNumberOrNull(measuredValues.bottlingVolume),
      observations: detail.batch.observations || null,
    }

    saveBatch(batchData, {
      onSuccess: () => {
        toast.success('Lote completado com sucesso!')
        setTimeout(() => {
          refetch()
        }, 500)
      },
    })
  }

  const handleExportPdf = async () => {
    if (!detail) {
      toast.error('Erro ao carregar dados do lote')
      return
    }

    try {
      await generateBrewPdf({
        batchDetail: detail,
        measuredValues,
      })
      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF')
    }
  }

  const phases: Array<{ key: PhaseType; label: string }> = [
    { key: 'planning', label: 'Planejamento' },
    { key: 'mash', label: 'Brassagem' },
    { key: 'fermenting', label: 'Fermentando' },
    { key: 'completed', label: 'Concluído' },
  ]

  const mashIngredients: string[] = []

  return (
    <Layout activeMenuItem="brewings">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Heading variant="h3" style={styles.title}>
                {batch.name || batch.recipe?.name}
              </Heading>
              <Text style={styles.code}>{batch.batchCode || '—'}</Text>
            </View>
            <View style={styles.headerRight}>
              <Button
                variant="outline"
                size="small"
                onPress={handleExportPdf}
                style={styles.exportButton}
              >
                <View style={styles.buttonContent}>
                  <BiDownload size={18} color={COLORS.brand.primary} />
                  <Text style={styles.buttonText}>Exportar PDF</Text>
                </View>
              </Button>
              <BatchStatusBadge status={batch.status} />
            </View>
          </View>

          <View style={styles.phasesNav}>
            {phases.map(phase => (
              <TouchableOpacity
                key={phase.key}
                style={[
                  styles.phaseTab,
                  activePhase === phase.key && styles.phaseTabActive,
                ]}
                onPress={() => setActivePhase(phase.key)}
              >
                <Text
                  style={[
                    styles.phaseTabText,
                    activePhase === phase.key && styles.phaseTabTextActive,
                  ]}
                >
                  {phase.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {activePhase === 'mash' && (
          <View style={styles.phaseContent}>
            {activeStep && (
              <View style={styles.timerSection}>
                <BrewTimer
                  duration={activeStep.duration}
                  onComplete={() => {
                    handleToggleStepComplete(activeStep.id)
                    toast.success(`Passo "${activeStep.title}" concluído!`)
                  }}
                />
              </View>
            )}

            {activeStep && (
              <View style={styles.currentStepSection}>
                <View style={styles.stepHeader}>
                  <Text style={styles.currentStepTitle}>
                    {activeStep.order}. {activeStep.title}
                  </Text>
                  <View style={styles.stepNavigation}>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        activeStepIndex === 0 && styles.navButtonDisabled,
                      ]}
                      onPress={handlePreviousStep}
                      disabled={activeStepIndex === 0}
                    >
                      <BiChevronLeft
                        size={24}
                        color={
                          activeStepIndex === 0
                            ? COLORS.text.tertiary
                            : COLORS.brand.primary
                        }
                      />
                    </TouchableOpacity>
                    <Text style={styles.stepCounter}>
                      {activeStepIndex + 1} / {currentSteps.length}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        activeStepIndex === currentSteps.length - 1 &&
                          styles.navButtonDisabled,
                      ]}
                      onPress={handleNextStep}
                      disabled={activeStepIndex === currentSteps.length - 1}
                    >
                      <BiChevronRight
                        size={24}
                        color={
                          activeStepIndex === currentSteps.length - 1
                            ? COLORS.text.tertiary
                            : COLORS.brand.primary
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <GuidedStepCard
                  stepOrder={activeStep.order}
                  title={activeStep.title}
                  description={activeStep.description}
                  details={activeStep.details}
                  isCompleted={isStepCompleted}
                  isActive={true}
                  onToggleComplete={() =>
                    handleToggleStepComplete(activeStep.id)
                  }
                />
              </View>
            )}

            {currentSteps.length > 0 && (
              <View style={styles.stepsList}>
                <Text style={styles.sectionTitle}>Passos da Mostura</Text>
                {currentSteps.map((step, index) => {
                  if (index === activeStepIndex) return null
                  return (
                    <GuidedStepCard
                      key={step.id}
                      stepOrder={step.order}
                      title={step.title}
                      description={step.description}
                      details={step.details}
                      isCompleted={completedSteps.has(step.id)}
                      isActive={false}
                      onToggleComplete={() => handleToggleStepComplete(step.id)}
                      onActivate={() => setActiveStepIndex(index)}
                    />
                  )
                })}
              </View>
            )}

            {mashIngredients.length > 0 && (
              <View style={styles.ingredientsSection}>
                <Text style={styles.sectionTitle}>
                  Ingredientes para Mostura
                </Text>
                <View style={styles.ingredientsList}>
                  {mashIngredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientItem}>
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {hopSchedule.length > 0 && (
              <View style={styles.hopScheduleSection}>
                <Text style={styles.sectionTitle}>Cronograma de Lúpulos</Text>
                <HopSchedule hops={hopSchedule} />
              </View>
            )}

            <View style={styles.measuredValuesSection}>
              <MeasuredValuesPanel
                values={[
                  {
                    id: 'mashPh',
                    label: 'pH da Mostura',
                    value: measuredValues.mashPh,
                  },
                  {
                    id: 'preBoilVolume',
                    label: 'Volume da Fervura',
                    value: measuredValues.preBoilVolume,
                    target: batch.plannedVolume
                      ? Number(batch.plannedVolume)
                      : undefined,
                    unit: 'L',
                  },
                  {
                    id: 'preBoilGravity',
                    label: 'Densidade Pré Fervura',
                    value: measuredValues.preBoilGravity,
                    unit: 'SG',
                  },
                  {
                    id: 'postBoilGravity',
                    label: 'Densidade Pós Fervura (OG)',
                    value: measuredValues.postBoilGravity,
                    target: batch.recipe?.og
                      ? Number(batch.recipe.og)
                      : undefined,
                    unit: 'SG',
                  },
                  {
                    id: 'postBoilVolume',
                    label: 'Volume Pós Fervura',
                    value: measuredValues.postBoilVolume,
                    target: batch.plannedVolume
                      ? Number(batch.plannedVolume)
                      : undefined,
                    unit: 'L',
                  },
                ]}
                onUpdate={(id, value) => handleUpdateMeasuredValue(id, value)}
                onSave={handleSaveMeasuredValues}
              />
            </View>
          </View>
        )}

        {activePhase === 'planning' && (
          <View style={styles.phaseContent}>
            <Text style={styles.sectionTitle}>Informações do Lote</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estilo:</Text>
                <Text style={styles.infoValue}>
                  {typeof batch.recipe?.beerStyle === 'object' &&
                  batch.recipe?.beerStyle
                    ? batch.recipe.beerStyle.name
                    : batch.recipe?.styleName || '—'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Equipamento:</Text>
                <Text style={styles.infoValue}>
                  {batch.equipment?.name || '—'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Volume Planejado:</Text>
                <Text style={styles.infoValue}>
                  {batch.plannedVolume ? `${batch.plannedVolume} L` : '—'}
                </Text>
              </View>
            </View>

            {batch.status !== 'planned' && (
              <View style={styles.statusChangeSection}>
                <Button
                  variant="outline"
                  size="medium"
                  onPress={() => handleChangeStatus('planned')}
                  disabled={isSaving}
                >
                  Mudar Status para Planejada
                </Button>
              </View>
            )}
          </View>
        )}

        {activePhase === 'fermenting' && (
          <View style={styles.phaseContent}>
            <Text style={styles.sectionTitle}>Perfil de Fermentação</Text>
            {fermentationSteps.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhuma etapa de fermentação definida
              </Text>
            ) : (
              <View style={styles.fermentationSteps}>
                {fermentationSteps.map(step => (
                  <View key={step.id} style={styles.fermentationStepCard}>
                    <Text style={styles.fermentationStepTitle}>
                      {step.stepOrder}. {step.name}
                    </Text>
                    <Text style={styles.fermentationStepDetails}>
                      {step.temperature}°C por {step.duration} dias
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.measuredValuesSection}>
              <Text style={styles.sectionTitle}>Valores Mensurados</Text>
              <MeasuredValuesPanel
                values={[
                  {
                    id: 'postBoilVolume',
                    label: 'Volume Pós Fervura',
                    value: measuredValues.postBoilVolume,
                    unit: 'L',
                  },
                  {
                    id: 'waterInFermenter',
                    label: 'Água no Fermentador',
                    value: measuredValues.waterInFermenter,
                    unit: 'L',
                  },
                  {
                    id: 'fermenterVolume',
                    label: 'Volume do Fermentador',
                    value: measuredValues.fermenterVolume,
                    unit: 'L',
                  },
                  {
                    id: 'actualFinalGravity',
                    label: 'Densidade Final (FG)',
                    value: measuredValues.actualFinalGravity,
                    unit: 'SG',
                  },
                  {
                    id: 'peakFermentationTemp',
                    label: 'Pico de Temp. na Fermentação',
                    value: measuredValues.peakFermentationTemp,
                    unit: '°C',
                  },
                  {
                    id: 'bottlingVolume',
                    label: 'Volume de Engarrafamento',
                    value: measuredValues.bottlingVolume,
                    unit: 'L',
                  },
                ]}
                onUpdate={(id, value) => {
                  if (id === 'actualFinalGravity') {
                    handleUpdateMeasuredValueWithABV(id, value)
                  } else {
                    handleUpdateMeasuredValue(id, value)
                  }
                }}
                onSave={handleSaveMeasuredValues}
              />
            </View>

            {/* Estatísticas Calculadas */}
            {(measuredValues.postBoilGravity ||
              measuredValues.actualFinalGravity ||
              detail?.batch.actualOriginalGravity) && (
              <View style={styles.statisticsSection}>
                <Text style={styles.sectionTitle}>Estatísticas</Text>
                <View style={styles.statisticsGrid}>
                  <View style={styles.statisticCard}>
                    <Text style={styles.statisticLabel}>ABV</Text>
                    <Text style={styles.statisticValue}>
                      {formatPercentage(
                        (() => {
                          const og =
                            measuredValues.postBoilGravity ||
                            detail?.batch.actualOriginalGravity ||
                            null
                          const fg = measuredValues.actualFinalGravity || null
                          return calculateABV(og, fg)
                        })(),
                      )}
                    </Text>
                  </View>
                  <View style={styles.statisticCard}>
                    <Text style={styles.statisticLabel}>Atenuação</Text>
                    <Text style={styles.statisticValue}>
                      {formatPercentage(
                        (() => {
                          const og =
                            measuredValues.postBoilGravity ||
                            detail?.batch.actualOriginalGravity ||
                            null
                          const fg = measuredValues.actualFinalGravity || null
                          return calculateAttenuation(og, fg)
                        })(),
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Carbonatação */}
            {measuredValues.bottlingVolume && (
              <View style={styles.carbonationSection}>
                <Text style={styles.sectionTitle}>Carbonatação</Text>
                <View style={styles.carbonationCard}>
                  <Text style={styles.carbonationText}>
                    {finalValues.actualCarbonation
                      ? `Para ${finalValues.actualCarbonation} vols de CO₂ em ${measuredValues.bottlingVolume} L a ${finalValues.fermentationTemperature || 20}°C:`
                      : 'Configure a carbonatação desejada'}
                  </Text>
                  <View style={styles.formRow}>
                    <View style={styles.formFieldHalf}>
                      <InputText
                        label="Carbonatação Desejada (vols CO₂)"
                        placeholder="Ex: 2.5"
                        value={finalValues.actualCarbonation?.toString() || ''}
                        onChangeText={val => {
                          const num = parseFloat(val)
                          handleUpdateFinalValue(
                            'actualCarbonation',
                            isNaN(num) ? null : num,
                          )
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.formFieldHalf}>
                      <InputText
                        label="Temp. de Fermentação (°C)"
                        placeholder="Ex: 20"
                        value={
                          finalValues.fermentationTemperature?.toString() || ''
                        }
                        onChangeText={val => {
                          const num = parseFloat(val)
                          handleUpdateFinalValue(
                            'fermentationTemperature',
                            isNaN(num) ? null : num,
                          )
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Botão para mudar status */}
            {batch.status !== 'fermenting' && (
              <View style={styles.statusChangeSection}>
                <Button
                  variant="outline"
                  size="medium"
                  onPress={() => handleChangeStatus('fermenting')}
                  disabled={isSaving}
                >
                  Mudar Status para Fermentando
                </Button>
              </View>
            )}

            {batch.status === 'fermenting' && (
              <View style={styles.statusChangeSection}>
                <View style={styles.statusChangeButtons}>
                  <Button
                    variant="outline"
                    size="medium"
                    onPress={() => handleChangeStatus('maturing')}
                    disabled={isSaving}
                  >
                    Mudar Status para Maturando
                  </Button>
                  <Button
                    variant="outline"
                    size="medium"
                    onPress={() => handleChangeStatus('packaged')}
                    disabled={isSaving}
                  >
                    Mudar Status para Envasada
                  </Button>
                </View>
              </View>
            )}
          </View>
        )}

        {activePhase === 'completed' && (
          <View style={styles.phaseContent}>
            <Text style={styles.sectionTitle}>Completar Lote</Text>

            {batch.status === 'completed' ? (
              <>
                <Text style={styles.sectionTitle}>Resultados Finais</Text>
                <View style={styles.resultsGrid}>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>OG Real</Text>
                    <Text style={styles.resultValue}>
                      {formatGravity(batch.actualOriginalGravity)}
                    </Text>
                  </View>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>FG Real</Text>
                    <Text style={styles.resultValue}>
                      {formatGravity(batch.actualFinalGravity)}
                    </Text>
                  </View>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>ABV</Text>
                    <Text style={styles.resultValue}>
                      {formatPercentage(batch.actualAbv)}
                    </Text>
                  </View>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>Volume Final</Text>
                    <Text style={styles.resultValue}>
                      {batch.finalVolume ? `${batch.finalVolume} L` : '—'}
                    </Text>
                  </View>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>Eficiência</Text>
                    <Text style={styles.resultValue}>
                      {formatPercentage(batch.actualEfficiency)}
                    </Text>
                  </View>
                  {batch.packagingDate && (
                    <View style={styles.resultCard}>
                      <Text style={styles.resultLabel}>
                        Data de Envasamento
                      </Text>
                      <Text style={styles.resultValue}>
                        {new Date(batch.packagingDate).toLocaleDateString(
                          'pt-BR',
                        )}
                      </Text>
                    </View>
                  )}
                  {batch.readyDate && (
                    <View style={styles.resultCard}>
                      <Text style={styles.resultLabel}>Data de Pronto</Text>
                      <Text style={styles.resultValue}>
                        {new Date(batch.readyDate).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.completeForm}>
                <Text style={styles.formSectionTitle}>Valores Finais</Text>

                <View style={styles.formRow}>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="Volume Final (L)"
                      placeholder="Ex: 19"
                      value={finalValues.finalVolume?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateFinalValue(
                          'finalVolume',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="Densidade Final (FG)"
                      placeholder="Ex: 1.012"
                      value={
                        measuredValues.actualFinalGravity?.toString() || ''
                      }
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateMeasuredValue(
                          'actualFinalGravity',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="ABV (%)"
                      placeholder="Calculado automaticamente"
                      value={finalValues.actualAbv?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateFinalValue(
                          'actualAbv',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                      editable={true}
                    />
                  </View>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="IBU Real"
                      placeholder="Ex: 45"
                      value={finalValues.actualIbu?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateFinalValue(
                          'actualIbu',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="Cor Real (EBC)"
                      placeholder="Ex: 12"
                      value={finalValues.actualColor?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateFinalValue(
                          'actualColor',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="Carbonatação (vols CO₂)"
                      placeholder="Ex: 2.5"
                      value={finalValues.actualCarbonation?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateFinalValue(
                          'actualCarbonation',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.formSectionTitle}>Fermentação</Text>

                <View style={styles.formRow}>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="Temperatura de Fermentação (°C)"
                      placeholder="Ex: 18"
                      value={
                        finalValues.fermentationTemperature?.toString() || ''
                      }
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateFinalValue(
                          'fermentationTemperature',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formFieldHalf}>
                    <InputText
                      label="Tempo de Fermentação (dias)"
                      placeholder="Ex: 14"
                      value={finalValues.fermentationTime?.toString() || ''}
                      onChangeText={val => {
                        const num = parseFloat(val)
                        handleUpdateFinalValue(
                          'fermentationTime',
                          isNaN(num) ? null : num,
                        )
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.formSectionTitle}>Datas</Text>

                <View style={styles.formRow}>
                  <View style={styles.formFieldHalf}>
                    <DateInput
                      label="Data de Envasamento"
                      value={finalValues.packagingDate || undefined}
                      onChange={date =>
                        handleUpdateFinalValue('packagingDate', date)
                      }
                    />
                  </View>
                  <View style={styles.formFieldHalf}>
                    <DateInput
                      label="Data de Pronto"
                      value={finalValues.readyDate || undefined}
                      onChange={date =>
                        handleUpdateFinalValue('readyDate', date)
                      }
                    />
                  </View>
                </View>

                <View style={styles.completeButtonContainer}>
                  <Button
                    variant="outline"
                    size="medium"
                    onPress={handleSaveBatchValues}
                    disabled={isSaving}
                    loading={isSaving}
                    style={styles.saveFinalValuesButton}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Valores Finais'}
                  </Button>
                  <Button
                    variant="primary"
                    size="large"
                    onPress={handleCompleteBatch}
                    disabled={isSaving}
                    loading={isSaving}
                  >
                    {isSaving ? 'Completando...' : 'Completar Lote'}
                  </Button>
                  <Text style={styles.completeButtonHint}>
                    Marca o lote como completado e salva todos os valores
                    finais.
                  </Text>
                </View>
              </View>
            )}

            {(measuredValues.preBoilGravity !== null ||
              measuredValues.preBoilVolume !== null ||
              measuredValues.postBoilGravity !== null ||
              measuredValues.mashPh !== null) && (
              <View style={styles.measuredValuesSummary}>
                <Text style={styles.sectionTitle}>
                  Valores Medidos na Sessão
                </Text>
                <View style={styles.measuredValuesList}>
                  {measuredValues.preBoilGravity !== null && (
                    <View style={styles.measuredValueRow}>
                      <Text style={styles.measuredValueLabel}>
                        Densidade Pré-Fervura:
                      </Text>
                      <Text style={styles.measuredValueText}>
                        {formatGravity(measuredValues.preBoilGravity)}
                      </Text>
                    </View>
                  )}
                  {measuredValues.preBoilVolume !== null && (
                    <View style={styles.measuredValueRow}>
                      <Text style={styles.measuredValueLabel}>
                        Volume Pré-Fervura:
                      </Text>
                      <Text style={styles.measuredValueText}>
                        {measuredValues.preBoilVolume} L
                      </Text>
                    </View>
                  )}
                  {measuredValues.postBoilGravity !== null && (
                    <View style={styles.measuredValueRow}>
                      <Text style={styles.measuredValueLabel}>
                        Densidade Pós-Fervura (OG):
                      </Text>
                      <Text style={styles.measuredValueText}>
                        {formatGravity(measuredValues.postBoilGravity)}
                      </Text>
                    </View>
                  )}
                  {measuredValues.mashPh !== null && (
                    <View style={styles.measuredValueRow}>
                      <Text style={styles.measuredValueLabel}>
                        pH da Mostura:
                      </Text>
                      <Text style={styles.measuredValueText}>
                        {measuredValues.mashPh.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.saveButtonContainer}>
                  <Button
                    variant="primary"
                    size="medium"
                    onPress={handleSaveBatchValues}
                    disabled={isSaving}
                    loading={isSaving}
                  >
                    {isSaving
                      ? 'Salvando...'
                      : 'Salvar Valores Medidos no Lote'}
                  </Button>
                  <Text style={styles.saveButtonHint}>
                    Salva os valores medidos durante a sessão no lote. O valor
                    de densidade pós-fervura será salvo como OG Real.
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.newBatchSection}>
              <Text style={styles.sectionTitle}>Nova Brassagem</Text>
              <Text style={styles.newBatchDescription}>
                Crie uma nova brassagem usando a mesma receita. Útil para
                repetir uma receita ou fazer ajustes.
              </Text>
              <Button
                variant="primary"
                size="medium"
                onPress={() => {
                  if (batch.recipe?.id) {
                    navigate(`/brewings/new?recipeId=${batch.recipe.id}`)
                  } else {
                    navigate('/brewings/new')
                  }
                }}
              >
                Nova Brassagem com Esta Receita
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.status.error,
    textAlign: 'center',
  },
  header: {
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  code: {
    fontSize: 15,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  phasesNav: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  phaseTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  phaseTabActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  phaseTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  phaseTabTextActive: {
    color: COLORS.neutral.white,
  },
  phaseContent: {
    gap: 24,
    paddingHorizontal: 24,
  },
  timerSection: {
    marginBottom: 8,
  },
  currentStepSection: {
    gap: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  currentStepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
  },
  stepNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 4,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    minWidth: 50,
    textAlign: 'center',
  },
  stepsList: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  ingredientsSection: {
    gap: 12,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    padding: 12,
    backgroundColor: COLORS.neutral.gray[50],
    borderRadius: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  hopScheduleSection: {
    gap: 12,
  },
  measuredValuesSection: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  fermentationSteps: {
    gap: 12,
  },
  fermentationStepCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 8,
  },
  fermentationStepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  fermentationStepDetails: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  resultCard: {
    minWidth: 150,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 8,
  },
  resultLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.brand.primary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  measuredValuesSummary: {
    marginTop: 24,
    gap: 16,
  },
  measuredValuesList: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 12,
  },
  measuredValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  measuredValueLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  measuredValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brand.primary,
  },
  saveButtonContainer: {
    gap: 8,
  },
  saveButtonHint: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  newBatchSection: {
    marginTop: 32,
    padding: 20,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 16,
  },
  newBatchDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  completeForm: {
    gap: 24,
    backgroundColor: COLORS.neutral.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formFieldHalf: {
    flex: 1,
  },
  completeButtonContainer: {
    marginTop: 24,
    gap: 8,
  },
  saveFinalValuesButton: {
    marginBottom: 4,
  },
  completeButtonHint: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  statisticsSection: {
    marginTop: 24,
    gap: 16,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statisticCard: {
    minWidth: 120,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 4,
  },
  statisticLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  statisticValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.brand.primary,
  },
  carbonationSection: {
    marginTop: 24,
    gap: 16,
  },
  carbonationCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 16,
  },
  carbonationText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  statusChangeSection: {
    marginTop: 24,
    gap: 12,
  },
  statusChangeButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
})
