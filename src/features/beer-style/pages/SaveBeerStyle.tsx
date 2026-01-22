import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
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
  BeerTag,
  GlasswareType,
  BeerStyleInput,
  BeerTagLabels,
  GlasswareLabels,
} from '../interfaces/BeerStyle'
import { useSaveBeerStyle } from '../hooks/useSaveBeerStyle'
import { useBeerStyleById } from '../hooks/useBeerStyleById'

// Função auxiliar para validar número decimal (float)
const numberDecimalSchema = z
  .number()
  .positive('Deve ser um número positivo')
  .nullable()
  .optional()

// Função auxiliar para validar número inteiro
const numberIntegerSchema = z
  .number()
  .int('Deve ser um número inteiro')
  .positive('Deve ser um número positivo')
  .nullable()
  .optional()

const beerStyleSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório').trim(),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    minAbv: numberDecimalSchema,
    maxAbv: numberDecimalSchema,
    minOg: numberDecimalSchema,
    maxOg: numberDecimalSchema,
    minFg: numberDecimalSchema,
    maxFg: numberDecimalSchema,
    minIbu: numberIntegerSchema,
    maxIbu: numberIntegerSchema,
    minColorEbc: numberIntegerSchema,
    maxColorEbc: numberIntegerSchema,
    description: z.string().optional(),
    aroma: z.string().optional(),
    appearance: z.string().optional(),
    flavor: z.string().optional(),
    mouthfeel: z.string().optional(),
    comments: z.string().optional(),
    history: z.string().optional(),
    ingredients: z.string().optional(),
    examples: z.string().optional(),
    tags: z.array(z.nativeEnum(BeerTag)).min(1, 'Selecione pelo menos uma tag'),
    origin: z.string().optional(),
    glassware: z.nativeEnum(GlasswareType).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.minAbv && data.maxAbv && data.minAbv > data.maxAbv) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ABV mínimo não pode ser maior que o máximo',
        path: ['minAbv'],
      })
    }
    if (data.minOg && data.maxOg && data.minOg > data.maxOg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'OG mínimo não pode ser maior que o máximo',
        path: ['minOg'],
      })
    }
    if (data.minFg && data.maxFg && data.minFg > data.maxFg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'FG mínimo não pode ser maior que o máximo',
        path: ['minFg'],
      })
    }
    if (data.minIbu && data.maxIbu && data.minIbu > data.maxIbu) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'IBU mínimo não pode ser maior que o máximo',
        path: ['minIbu'],
      })
    }
    if (
      data.minColorEbc &&
      data.maxColorEbc &&
      data.minColorEbc > data.maxColorEbc
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cor EBC mínima não pode ser maior que a máxima',
        path: ['minColorEbc'],
      })
    }
  })

export type FormData = z.infer<typeof beerStyleSchema>

