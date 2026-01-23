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
  YeastType,
  YeastFlocculation,
  YeastFormat,
  YeastInput,
  yeastTypeLabels,
  yeastFlocculationLabels,
  yeastFormatLabels,
} from '../interfaces/Yeast'
import { useSaveYeast } from '../hooks/useSaveYeast'
import { useYeastById } from '../hooks/useYeastById'

const yeastSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(YeastType, {
    required_error: 'Selecione o tipo de levedura',
  }),
  attenuation: z.number().min(0).max(100).optional(),
  flocculation: z.nativeEnum(YeastFlocculation, {
    required_error: 'Selecione a floculação',
  }),
  minTemp: z.number().optional(),
  maxTemp: z.number().optional(),
  format: z.nativeEnum(YeastFormat, {
    required_error: 'Selecione o formato',
  }),
  alcoholTolerance: z.number().min(0).max(100).optional(),
  origin: z.string().optional(),
  aromaFlavor: z.string().optional(),
  notes: z.string().optional(),
})

export type FormData = z.infer<typeof yeastSchema>

// Helper para converter valores numéricos que podem vir como string do backend
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

export const SaveYeast = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const baseId = searchParams.get('base')
  const isEditMode = !!id

  const { mutate: saveYeast, isPending: isSaving } = useSaveYeast()

  const { data: existingYeast, isLoading: isLoadingYeast } = useYeastById(
    id || baseId || undefined,
  )

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(yeastSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      origin: '',
      aromaFlavor: '',
      notes: '',
    } as FormData,
  })

  useEffect(() => {
    if (existingYeast) {
      reset({
        name: baseId ? '' : existingYeast.name,
        type: existingYeast.type,
        attenuation: toNumber(existingYeast.attenuation),
        flocculation: existingYeast.flocculation,
        minTemp: toNumber(existingYeast.minTemp),
        maxTemp: toNumber(existingYeast.maxTemp),
        format: existingYeast.format,
        alcoholTolerance: toNumber(existingYeast.alcoholTolerance),
        origin: existingYeast.origin || '',
        aromaFlavor: existingYeast.aromaFlavor || '',
        notes: existingYeast.notes || '',
      } as FormData)
      trigger()
    }
  }, [existingYeast, reset, trigger, baseId])

  const typeOptions = useMemo(
    () =>
      Object.values(YeastType).map(type => ({
        value: type,
        label: yeastTypeLabels[type],
      })),
    [],
  )

  const flocculationOptions = useMemo(
    () =>
      Object.values(YeastFlocculation).map(floc => ({
        value: floc,
        label: yeastFlocculationLabels[floc],
      })),
    [],
  )

  const formatOptions = useMemo(
    () =>
      Object.values(YeastFormat).map(format => ({
        value: format,
        label: yeastFormatLabels[format],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    const cleanData: YeastInput = {
      ...(isEditMode && id && { id }),
      name: data.name,
      type: data.type,
      ...(data.attenuation && { attenuation: data.attenuation }),
      flocculation: data.flocculation,
      ...(data.minTemp && { minTemp: data.minTemp }),
      ...(data.maxTemp && { maxTemp: data.maxTemp }),
      format: data.format,
      ...(data.alcoholTolerance && { alcoholTolerance: data.alcoholTolerance }),
      ...(data.origin && { origin: data.origin }),
      ...(data.aromaFlavor && { aromaFlavor: data.aromaFlavor }),
      ...(data.notes && { notes: data.notes }),
    }

    saveYeast(cleanData)
    navigate('/yeast')
  }

  const handleCancel = () => {
    navigate('/yeast')
  }

  if ((isEditMode || baseId) && isLoadingYeast) {
    return (
      <Layout activeMenuItem="yeast">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="yeast">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Levedura' : 'Adicionar Levedura'}
          </Heading>
        </View>

        <View style={styles.form}>
          {/* Informações Básicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Nome *"
                  placeholder="Ex: US-05"
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
              name="type"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Tipo *"
                  placeholder="Selecione o tipo"
                  value={value || ''}
                  options={typeOptions}
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
              name="flocculation"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Floculação *"
                  placeholder="Selecione a floculação"
                  value={value || ''}
                  options={flocculationOptions}
                  onSelect={onChange}
                  error={!!errors.flocculation}
                  errorMessage={errors.flocculation?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="format"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Formato *"
                  placeholder="Selecione o formato"
                  value={value || ''}
                  options={formatOptions}
                  onSelect={onChange}
                  error={!!errors.format}
                  errorMessage={errors.format?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="origin"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Origem"
                  placeholder="Ex: Estados Unidos"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          {/* Características */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="attenuation"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Atenuação (%)"
                  placeholder="Ex: 75"
                  value={value}
                  onChange={onChange}
                  error={!!errors.attenuation}
                  errorMessage={errors.attenuation?.message}
                />
              )}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="minTemp"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Temperatura Mínima (°C)"
                    placeholder="Ex: 18.00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="maxTemp"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Temperatura Máxima (°C)"
                    placeholder="Ex: 21.00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="alcoholTolerance"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Tolerância ao Álcool (%)"
                  placeholder="Ex: 12"
                  value={value}
                  onChange={onChange}
                  error={!!errors.alcoholTolerance}
                  errorMessage={errors.alcoholTolerance?.message}
                />
              )}
            />
          </View>

          {/* Descrições */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrições</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="aromaFlavor"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Aroma/Sabor"
                  placeholder="Descrição do aroma e sabor..."
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
              name="notes"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Observações"
                  placeholder="Notas adicionais sobre a levedura..."
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                  multiline
                  numberOfLines={4}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
