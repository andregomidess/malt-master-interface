import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigate, useParams } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../recipes/components/Select'
import { COLORS } from '../../../shared/styles/colors'
import {
  EquipmentType,
  EquipmentMaterial,
  HeatingSource,
  CoolingType,
  ChillerType,
  EquipmentInput,
  materialLabels,
  heatingSourceLabels,
  coolingTypeLabels,
  chillerTypeLabels,
} from '../interfaces/equipment'
import { useSaveEquipment } from '../hooks/useSaveEquipment'
import { useEquipmentById } from '../hooks/useEquipmentById'

const equipmentSchema = z
  .object({
    type: z.nativeEnum(EquipmentType).optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    material: z.nativeEnum(EquipmentMaterial).optional(),
    totalCapacity: z.number().optional(),
    usableVolume: z.number().optional(),
    kettleLoss: z.number().optional(),
    evaporationRate: z.number().optional(),
    boilOffRate: z.number().optional(),
    heatingPower: z.number().optional(),
    heatingSource: z.nativeEnum(HeatingSource).optional(),
    fermenterLoss: z.number().optional(),
    coneBottomVolume: z.number().optional(),
    hasTemperatureControl: z.boolean().optional(),
    maxPressure: z.number().optional(),
    coolingType: z.nativeEnum(CoolingType).optional(),
    minTemperature: z.number().optional(),
    maxTemperature: z.number().optional(),
    coolingCapacity: z.number().optional(),
    flowRate: z.number().optional(),
    inletTemperature: z.number().optional(),
    outletTemperature: z.number().optional(),
    chillerType: z.nativeEnum(ChillerType).optional(),
    tubeLength: z.number().optional(),
    tubeDiameter: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o tipo de equipamento',
        path: ['type'],
      })
      return
    }

    if (!data.name || data.name.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome é obrigatório',
        path: ['name'],
      })
    }

    if (!data.material) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o material',
        path: ['material'],
      })
    }

    if (!data.totalCapacity || data.totalCapacity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Capacidade total deve ser maior que zero',
        path: ['totalCapacity'],
      })
    }

    if (!data.usableVolume || data.usableVolume <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Volume utilizável deve ser maior que zero',
        path: ['usableVolume'],
      })
    }

    if (data.type === EquipmentType.KETTLE) {
      if (!data.kettleLoss || data.kettleLoss <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Perda na panela deve ser maior que zero',
          path: ['kettleLoss'],
        })
      }
      if (!data.evaporationRate || data.evaporationRate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Taxa de evaporação deve ser maior que zero',
          path: ['evaporationRate'],
        })
      }
      if (!data.boilOffRate || data.boilOffRate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Taxa de boil off deve ser maior que zero',
          path: ['boilOffRate'],
        })
      }
      if (!data.heatingPower || data.heatingPower <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Potência de aquecimento deve ser maior que zero',
          path: ['heatingPower'],
        })
      }
      if (!data.heatingSource) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione a fonte de aquecimento',
          path: ['heatingSource'],
        })
      }
    }

    if (data.type === EquipmentType.FERMENTER) {
      if (!data.fermenterLoss || data.fermenterLoss <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Perda no fermentador deve ser maior que zero',
          path: ['fermenterLoss'],
        })
      }
      if (!data.coneBottomVolume || data.coneBottomVolume <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Volume do fundo cônico deve ser maior que zero',
          path: ['coneBottomVolume'],
        })
      }
      if (data.hasTemperatureControl === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione se tem controle de temperatura',
          path: ['hasTemperatureControl'],
        })
      }
      if (!data.maxPressure || data.maxPressure <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pressão máxima deve ser maior que zero',
          path: ['maxPressure'],
        })
      }
      if (!data.coolingType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o tipo de resfriamento',
          path: ['coolingType'],
        })
      }
      if (data.minTemperature === undefined || data.minTemperature === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Temperatura mínima é obrigatória',
          path: ['minTemperature'],
        })
      }
      if (data.maxTemperature === undefined || data.maxTemperature === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Temperatura máxima é obrigatória',
          path: ['maxTemperature'],
        })
      }
    }

    if (data.type === EquipmentType.CHILLER) {
      if (!data.coolingCapacity || data.coolingCapacity <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Capacidade de resfriamento deve ser maior que zero',
          path: ['coolingCapacity'],
        })
      }
      if (!data.flowRate || data.flowRate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Taxa de fluxo deve ser maior que zero',
          path: ['flowRate'],
        })
      }
      if (
        data.inletTemperature === undefined ||
        data.inletTemperature === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Temperatura de entrada é obrigatória',
          path: ['inletTemperature'],
        })
      }
      if (
        data.outletTemperature === undefined ||
        data.outletTemperature === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Temperatura de saída é obrigatória',
          path: ['outletTemperature'],
        })
      }
      if (!data.chillerType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o tipo de resfriador',
          path: ['chillerType'],
        })
      }
      if (!data.tubeLength || data.tubeLength <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Comprimento do tubo deve ser maior que zero',
          path: ['tubeLength'],
        })
      }
      if (!data.tubeDiameter || data.tubeDiameter <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Diâmetro do tubo deve ser maior que zero',
          path: ['tubeDiameter'],
        })
      }
    }
  })