export const SaveBeerStyle = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const baseId = searchParams.get('base')
  const isEditMode = !!id

  const { mutate: saveBeerStyle, isPending: isSaving } = useSaveBeerStyle()

  const { data: existingBeerStyle, isLoading: isLoadingBeerStyle } =
    useBeerStyleById(id || baseId || undefined)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(beerStyleSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      category: '',
      subCategory: '',
      tags: [],
      origin: '',
    } as FormData,
  })

  const tags = watch('tags')

  // Função auxiliar para converter valores para números
  const toNumber = (
    value: number | string | null | undefined,
  ): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined
    if (typeof value === 'number') return isNaN(value) ? undefined : value
    const parsed = parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  }

  // Função auxiliar para converter valores para inteiros
  const toInteger = (
    value: number | string | null | undefined,
  ): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined
    if (typeof value === 'number')
      return isNaN(value) ? undefined : Math.floor(value)
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? undefined : parsed
  }

  useEffect(() => {
    if (existingBeerStyle) {
      reset({
        name: baseId ? '' : existingBeerStyle.name, // Limpa o nome se for usar como base
        category: existingBeerStyle.category || '',
        subCategory: existingBeerStyle.subCategory || '',
        minAbv: toNumber(existingBeerStyle.minAbv),
        maxAbv: toNumber(existingBeerStyle.maxAbv),
        minOg: toNumber(existingBeerStyle.minOg),
        maxOg: toNumber(existingBeerStyle.maxOg),
        minFg: toNumber(existingBeerStyle.minFg),
        maxFg: toNumber(existingBeerStyle.maxFg),
        minIbu: toInteger(existingBeerStyle.minIbu),
        maxIbu: toInteger(existingBeerStyle.maxIbu),
        minColorEbc: toInteger(existingBeerStyle.minColorEbc),
        maxColorEbc: toInteger(existingBeerStyle.maxColorEbc),
        description: existingBeerStyle.description || '',
        aroma: existingBeerStyle.aroma || '',
        appearance: existingBeerStyle.appearance || '',
        flavor: existingBeerStyle.flavor || '',
        mouthfeel: existingBeerStyle.mouthfeel || '',
        comments: existingBeerStyle.comments || '',
        history: existingBeerStyle.history || '',
        ingredients: existingBeerStyle.ingredients || '',
        examples: existingBeerStyle.examples || '',
        tags: existingBeerStyle.tags || [],
        origin: existingBeerStyle.origin || '',
        glassware: existingBeerStyle.glassware || undefined,
      } as FormData)
      trigger()
    }
  }, [existingBeerStyle, reset, trigger, baseId])

  const glasswareOptions = useMemo(
    () =>
      Object.values(GlasswareType).map(type => ({
        value: type,
        label: GlasswareLabels[type],
      })),
    [],
  )

  const tagOptions = useMemo(
    () =>
      Object.values(BeerTag).map(tag => ({
        value: tag,
        label: BeerTagLabels[tag],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    const hasValue = (value: string | undefined | null): boolean => {
      return !!value && value.trim().length > 0
    }

    const hasNumberValue = (
      value: number | null | undefined,
    ): value is number => {
      return value !== null && value !== undefined
    }

    const cleanData: BeerStyleInput = {
      ...(isEditMode && id && { id }),
      name: data.name.trim(),
      ...(hasValue(data.category) && { category: data.category?.trim() }),
      ...(hasValue(data.subCategory) && {
        subCategory: data.subCategory?.trim(),
      }),
      ...(hasNumberValue(data.minAbv) && { minAbv: data.minAbv }),
      ...(hasNumberValue(data.maxAbv) && { maxAbv: data.maxAbv }),
      ...(hasNumberValue(data.minOg) && { minOg: data.minOg }),
      ...(hasNumberValue(data.maxOg) && { maxOg: data.maxOg }),
      ...(hasNumberValue(data.minFg) && { minFg: data.minFg }),
      ...(hasNumberValue(data.maxFg) && { maxFg: data.maxFg }),
      ...(hasNumberValue(data.minIbu) && { minIbu: data.minIbu }),
      ...(hasNumberValue(data.maxIbu) && { maxIbu: data.maxIbu }),
      ...(hasNumberValue(data.minColorEbc) && {
        minColorEbc: data.minColorEbc,
      }),
      ...(hasNumberValue(data.maxColorEbc) && {
        maxColorEbc: data.maxColorEbc,
      }),
      ...(hasValue(data.description) && {
        description: data.description?.trim(),
      }),
      ...(hasValue(data.aroma) && { aroma: data.aroma?.trim() }),
      ...(hasValue(data.appearance) && { appearance: data.appearance?.trim() }),
      ...(hasValue(data.flavor) && { flavor: data.flavor?.trim() }),
      ...(hasValue(data.mouthfeel) && { mouthfeel: data.mouthfeel?.trim() }),
      ...(hasValue(data.comments) && { comments: data.comments?.trim() }),
      ...(hasValue(data.history) && { history: data.history?.trim() }),
      ...(hasValue(data.ingredients) && {
        ingredients: data.ingredients?.trim(),
      }),
      ...(hasValue(data.examples) && { examples: data.examples?.trim() }),
      tags: data.tags,
      ...(hasValue(data.origin) && { origin: data.origin?.trim() }),
      ...(data.glassware && { glassware: data.glassware }),
    }

    saveBeerStyle(cleanData)
    navigate('/beer-styles')
  }

  const handleCancel = () => {
    navigate('/beer-styles')
  }

  const toggleTag = (tag: BeerTag) => {
    const currentTags = tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    setValue('tags', newTags, { shouldValidate: true })
  }

  if (isEditMode && isLoadingBeerStyle) {
    return (
      <Layout activeMenuItem="beer-styles">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="beer-styles">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode
              ? 'Editar Estilo de Cerveja'
              : 'Adicionar Estilo de Cerveja'}
          </Heading>
        </View>

        <View style={styles.form}>
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
                  placeholder="Ex: IPA"
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
              name="category"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Categoria"
                  placeholder="Ex: Ale"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="subCategory"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Subcategoria"
                  placeholder="Ex: American IPA"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
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

          <View style={styles.section}>
            <Controller
              control={control}
              name="tags"
              render={() => (
                <>
                  <Text style={styles.label}>Tags *</Text>
                  <View style={styles.tagsContainer}>
                    {tagOptions.map(tag => {
                      const isSelected = tags?.includes(tag.value as BeerTag)
                      return (
                        <TouchableOpacity
                          key={tag.value}
                          style={[
                            styles.tagChip,
                            isSelected && styles.tagChipSelected,
                          ]}
                          onPress={() => toggleTag(tag.value as BeerTag)}
                        >
                          <Text
                            style={[
                              styles.tagChipText,
                              isSelected && styles.tagChipTextSelected,
                            ]}
                          >
                            {tag.label}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                  {errors.tags && (
                    <Text style={styles.errorText}>{errors.tags.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especificações</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="minAbv"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="ABV Mínimo (%)"
                    placeholder="Ex: 4.5"
                    value={value}
                    onChange={onChange}
                    error={!!errors.minAbv}
                    errorMessage={errors.minAbv?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="maxAbv"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="ABV Máximo (%)"
                    placeholder="Ex: 7.5"
                    value={value}
                    onChange={onChange}
                    error={!!errors.maxAbv}
                    errorMessage={errors.maxAbv?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="minOg"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="OG Mínimo"
                    placeholder="Ex: 1.045"
                    value={value}
                    onChange={onChange}
                    error={!!errors.minOg}
                    errorMessage={errors.minOg?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="maxOg"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="OG Máximo"
                    placeholder="Ex: 1.065"
                    value={value}
                    onChange={onChange}
                    error={!!errors.maxOg}
                    errorMessage={errors.maxOg?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="minFg"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="FG Mínimo"
                    placeholder="Ex: 1.008"
                    value={value}
                    onChange={onChange}
                    error={!!errors.minFg}
                    errorMessage={errors.minFg?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="maxFg"
                render={({ field: { value, onChange } }) => (
                  <DecimalInput
                    label="FG Máximo"
                    placeholder="Ex: 1.015"
                    value={value}
                    onChange={onChange}
                    error={!!errors.maxFg}
                    errorMessage={errors.maxFg?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="minIbu"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="IBU Mínimo"
                    placeholder="Ex: 40"
                    value={value?.toString() || ''}
                    onChangeText={value => {
                      const numValue =
                        value.trim() === '' ? undefined : parseInt(value, 10)
                      onChange(
                        numValue !== undefined && !isNaN(numValue)
                          ? numValue
                          : undefined,
                      )
                    }}
                    keyboardType="numeric"
                    error={!!errors.minIbu}
                    errorMessage={errors.minIbu?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="maxIbu"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="IBU Máximo"
                    placeholder="Ex: 70"
                    value={value?.toString() || ''}
                    onChangeText={value => {
                      const numValue =
                        value.trim() === '' ? undefined : parseInt(value, 10)
                      onChange(
                        numValue !== undefined && !isNaN(numValue)
                          ? numValue
                          : undefined,
                      )
                    }}
                    keyboardType="numeric"
                    error={!!errors.maxIbu}
                    errorMessage={errors.maxIbu?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="minColorEbc"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="Cor EBC Mínimo"
                    placeholder="Ex: 8"
                    value={value?.toString() || ''}
                    onChangeText={value => {
                      const numValue =
                        value.trim() === '' ? undefined : parseInt(value, 10)
                      onChange(
                        numValue !== undefined && !isNaN(numValue)
                          ? numValue
                          : undefined,
                      )
                    }}
                    keyboardType="numeric"
                    error={!!errors.minColorEbc}
                    errorMessage={errors.minColorEbc?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="maxColorEbc"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="Cor EBC Máximo"
                    placeholder="Ex: 14"
                    value={value?.toString() || ''}
                    onChangeText={value => {
                      const numValue =
                        value.trim() === '' ? undefined : parseInt(value, 10)
                      onChange(
                        numValue !== undefined && !isNaN(numValue)
                          ? numValue
                          : undefined,
                      )
                    }}
                    keyboardType="numeric"
                    error={!!errors.maxColorEbc}
                    errorMessage={errors.maxColorEbc?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="glassware"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Tipo de Copo"
                  placeholder="Selecione o tipo de copo"
                  value={value || ''}
                  options={glasswareOptions}
                  onSelect={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrições</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Descrição Geral"
                  placeholder="Descrição geral do estilo..."
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="aroma"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Aroma"
                  placeholder="Descrição do aroma..."
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
              name="appearance"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Aparência"
                  placeholder="Descrição da aparência..."
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
              name="flavor"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Sabor"
                  placeholder="Descrição do sabor..."
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
              name="mouthfeel"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Sensação na Boca"
                  placeholder="Descrição da sensação na boca..."
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
              name="comments"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Comentários"
                  placeholder="Comentários adicionais..."
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
              name="history"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="História"
                  placeholder="História do estilo..."
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
              name="ingredients"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Ingredientes"
                  placeholder="Ingredientes típicos..."
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
              name="examples"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Exemplos"
                  placeholder="Exemplos de cervejas comerciais..."
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                  multiline
                  numberOfLines={3}
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
  label: {
    fontSize: 14,
    fontWeight: '500',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  tagChipSelected: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  tagChipTextSelected: {
    color: COLORS.neutral.white,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.status.error,
    marginTop: 4,
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
