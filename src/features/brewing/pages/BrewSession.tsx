import React, { useState, useMemo, useEffect } from 'react'
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
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import toast from 'react-hot-toast'

type PhaseType = 'planning' | 'mash' | 'fermenting' | 'completed'

interface BrewSessionProps {
  batchId: string
}

export function BrewSession({ batchId }: BrewSessionProps) {
  const { detail, loading, error } = useBatchDetail(batchId)
  const [activePhase, setActivePhase] = useState<PhaseType>('mash')
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [measuredValues, setMeasuredValues] = useState({
    preBoilGravity: null as number | null,
    preBoilVolume: null as number | null,
    postBoilGravity: null as number | null,
    mashPh: null as number | null,
  })

  // Carregar estado do localStorage (persistência local)
  useEffect(() => {
    const saved = localStorage.getItem(`brew_session_${batchId}`)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCompletedSteps(new Set(data.completedSteps || []))
        if (data.measuredValues) {
          setMeasuredValues(data.measuredValues)
        }
        setActiveStepIndex(data.activeStepIndex || 0)
      } catch {
        // Ignorar erros de parse
      }
    }
  }, [batchId])

  // Salvar estado no localStorage
  useEffect(() => {
    const data = {
      completedSteps: Array.from(completedSteps),
      measuredValues,
      activeStepIndex,
    }
    localStorage.setItem(`brew_session_${batchId}`, JSON.stringify(data))
  }, [completedSteps, measuredValues, activeStepIndex, batchId])

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
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
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

  const phases: Array<{ key: PhaseType; label: string }> = [
    { key: 'planning', label: 'Planejamento' },
    { key: 'mash', label: 'Brassagem' },
    { key: 'fermenting', label: 'Fermentando' },
    { key: 'completed', label: 'Concluído' },
  ]

  // Preparar ingredientes para exibição (vazio por enquanto)
  const mashIngredients: string[] = []

  return (
    <Layout activeMenuItem="brewings">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Heading variant="h3" style={styles.title}>
                {batch.name || batch.recipe?.name}
              </Heading>
              <Text style={styles.code}>{batch.batchCode || '—'}</Text>
            </View>
            <BatchStatusBadge status={batch.status} />
          </View>

          {/* Fases de Navegação */}
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

        {/* Conteúdo da Fase Ativa */}
        {activePhase === 'mash' && (
          <View style={styles.phaseContent}>
            {/* Timer do Passo Atual */}
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

            {/* Passo Atual */}
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

            {/* Lista de Passos Completos */}
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

            {/* Ingredientes para Mostura */}
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

            {/* Cronograma de Lúpulos */}
            {hopSchedule.length > 0 && (
              <View style={styles.hopScheduleSection}>
                <Text style={styles.sectionTitle}>Cronograma de Lúpulos</Text>
                <HopSchedule hops={hopSchedule} />
              </View>
            )}

            {/* Valores Mensurados */}
            <View style={styles.measuredValuesSection}>
              <MeasuredValuesPanel
                values={[
                  {
                    id: 'preBoilGravity',
                    label: 'Densidade Pré Fervura',
                    value: measuredValues.preBoilGravity,
                    unit: 'SG',
                  },
                  {
                    id: 'preBoilVolume',
                    label: 'Volume da Fervura',
                    value: measuredValues.preBoilVolume,
                    unit: 'L',
                  },
                  {
                    id: 'postBoilGravity',
                    label: 'Densidade Pós Fervura',
                    value: measuredValues.postBoilGravity,
                    unit: 'SG',
                  },
                  {
                    id: 'mashPh',
                    label: 'pH da Mostura',
                    value: measuredValues.mashPh,
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
                  {batch.recipe?.styleName || '—'}
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
          </View>
        )}

        {activePhase === 'completed' && (
          <View style={styles.phaseContent}>
            <Text style={styles.sectionTitle}>Resultados Finais</Text>
            <View style={styles.resultsGrid}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>OG Real</Text>
                <Text style={styles.resultValue}>
                  {batch.actualOriginalGravity?.toFixed(3) || '—'}
                </Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>FG Real</Text>
                <Text style={styles.resultValue}>
                  {batch.actualFinalGravity?.toFixed(3) || '—'}
                </Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>ABV</Text>
                <Text style={styles.resultValue}>
                  {batch.actualAbv ? `${batch.actualAbv}%` : '—'}
                </Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Eficiência</Text>
                <Text style={styles.resultValue}>
                  {batch.actualEfficiency ? `${batch.actualEfficiency}%` : '—'}
                </Text>
              </View>
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
})
