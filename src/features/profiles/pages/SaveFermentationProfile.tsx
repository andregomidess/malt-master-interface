import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { DecimalInput } from '../../../shared/components/DecimalInput'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../recipes/components/Select'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiTrash } from 'react-icons/bi'
import { FermentationProfileType } from '../interfaces/FermentationProfile'
import { useSaveFermentationProfile } from '../hooks/useSaveFermentationProfile'
import { useFermentationProfileById } from '../hooks/useFermentationProfiles'
import {
  FermentationProfileInput,
  FermentationStepInput,
} from '../api/fermentationProfilesApi'

const fermentationTypeLabels: Record<FermentationProfileType, string> = {
  [FermentationProfileType.PRIMARY]: 'Primária',
  [FermentationProfileType.SECONDARY]: 'Secundária',
  [FermentationProfileType.LAGERING]: 'Lagering',
  [FermentationProfileType.CONDITIONING]: 'Condicionamento',
  [FermentationProfileType.BOTTLE_CONDITIONING]: 'Condicionamento em Garrafa',
  [FermentationProfileType.KEG_CONDITIONING]: 'Condicionamento em Keg',
}

const stepSchema = z.object({
  stepOrder: z.number().min(1),
  name: z.string().min(1, 'Nome da etapa é obrigatório'),
  temperature: z
    .number({ required_error: 'Temperatura é obrigatória' })
    .min(0, 'Mínimo 0°C')
    .max(35, 'Máximo 35°C'),
  duration: z
    .number({ required_error: 'Duração é obrigatória' })
    .min(1, 'Mínimo 1 dia'),
  targetGravity: z.number().min(1.0).max(1.1).nullable().optional(),
  pressureControl: z.number().min(0).max(30).nullable().optional(),
  isRamping: z.boolean(),
  rampTime: z.number().min(0).nullable().optional(),
  rampToTemperature: z.number().min(0).max(35).nullable().optional(),
  description: z.string().nullable().optional(),
})

const fermentationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(FermentationProfileType, {
    required_error: 'Selecione o tipo de fermentação',
  }),
  yeastStrain: z.string().nullable().optional(),
  targetFinalGravity: z
    .number()
    .min(1.0, 'Mínimo 1.0')
    .max(1.1, 'Máximo 1.1')
    .nullable()
    .optional(),
  estimatedAttenuation: z
    .number()
    .min(50, 'Mínimo 50%')
    .max(95, 'Máximo 95%')
    .nullable()
    .optional(),
  isMultiStage: z.boolean(),
  observations: z.string().nullable().optional(),
  isPublic: z.boolean(),
  steps: z.array(stepSchema).min(1, 'Adicione pelo menos uma etapa'),
})

export type FormData = z.infer<typeof fermentationSchema>

const toNumber = (value: string | number | null | undefined): number | null => {
  if (value == null) return null
  if (typeof value === 'number') return isNaN(value) ? null : value
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
}

const toNumberRequired = (
  value: string | number | null | undefined,
  fallback: number,
): number => {
  if (value == null) return fallback
  if (typeof value === 'number') return isNaN(value) ? fallback : value
  const parsed = parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}

