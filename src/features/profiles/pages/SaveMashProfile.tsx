import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigate, useParams } from 'react-router'
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
import { MashProfileType, MashStepType } from '../interfaces/MashProfile'
import { useSaveMashProfile } from '../hooks/useSaveMashProfile'
import { useMashProfileById } from '../hooks/useMashProfiles'
import { MashProfileInput, MashStepInput } from '../api/mashProfilesApi'

const mashTypeLabels: Record<MashProfileType, string> = {
  [MashProfileType.INFUSION]: 'Infusão',
  [MashProfileType.DECOCTION]: 'Decocção',
  [MashProfileType.STEP_MASH]: 'Step Mash',
  [MashProfileType.BIAB]: 'BIAB',
}

const mashStepTypeLabels: Record<MashStepType, string> = {
  [MashStepType.INFUSION]: 'Infusão',
  [MashStepType.TEMPERATURE]: 'Temperatura',
  [MashStepType.DECOCTION]: 'Decocção',
}

const stepSchema = z.object({
  stepOrder: z.number().min(1),
  name: z.string().min(1, 'Nome da etapa é obrigatório'),
  stepType: z.nativeEnum(MashStepType, {
    required_error: 'Tipo da etapa é obrigatório',
  }),
  temperature: z
    .number({ required_error: 'Temperatura é obrigatória' })
    .min(35, 'Mínimo 35°C')
    .max(80, 'Máximo 80°C'),
  duration: z
    .number({ required_error: 'Duração é obrigatória' })
    .min(1, 'Mínimo 1 minuto'),
  infusionAmount: z.number().min(0).nullable().optional(),
  infusionTemp: z.number().min(0).max(100).nullable().optional(),
  decoctionAmount: z.number().min(0).nullable().optional(),
  rampTime: z.number().min(0).nullable().optional(),
  description: z.string().nullable().optional(),
})

const mashSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(MashProfileType, {
    required_error: 'Selecione o tipo de mostura',
  }),
  estimatedEfficiency: z
    .number()
    .min(50, 'Mínimo 50%')
    .max(95, 'Máximo 95%')
    .nullable()
    .optional(),
  grainTemperature: z
    .number({ required_error: 'Temperatura dos grãos é obrigatória' })
    .min(10, 'Mínimo 10°C')
    .max(30, 'Máximo 30°C'),
  tunTemperature: z
    .number({ required_error: 'Temperatura do tun é obrigatória' })
    .min(10, 'Mínimo 10°C')
    .max(30, 'Máximo 30°C'),
  spargeTemperature: z
    .number({ required_error: 'Temperatura de sparge é obrigatória' })
    .min(75, 'Mínimo 75°C')
    .max(80, 'Máximo 80°C'),
  tunWeight: z.number().min(0).nullable().optional(),
  tunSpecificHeat: z
    .number({ required_error: 'Calor específico do tun é obrigatório' })
    .min(0.1, 'Mínimo 0.1')
    .max(0.5, 'Máximo 0.5'),
  mashThickness: z
    .number({ required_error: 'Espessura do mash é obrigatória' })
    .min(2.0, 'Mínimo 2.0 L/kg')
    .max(5.0, 'Máximo 5.0 L/kg'),
  observations: z.string().nullable().optional(),
  isPublic: z.boolean(),
  steps: z.array(stepSchema).min(1, 'Adicione pelo menos uma etapa'),
})

export type FormData = z.infer<typeof mashSchema>

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
  if (typeof value === 'number') {
    if (isNaN(value)) return fallback
    // Se o valor for 0 e o fallback não for 0, pode ser que o valor não foi definido
    // Mas vamos manter o valor 0 se for um número válido
    return value
  }
  const parsed = parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}

