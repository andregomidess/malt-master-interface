import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { DecimalInput } from '../../../shared/components/DecimalInput'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../recipes/components/Select'
import { COLORS } from '../../../shared/styles/colors'
import {
  CarbonationType,
  PrimingSugarType,
} from '../interfaces/CarbonationProfile'
import { useSaveCarbonationProfile } from '../hooks/useSaveCarbonationProfile'
import { useCarbonationProfileById } from '../hooks/useCarbonationProfiles'
import { CarbonationProfileInput } from '../api/carbonationProfilesApi'

const carbonationTypeLabels: Record<CarbonationType, string> = {
  [CarbonationType.NATURAL_PRIMING]: 'Priming Natural',
  [CarbonationType.FORCED_CO2]: 'CO2 Forçado',
  [CarbonationType.BOTTLE_CONDITIONING]: 'Condicionamento em Garrafa',
}

const primingSugarTypeLabels: Record<PrimingSugarType, string> = {
  [PrimingSugarType.TABLE_SUGAR]: 'Açúcar de Mesa',
  [PrimingSugarType.CORN_SUGAR]: 'Açúcar de Milho',
  [PrimingSugarType.DME]: 'DME',
  [PrimingSugarType.HONEY]: 'Mel',
  [PrimingSugarType.MAPLE_SYRUP]: 'Xarope de Bordo',
}

const carbonationSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    type: z.nativeEnum(CarbonationType, {
      required_error: 'Selecione o tipo de carbonatação',
    }),
    targetCO2Volumes: z
      .number({ required_error: 'Volumes de CO₂ são obrigatórios' })
      .min(1.0, 'Mínimo 1.0 volume')
      .max(5.0, 'Máximo 5.0 volumes'),
    servingTemperature: z
      .number({ required_error: 'Temperatura de serviço é obrigatória' })
      .min(0, 'Mínimo 0°C')
      .max(15, 'Máximo 15°C'),
    primingSugarType: z.nativeEnum(PrimingSugarType).nullable().optional(),
    primingSugarAmount: z
      .number()
      .min(3, 'Mínimo 3g/L')
      .max(10, 'Máximo 10g/L')
      .nullable()
      .optional(),
    kegPressure: z
      .number()
      .min(5, 'Mínimo 5 PSI')
      .max(30, 'Máximo 30 PSI')
      .nullable()
      .optional(),
    carbonationTime: z.number().min(1, 'Mínimo 1 dia').nullable().optional(),
    carbonationMethod: z.string().nullable().optional(),
    observations: z.string().nullable().optional(),
    isPublic: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.type === CarbonationType.NATURAL_PRIMING) {
      if (!data.primingSugarType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tipo de açúcar é obrigatório para priming natural',
          path: ['primingSugarType'],
        })
      }
      if (!data.primingSugarAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Quantidade de açúcar é obrigatória para priming natural',
          path: ['primingSugarAmount'],
        })
      }
    }
    if (data.type === CarbonationType.FORCED_CO2) {
      if (!data.kegPressure) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pressão do keg é obrigatória para CO2 forçado',
          path: ['kegPressure'],
        })
      }
    }
  })

export type FormData = z.infer<typeof carbonationSchema>

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