export const SaveFermentationProfile = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const baseId = searchParams.get('base')
  const isEditMode = !!id

  const { mutate: saveProfile, isPending: isSaving } =
    useSaveFermentationProfile()

  const { data: existingProfile, isLoading: isLoadingProfile } =
    useFermentationProfileById(id || baseId || undefined)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(fermentationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: FermentationProfileType.PRIMARY,
      yeastStrain: null,
      targetFinalGravity: null,
      estimatedAttenuation: null,
      isMultiStage: false,
      observations: null,
      isPublic: false,
      steps: [
        {
          stepOrder: 1,
          name: 'Fermentação Primária',
          temperature: 20,
          duration: 7,
          targetGravity: null,
          pressureControl: null,
          isRamping: false,
          rampTime: null,
          rampToTemperature: null,
          description: null,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  })

  useEffect(() => {
    if (existingProfile) {
      const steps = existingProfile.steps.map((step, index) => ({
        stepOrder: step.stepOrder || index + 1,
        name: step.name || `Etapa ${index + 1}`,
        temperature: toNumberRequired(step.temperature, 20),
        duration: toNumberRequired(step.duration, 7),
        targetGravity: toNumber(step.targetGravity),
        pressureControl: toNumber(step.pressureControl),
        isRamping: step.isRamping || false,
        rampTime: toNumber(step.rampTime),
        rampToTemperature: toNumber(step.rampToTemperature),
        description: step.description || null,
      }))

      reset({
        name: baseId ? '' : existingProfile.name,
        type: existingProfile.type,
        yeastStrain: existingProfile.yeastStrain,
        targetFinalGravity: toNumber(existingProfile.targetFinalGravity),
        estimatedAttenuation: toNumber(existingProfile.estimatedAttenuation),
        isMultiStage: existingProfile.isMultiStage,
        observations: existingProfile.observations,
        isPublic: baseId ? false : existingProfile.isPublic,
        steps,
      })
    }
  }, [existingProfile, reset, baseId])

  const fermentationTypeOptions = useMemo(
    () =>
      Object.values(FermentationProfileType).map(type => ({
        value: type,
        label: fermentationTypeLabels[type],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    const steps: FermentationStepInput[] = data.steps.map((step, index) => ({
      stepOrder: index + 1,
      name: step.name,
      temperature: step.temperature,
      duration: step.duration,
      targetGravity: step.targetGravity || null,
      pressureControl: step.pressureControl || null,
      isRamping: step.isRamping,
      rampTime: step.rampTime || null,
      rampToTemperature: step.rampToTemperature || null,
      description: step.description || null,
    }))

    const profileInput: FermentationProfileInput = {
      ...(isEditMode && id && { id }),
      name: data.name,
      type: data.type,
      yeastStrain: data.yeastStrain || null,
      targetFinalGravity: data.targetFinalGravity || null,
      estimatedAttenuation: data.estimatedAttenuation || null,
      isMultiStage: data.isMultiStage,
      observations: data.observations || null,
      isPublic: data.isPublic,
      steps,
    }

    saveProfile(profileInput)
    navigate('/fermentation-profiles')
  }

  const handleCancel = () => {
    navigate('/fermentation-profiles')
  }

  const addStep = () => {
    append({
      stepOrder: fields.length + 1,
      name: `Etapa ${fields.length + 1}`,
      temperature: 20,
      duration: 7,
      targetGravity: null,
      pressureControl: null,
      isRamping: false,
      rampTime: null,
      rampToTemperature: null,
      description: null,
    })
  }

  if ((isEditMode || baseId) && isLoadingProfile) {
    return (
      <Layout activeMenuItem="fermentation-profiles">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="profiles">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode
              ? 'Editar Perfil de Fermentação'
              : 'Adicionar Perfil de Fermentação'}
          </Heading>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Nome *"
                  placeholder="Ex: Fermentação Ale Padrão"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Tipo de Fermentação *"
                  placeholder="Selecione o tipo"
                  value={value}
                  options={fermentationTypeOptions}
                  onSelect={onChange}
                  error={!!errors.type}
                  errorMessage={errors.type?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="yeastStrain"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Cepa de Levedura"
                  placeholder="Ex: Safale US-05"
                  value={value || ''}
                  onChangeText={value => onChange(value || null)}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="targetFinalGravity"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Gravidade Final Alvo"
                  placeholder="Ex: 1.010"
                  value={value}
                  onChange={val => onChange(val ?? null)}
                  error={!!errors.targetFinalGravity}
                  errorMessage={errors.targetFinalGravity?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="estimatedAttenuation"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Atenuação Estimada (%)"
                  placeholder="Ex: 75"
                  value={value}
                  onChange={val => onChange(val ?? null)}
                  error={!!errors.estimatedAttenuation}
                  errorMessage={errors.estimatedAttenuation?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="isMultiStage"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Multi-estágio"
                  placeholder="Selecione"
                  value={value ? 'true' : 'false'}
                  options={[
                    { value: 'true', label: 'Sim' },
                    { value: 'false', label: 'Não' },
                  ]}
                  onSelect={val => onChange(val === 'true')}
                />
              )}
            />
          </View>

          <View style={styles.stepsSection}>
            <View style={styles.stepsHeader}>
              <Text style={styles.stepsTitle}>Etapas de Fermentação *</Text>
              <TouchableOpacity style={styles.addStepButton} onPress={addStep}>
                <BiPlus size={16} color={COLORS.brand.primary} />
                <Text style={styles.addStepText}>Adicionar Etapa</Text>
              </TouchableOpacity>
            </View>

            {errors.steps && (
              <Text style={styles.errorText}>{errors.steps.message}</Text>
            )}

            {fields.map((field, index) => (
              <View key={field.id} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>Etapa {index + 1}</Text>
                  {fields.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeStepButton}
                      onPress={() => remove(index)}
                    >
                      <BiTrash size={16} color={COLORS.status.error} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.stepFields}>
                  <View style={styles.stepField}>
                    <Controller
                      control={control}
                      name={`steps.${index}.name`}
                      render={({ field: { value, onChange } }) => (
                        <InputText
                          label="Nome da Etapa *"
                          placeholder="Ex: Fermentação Primária"
                          value={value}
                          onChangeText={onChange}
                          error={!!errors.steps?.[index]?.name}
                          errorMessage={errors.steps?.[index]?.name?.message}
                        />
                      )}
                    />
                  </View>

                  <View style={styles.stepFieldRow}>
                    <View style={styles.stepFieldHalf}>
                      <Controller
                        control={control}
                        name={`steps.${index}.temperature`}
                        render={({ field: { value, onChange } }) => (
                          <DecimalInput
                            label="Temperatura (°C) *"
                            placeholder="Ex: 20"
                            value={value ?? 20}
                            onChange={val => onChange(val ?? 20)}
                            error={!!errors.steps?.[index]?.temperature}
                            errorMessage={
                              errors.steps?.[index]?.temperature?.message
                            }
                          />
                        )}
                      />
                    </View>

                    <View style={styles.stepFieldHalf}>
                      <Controller
                        control={control}
                        name={`steps.${index}.duration`}
                        render={({ field: { value, onChange } }) => (
                          <DecimalInput
                            label="Duração (dias) *"
                            placeholder="Ex: 7"
                            value={value ?? 7}
                            onChange={val => onChange(val ?? 7)}
                            error={!!errors.steps?.[index]?.duration}
                            errorMessage={
                              errors.steps?.[index]?.duration?.message
                            }
                          />
                        )}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="observations"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Observações"
                  placeholder="Observações adicionais..."
                  value={value || ''}
                  onChangeText={value => onChange(value || null)}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="isPublic"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Perfil Público"
                  placeholder="Selecione"
                  value={value ? 'true' : 'false'}
                  options={[
                    { value: 'true', label: 'Sim' },
                    { value: 'false', label: 'Não' },
                  ]}
                  onSelect={val => onChange(val === 'true')}
                />
              )}
            />
          </View>

          <View style={styles.actions}>
            <Button variant="ghost" size="medium" onPress={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="medium"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isSaving}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  form: {
    gap: 16,
  },
  section: {
    marginBottom: 8,
  },
  stepsSection: {
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.neutral.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  addStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.brand.primary,
  },
  addStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand.primary,
  },
  stepCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  removeStepButton: {
    padding: 4,
  },
  stepFields: {
    gap: 12,
  },
  stepField: {
    marginBottom: 8,
  },
  stepFieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepFieldHalf: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.status.error,
    marginBottom: 8,
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