export type FormData = z.infer<typeof equipmentSchema>

export const SaveEquipment = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const { mutate: saveEquipment, isPending: isSaving } = useSaveEquipment()

  const { data: existingEquipment, isLoading: isLoadingEquipment } =
    useEquipmentById(id)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(equipmentSchema),
    mode: 'onChange',
    defaultValues: {} as FormData,
  })

  const equipmentType = watch('type') as EquipmentType | undefined

  useEffect(() => {
    if (existingEquipment) {
      const baseData = {
        name: existingEquipment.name,
        description: existingEquipment.description || undefined,
        material: existingEquipment.material,
        totalCapacity: existingEquipment.totalCapacity,
        usableVolume: existingEquipment.usableVolume,
      }

      if (existingEquipment.type === EquipmentType.KETTLE) {
        const equipment = existingEquipment as unknown as {
          type: EquipmentType.KETTLE
          kettleLoss: number
          evaporationRate: number
          boilOffRate: number
          heatingPower: number
          heatingSource: HeatingSource
        }
        reset({
          ...baseData,
          type: EquipmentType.KETTLE,
          kettleLoss: equipment.kettleLoss,
          evaporationRate: equipment.evaporationRate,
          boilOffRate: equipment.boilOffRate,
          heatingPower: equipment.heatingPower,
          heatingSource: equipment.heatingSource,
        } as FormData)
      } else if (existingEquipment.type === EquipmentType.FERMENTER) {
        const equipment = existingEquipment as unknown as {
          type: EquipmentType.FERMENTER
          fermenterLoss: number
          coneBottomVolume: number
          hasTemperatureControl: boolean
          maxPressure: number
          coolingType: CoolingType
          minTemperature: number
          maxTemperature: number
        }
        reset({
          ...baseData,
          type: EquipmentType.FERMENTER,
          fermenterLoss: equipment.fermenterLoss,
          coneBottomVolume: equipment.coneBottomVolume,
          hasTemperatureControl: equipment.hasTemperatureControl,
          maxPressure: equipment.maxPressure,
          coolingType: equipment.coolingType,
          minTemperature: equipment.minTemperature,
          maxTemperature: equipment.maxTemperature,
        } as FormData)
      } else if (existingEquipment.type === EquipmentType.CHILLER) {
        const equipment = existingEquipment as unknown as {
          type: EquipmentType.CHILLER
          coolingCapacity: number
          flowRate: number
          inletTemperature: number
          outletTemperature: number
          chillerType: ChillerType
          tubeLength: number
          tubeDiameter: number
        }
        reset({
          ...baseData,
          type: EquipmentType.CHILLER,
          coolingCapacity: equipment.coolingCapacity,
          flowRate: equipment.flowRate,
          inletTemperature: equipment.inletTemperature,
          outletTemperature: equipment.outletTemperature,
          chillerType: equipment.chillerType,
          tubeLength: equipment.tubeLength,
          tubeDiameter: equipment.tubeDiameter,
        } as FormData)
      }
    }
  }, [existingEquipment, reset])

  const materialOptions = useMemo(
    () =>
      Object.values(EquipmentMaterial).map(material => ({
        value: material,
        label: materialLabels[material],
      })),
    [],
  )

  const heatingSourceOptions = useMemo(
    () =>
      Object.values(HeatingSource).map(source => ({
        value: source,
        label: heatingSourceLabels[source],
      })),
    [],
  )

  const coolingTypeOptions = useMemo(
    () =>
      Object.values(CoolingType).map(type => ({
        value: type,
        label: coolingTypeLabels[type],
      })),
    [],
  )

  const chillerTypeOptions = useMemo(
    () =>
      Object.values(ChillerType).map(type => ({
        value: type,
        label: chillerTypeLabels[type],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    if (!data.type) return

    const cleanData: EquipmentInput = {
      type: data.type,
      name: data.name!,
      ...(data.description && { description: data.description }),
      material: data.material!,
      totalCapacity: data.totalCapacity!,
      usableVolume: data.usableVolume!,
      ...(isEditMode && id && { id }),
    } as EquipmentInput

    if (data.type === EquipmentType.KETTLE) {
      Object.assign(cleanData, {
        type: EquipmentType.KETTLE,
        kettleLoss: data.kettleLoss!,
        evaporationRate: data.evaporationRate!,
        boilOffRate: data.boilOffRate!,
        heatingPower: data.heatingPower!,
        heatingSource: data.heatingSource!,
      })
    } else if (data.type === EquipmentType.FERMENTER) {
      Object.assign(cleanData, {
        type: EquipmentType.FERMENTER,
        fermenterLoss: data.fermenterLoss!,
        coneBottomVolume: data.coneBottomVolume!,
        hasTemperatureControl: data.hasTemperatureControl!,
        maxPressure: data.maxPressure!,
        coolingType: data.coolingType!,
        minTemperature: data.minTemperature!,
        maxTemperature: data.maxTemperature!,
      })
    } else if (data.type === EquipmentType.CHILLER) {
      Object.assign(cleanData, {
        type: EquipmentType.CHILLER,
        coolingCapacity: data.coolingCapacity!,
        flowRate: data.flowRate!,
        inletTemperature: data.inletTemperature!,
        outletTemperature: data.outletTemperature!,
        chillerType: data.chillerType!,
        tubeLength: data.tubeLength!,
        tubeDiameter: data.tubeDiameter!,
      })
    }

    saveEquipment(cleanData)
    navigate('/equipment')
  }

  const handleCancel = () => {
    navigate('/equipment')
  }

  if (isEditMode && isLoadingEquipment) {
    return (
      <Layout activeMenuItem="equipment">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="equipment">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Equipamento' : 'Adicionar Equipamento'}
          </Heading>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Tipo de Equipamento *"
                  placeholder="Selecione o tipo"
                  value={value || ''}
                  options={[
                    { value: EquipmentType.KETTLE, label: 'Panela' },
                    { value: EquipmentType.FERMENTER, label: 'Fermentador' },
                    { value: EquipmentType.CHILLER, label: 'Resfriador' },
                  ]}
                  onSelect={value => {
                    onChange(value as EquipmentType)
                    reset({ type: value as EquipmentType } as FormData)
                  }}
                  error={!!errors.type}
                  errorMessage={errors.type?.message}
                  disabled={isEditMode}
                />
              )}
            />
          </View>

          {equipmentType && (
            <>
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Nome *"
                      placeholder="Ex: Panela de 50L"
                      value={value || ''}
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
                  name="description"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Descrição"
                      placeholder="Descrição do equipamento..."
                      value={value || ''}
                      onChangeText={value => onChange(value || undefined)}
                      multiline
                      numberOfLines={3}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="material"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Material *"
                      placeholder="Selecione o material"
                      value={value || ''}
                      options={materialOptions}
                      onSelect={onChange}
                      error={!!errors.material}
                      errorMessage={errors.material?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="totalCapacity"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Capacidade Total (L) *"
                      placeholder="Ex: 50"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.totalCapacity}
                      errorMessage={errors.totalCapacity?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="usableVolume"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Volume Utilizável (L) *"
                      placeholder="Ex: 45"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.usableVolume}
                      errorMessage={errors.usableVolume?.message}
                    />
                  )}
                />
              </View>
            </>
          )}

          {equipmentType === EquipmentType.KETTLE && (
            <>
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="kettleLoss"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Perda na Panela (L) *"
                      placeholder="Ex: 2.5"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.kettleLoss}
                      errorMessage={errors.kettleLoss?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="evaporationRate"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Taxa de Evaporação (%/h) *"
                      placeholder="Ex: 8.5"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.evaporationRate}
                      errorMessage={errors.evaporationRate?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="boilOffRate"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Taxa de Boil Off (%/h) *"
                      placeholder="Ex: 6.0"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.boilOffRate}
                      errorMessage={errors.boilOffRate?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="heatingPower"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Potência de Aquecimento (W) *"
                      placeholder="Ex: 3500"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.heatingPower}
                      errorMessage={errors.heatingPower?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="heatingSource"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Fonte de Aquecimento *"
                      placeholder="Selecione a fonte"
                      value={value || ''}
                      options={heatingSourceOptions}
                      onSelect={onChange}
                      error={!!errors.heatingSource}
                      errorMessage={errors.heatingSource?.message}
                    />
                  )}
                />
              </View>
            </>
          )}

          {equipmentType === EquipmentType.FERMENTER && (
            <>
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="fermenterLoss"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Perda no Fermentador (L) *"
                      placeholder="Ex: 1.5"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.fermenterLoss}
                      errorMessage={errors.fermenterLoss?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="coneBottomVolume"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Volume do Fundo Cônico (L) *"
                      placeholder="Ex: 2.0"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.coneBottomVolume}
                      errorMessage={errors.coneBottomVolume?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="hasTemperatureControl"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Controle de Temperatura *"
                      placeholder="Selecione"
                      value={
                        value === undefined ? '' : value ? 'true' : 'false'
                      }
                      options={[
                        { value: 'true', label: 'Sim' },
                        { value: 'false', label: 'Não' },
                      ]}
                      onSelect={value =>
                        onChange(value === 'true' ? true : false)
                      }
                      error={!!errors.hasTemperatureControl}
                      errorMessage={errors.hasTemperatureControl?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="maxPressure"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Pressão Máxima (bar) *"
                      placeholder="Ex: 2.5"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.maxPressure}
                      errorMessage={errors.maxPressure?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="coolingType"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Tipo de Resfriamento *"
                      placeholder="Selecione o tipo"
                      value={value || ''}
                      options={coolingTypeOptions}
                      onSelect={onChange}
                      error={!!errors.coolingType}
                      errorMessage={errors.coolingType?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="minTemperature"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Temperatura Mínima (°C) *"
                      placeholder="Ex: 0"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.minTemperature}
                      errorMessage={errors.minTemperature?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="maxTemperature"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Temperatura Máxima (°C) *"
                      placeholder="Ex: 30"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.maxTemperature}
                      errorMessage={errors.maxTemperature?.message}
                    />
                  )}
                />
              </View>
            </>
          )}

          {equipmentType === EquipmentType.CHILLER && (
            <>
              <View style={styles.section}>
                <Controller
                  control={control}
                  name="coolingCapacity"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Capacidade de Resfriamento (W) *"
                      placeholder="Ex: 5000"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.coolingCapacity}
                      errorMessage={errors.coolingCapacity?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="flowRate"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Taxa de Fluxo (L/min) *"
                      placeholder="Ex: 15.5"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.flowRate}
                      errorMessage={errors.flowRate?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="inletTemperature"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Temperatura de Entrada (°C) *"
                      placeholder="Ex: 95"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.inletTemperature}
                      errorMessage={errors.inletTemperature?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="outletTemperature"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Temperatura de Saída (°C) *"
                      placeholder="Ex: 20"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.outletTemperature}
                      errorMessage={errors.outletTemperature?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="chillerType"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Tipo de Resfriador *"
                      placeholder="Selecione o tipo"
                      value={value || ''}
                      options={chillerTypeOptions}
                      onSelect={onChange}
                      error={!!errors.chillerType}
                      errorMessage={errors.chillerType?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="tubeLength"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Comprimento do Tubo (m) *"
                      placeholder="Ex: 15.0"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.tubeLength}
                      errorMessage={errors.tubeLength?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.section}>
                <Controller
                  control={control}
                  name="tubeDiameter"
                  render={({ field: { value, onChange } }) => (
                    <InputText
                      label="Diâmetro do Tubo (mm) *"
                      placeholder="Ex: 12.5"
                      value={value?.toString() || ''}
                      onChangeText={value =>
                        onChange(value ? parseFloat(value) : undefined)
                      }
                      keyboardType="numeric"
                      error={!!errors.tubeDiameter}
                      errorMessage={errors.tubeDiameter?.message}
                    />
                  )}
                />
              </View>
            </>
          )}

          <View style={styles.actions}>
            <Button variant="ghost" size="medium" onPress={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="medium"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || !equipmentType || isSaving}
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
