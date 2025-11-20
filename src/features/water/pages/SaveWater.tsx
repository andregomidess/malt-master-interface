import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigate, useParams } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { DecimalInput } from '../../../shared/components/DecimalInput'
import { Button } from '../../../shared/components/Button'
import { COLORS } from '../../../shared/styles/colors'
import { WaterProfileInput } from '../interfaces/WaterProfile'
import { useSaveWaterProfile } from '../hooks/useSaveWaterProfile'
import { useWaterProfileById } from '../hooks/useWaterProfileById'

const waterProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  origin: z.string().optional(),
  ca: z.number().positive().optional(),
  mg: z.number().positive().optional(),
  na: z.number().positive().optional(),
  so4: z.number().positive().optional(),
  cl: z.number().positive().optional(),
  hco3: z.number().positive().optional(),
  ph: z.number().min(0).max(14).optional(),
  recommendedStyle: z.string().optional(),
  notes: z.string().optional(),
})

export type FormData = z.infer<typeof waterProfileSchema>

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

export const SaveWater = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const { mutate: saveWaterProfile, isPending: isSaving } =
    useSaveWaterProfile()

  const { data: existingProfile, isLoading: isLoadingProfile } =
    useWaterProfileById(id)

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(waterProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      origin: '',
      recommendedStyle: '',
      notes: '',
    } as FormData,
  })

  useEffect(() => {
    if (existingProfile) {
      reset({
        name: existingProfile.name,
        origin: existingProfile.origin || '',
        ca: toNumber(existingProfile.ca),
        mg: toNumber(existingProfile.mg),
        na: toNumber(existingProfile.na),
        so4: toNumber(existingProfile.so4),
        cl: toNumber(existingProfile.cl),
        hco3: toNumber(existingProfile.hco3),
        ph: toNumber(existingProfile.ph),
        recommendedStyle: existingProfile.recommendedStyle || '',
        notes: existingProfile.notes || '',
      } as FormData)
      trigger()
    }
  }, [existingProfile, reset, trigger])

  const onSubmit = (data: FormData) => {
    const cleanData: WaterProfileInput = {
      ...(isEditMode && id && { id }),
      name: data.name,
      ...(data.origin && { origin: data.origin }),
      ...(data.ca && { ca: data.ca }),
      ...(data.mg && { mg: data.mg }),
      ...(data.na && { na: data.na }),
      ...(data.so4 && { so4: data.so4 }),
      ...(data.cl && { cl: data.cl }),
      ...(data.hco3 && { hco3: data.hco3 }),
      ...(data.ph && { ph: data.ph }),
      recommendedStyle: data.recommendedStyle || null,
      notes: data.notes || null,
    }

    saveWaterProfile(cleanData)
    navigate('/water')
  }

  const handleCancel = () => {
    navigate('/water')
  }

  if (isEditMode && isLoadingProfile) {
    return (
      <Layout activeMenuItem="water">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="water">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Perfil de Água' : 'Adicionar Perfil de Água'}
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
                  placeholder="Ex: Água de Burton"
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
              name="origin"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Origem"
                  placeholder="Ex: Burton upon Trent, Inglaterra"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          {/* Íons Principais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Íons Principais (ppm)</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="ca"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Cálcio (Ca²⁺)"
                    placeholder="Ex: 33.00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="mg"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Magnésio (Mg²⁺)"
                    placeholder="Ex: 44.00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="na"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Sódio (Na⁺)"
                    placeholder="Ex: 22.00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="so4"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Sulfato (SO₄²⁻)"
                    placeholder="Ex: 32.00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="cl"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Cloreto (Cl⁻)"
                    placeholder="Ex: 5.00"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="hco3"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="Bicarbonato (HCO₃⁻)"
                    placeholder="Ex: 222.00"
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
              name="ph"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="pH"
                  placeholder="Ex: 7.0"
                  value={value}
                  onChange={onChange}
                  error={!!errors.ph}
                  errorMessage={errors.ph?.message}
                />
              )}
            />
          </View>

          {/* Informações Adicionais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="recommendedStyle"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Estilo Recomendado"
                  placeholder="Ex: IPA, Stout"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
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
                  placeholder="Notas adicionais sobre o perfil..."
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