export const SaveCarbonationProfile = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const baseId = searchParams.get('base')
  const isEditMode = !!id

  const { mutate: saveProfile, isPending: isSaving } =
    useSaveCarbonationProfile()

  const { data: existingProfile, isLoading: isLoadingProfile } =
    useCarbonationProfileById(id || baseId || undefined)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(carbonationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: CarbonationType.NATURAL_PRIMING,
      targetCO2Volumes: 2.5,
      servingTemperature: 4,
      primingSugarType: null,
      primingSugarAmount: null,
      kegPressure: null,
      carbonationTime: null,
      carbonationMethod: null,
      observations: null,
      isPublic: false,
    },
  })

  const carbonationType = watch('type')

  useEffect(() => {
    if (existingProfile) {
      reset({
        name: baseId ? '' : existingProfile.name,
        type: existingProfile.type,
        targetCO2Volumes: toNumberRequired(
          existingProfile.targetCO2Volumes,
          2.5,
        ),
        servingTemperature: toNumberRequired(
          existingProfile.servingTemperature,
          4,
        ),
        primingSugarType: existingProfile.primingSugarType,
        primingSugarAmount: toNumber(existingProfile.primingSugarAmount),
        kegPressure: toNumber(existingProfile.kegPressure),
        carbonationTime: toNumber(existingProfile.carbonationTime),
        carbonationMethod: existingProfile.carbonationMethod,
        observations: existingProfile.observations,
        isPublic: baseId ? false : existingProfile.isPublic,
      })
    }
  }, [existingProfile, reset, baseId])

  const carbonationTypeOptions = useMemo(
    () =>
      Object.values(CarbonationType).map(type => ({
        value: type,
        label: carbonationTypeLabels[type],
      })),
    [],
  )

  const primingSugarTypeOptions = useMemo(
    () =>
      Object.values(PrimingSugarType).map(type => ({
        value: type,
        label: primingSugarTypeLabels[type],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    const profileInput: CarbonationProfileInput = {
      ...(isEditMode && id && { id }),
      name: data.name,
      type: data.type,
      targetCO2Volumes: data.targetCO2Volumes,
      servingTemperature: data.servingTemperature,
      primingSugarType: data.primingSugarType || null,
      primingSugarAmount: data.primingSugarAmount || null,
      kegPressure: data.kegPressure || null,
      carbonationTime: data.carbonationTime || null,
      carbonationMethod: data.carbonationMethod || null,
      observations: data.observations || null,
      isPublic: data.isPublic,
    }

    saveProfile(profileInput)
    navigate('/carbonation-profiles')
  }

  const handleCancel = () => {
    navigate('/carbonation-profiles')
  }

  if ((isEditMode || baseId) && isLoadingProfile) {
    return (
      <Layout activeMenuItem="carbonation-profiles">
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
              ? 'Editar Perfil de Carbonatação'
              : 'Adicionar Perfil de Carbonatação'}
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
                  placeholder="Ex: Carbonatação Ale Padrão"
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
                  label="Tipo de Carbonatação *"
                  placeholder="Selecione o tipo"
                  value={value}
                  options={carbonationTypeOptions}
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
              name="targetCO2Volumes"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Volumes de CO₂ *"
                  placeholder="Ex: 2.5"
                  value={value}
                  onChange={onChange}
                  error={!!errors.targetCO2Volumes}
                  errorMessage={errors.targetCO2Volumes?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="servingTemperature"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Temperatura de Serviço (°C) *"
                  placeholder="Ex: 4"
                  value={value}
                  onChange={onChange}
                  error={!!errors.servingTemperature}
                  errorMessage={errors.servingTemperature?.message}
                />
              )}
            />
          </View>

          {carbonationType === CarbonationType.NATURAL_PRIMING && (
            <>
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="primingSugarType"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Tipo de Açúcar *"
                      placeholder="Selecione o tipo"
                      value={value || ''}
                      options={primingSugarTypeOptions}
                      onSelect={onChange}
                      error={!!errors.primingSugarType}
                      errorMessage={errors.primingSugarType?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="primingSugarAmount"
                  render={({ field: { value, onChange } }) => (
                    <DecimalInput
                      label="Quantidade de Açúcar (g/L) *"
                      placeholder="Ex: 5.5"
                      value={value}
                      onChange={val => onChange(val ?? null)}
                      error={!!errors.primingSugarAmount}
                      errorMessage={errors.primingSugarAmount?.message}
                    />
                  )}
                />
              </View>
            </>
          )}

          {carbonationType === CarbonationType.FORCED_CO2 && (
            <View style={styles.section}>
              <Controller
                control={control}
                name="kegPressure"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Pressão do Keg (PSI) *"
                    placeholder="Ex: 12"
                    value={value}
                    onChange={val => onChange(val ?? null)}
                    error={!!errors.kegPressure}
                    errorMessage={errors.kegPressure?.message}
                  />
                )}
              />
            </View>
          )}

          <View style={styles.section}>
            <Controller
              control={control}
              name="carbonationTime"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Tempo de Carbonatação (dias)"
                  placeholder="Ex: 14"
                  value={value}
                  onChange={val => onChange(val ?? null)}
                  error={!!errors.carbonationTime}
                  errorMessage={errors.carbonationTime?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="carbonationMethod"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Método de Carbonatação"
                  placeholder="Descreva o método..."
                  value={value || ''}
                  onChangeText={value => onChange(value || null)}
                  multiline
                  numberOfLines={3}
                />
              )}
            />
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