export const SaveMashProfile = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const { mutate: saveProfile, isPending: isSaving } = useSaveMashProfile()

  const { data: existingProfile, isLoading: isLoadingProfile } =
    useMashProfileById(id)

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(mashSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      type: MashProfileType.INFUSION,
      estimatedEfficiency: null,
      grainTemperature: 20,
      tunTemperature: 20,
      spargeTemperature: 77,
      tunWeight: null,
      tunSpecificHeat: 0.3,
      mashThickness: 3.0,
      observations: null,
      isPublic: false,
      steps: [
        {
          stepOrder: 1,
          name: 'Saccharification',
          stepType: MashStepType.TEMPERATURE,
          temperature: 65,
          duration: 60,
          infusionAmount: null,
          infusionTemp: null,
          decoctionAmount: null,
          rampTime: null,
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
        stepType: step.stepType,
        temperature: toNumberRequired(step.temperature, 65),
        duration: toNumberRequired(step.duration, 60),
        infusionAmount: toNumber(step.infusionAmount),
        infusionTemp: toNumber(step.infusionTemp),
        decoctionAmount: toNumber(step.decoctionAmount),
        rampTime: toNumber(step.rampTime),
        description: step.description || null,
      }))

      reset({
        name: existingProfile.name,
        type: existingProfile.type,
        estimatedEfficiency: toNumber(existingProfile.estimatedEfficiency),
        grainTemperature: toNumberRequired(
          existingProfile.grainTemperature,
          20,
        ),
        tunTemperature: toNumberRequired(existingProfile.tunTemperature, 20),
        spargeTemperature: toNumberRequired(
          existingProfile.spargeTemperature,
          77,
        ),
        tunWeight: toNumber(existingProfile.tunWeight),
        tunSpecificHeat: toNumberRequired(existingProfile.tunSpecificHeat, 0.3),
        mashThickness: toNumberRequired(existingProfile.mashThickness, 3.0),
        observations: existingProfile.observations,
        isPublic: existingProfile.isPublic,
        steps,
      })
      // Força validação após reset
      setTimeout(() => {
        trigger()
      }, 100)
    }
  }, [existingProfile, reset, trigger])

  const mashTypeOptions = useMemo(
    () =>
      Object.values(MashProfileType).map(type => ({
        value: type,
        label: mashTypeLabels[type],
      })),
    [],
  )

  const mashStepTypeOptions = useMemo(
    () =>
      Object.values(MashStepType).map(type => ({
        value: type,
        label: mashStepTypeLabels[type],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    const steps: MashStepInput[] = data.steps.map((step, index) => ({
      stepOrder: index + 1,
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

    const profileInput: MashProfileInput = {
      ...(isEditMode && id && { id }),
      name: data.name,
      type: data.type,
      estimatedEfficiency: data.estimatedEfficiency || null,
      grainTemperature: data.grainTemperature,
      tunTemperature: data.tunTemperature,
      spargeTemperature: data.spargeTemperature,
      tunWeight: data.tunWeight || null,
      tunSpecificHeat: data.tunSpecificHeat,
      mashThickness: data.mashThickness,
      observations: data.observations || null,
      isPublic: data.isPublic,
      steps,
    }

    saveProfile(profileInput)
    navigate('/mash-profiles')
  }

  const handleCancel = () => {
    navigate('/mash-profiles')
  }

  const addStep = () => {
    append({
      stepOrder: fields.length + 1,
      name: `Etapa ${fields.length + 1}`,
      stepType: MashStepType.TEMPERATURE,
      temperature: 65,
      duration: 60,
      infusionAmount: null,
      infusionTemp: null,
      decoctionAmount: null,
      rampTime: null,
      description: null,
    })
  }

  if (isEditMode && isLoadingProfile) {
    return (
      <Layout activeMenuItem="mash-profiles">
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
              ? 'Editar Perfil de Mostura'
              : 'Adicionar Perfil de Mostura'}
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
                  placeholder="Ex: Mostura Ale Padrão"
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
                  label="Tipo de Mostura *"
                  placeholder="Selecione o tipo"
                  value={value}
                  options={mashTypeOptions}
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
              name="estimatedEfficiency"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Eficiência Estimada (%)"
                  placeholder="Ex: 75"
                  value={value}
                  onChange={val => onChange(val ?? null)}
                />
              )}
            />
          </View>

          <View style={styles.temperatureRow}>
            <View style={styles.tempField}>
              <Controller
                control={control}
                name="grainTemperature"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Temp. Grãos (°C) *"
                    placeholder="Ex: 20"
                    value={value}
                    onChange={onChange}
                    error={!!errors.grainTemperature}
                    errorMessage={errors.grainTemperature?.message}
                  />
                )}
              />
            </View>

            <View style={styles.tempField}>
              <Controller
                control={control}
                name="tunTemperature"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Temp. Tun (°C) *"
                    placeholder="Ex: 20"
                    value={value}
                    onChange={onChange}
                    error={!!errors.tunTemperature}
                    errorMessage={errors.tunTemperature?.message}
                  />
                )}
              />
            </View>

            <View style={styles.tempField}>
              <Controller
                control={control}
                name="spargeTemperature"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Temp. Sparge (°C) *"
                    placeholder="Ex: 77"
                    value={value}
                    onChange={onChange}
                    error={!!errors.spargeTemperature}
                    errorMessage={errors.spargeTemperature?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="tunWeight"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Peso do Tun (kg)"
                  placeholder="Ex: 5.0"
                  value={value}
                  onChange={val => onChange(val ?? null)}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="tunSpecificHeat"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Calor Específico do Tun *"
                  placeholder="Ex: 0.3"
                  value={value}
                  onChange={onChange}
                  error={!!errors.tunSpecificHeat}
                  errorMessage={errors.tunSpecificHeat?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="mashThickness"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Espessura do Mash (L/kg) *"
                  placeholder="Ex: 3.0"
                  value={value}
                  onChange={onChange}
                  error={!!errors.mashThickness}
                  errorMessage={errors.mashThickness?.message}
                />
              )}
            />
          </View>

          <View style={styles.stepsSection}>
            <View style={styles.stepsHeader}>
              <Text style={styles.stepsTitle}>Etapas de Mostura *</Text>
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
                          placeholder="Ex: Saccharification"
                          value={value}
                          onChangeText={onChange}
                          error={!!errors.steps?.[index]?.name}
                          errorMessage={errors.steps?.[index]?.name?.message}
                        />
                      )}
                    />
                  </View>

                  <View style={styles.stepField}>
                    <Controller
                      control={control}
                      name={`steps.${index}.stepType`}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label="Tipo da Etapa *"
                          placeholder="Selecione o tipo"
                          value={value}
                          options={mashStepTypeOptions}
                          onSelect={onChange}
                          error={!!errors.steps?.[index]?.stepType}
                          errorMessage={
                            errors.steps?.[index]?.stepType?.message
                          }
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
                            placeholder="Ex: 65"
                            value={value}
                            onChange={onChange}
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
                            label="Duração (min) *"
                            placeholder="Ex: 60"
                            value={value}
                            onChange={onChange}
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
  temperatureRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  tempField: {
    flex: 1,
    minWidth: 150,
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
