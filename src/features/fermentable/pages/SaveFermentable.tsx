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
  FermentableType,
  FermentableForm,
  FermentableInput,
  fermentableTypeLabels,
  fermentableFormLabels,
} from '../interfaces/Fermentable'
import { useSaveFermentable } from '../hooks/useSaveFermentable'
import { useFermentableById } from '../hooks/useFermentableById'

const fermentableSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(FermentableType, {
    required_error: 'Selecione o tipo de fermentável',
  }),
  form: z.nativeEnum(FermentableForm, {
    required_error: 'Selecione a forma do fermentável',
  }),
  color: z.number().positive().optional(),
  yield: z.number().min(0).max(100).optional(),
  origin: z.string().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
})

export type FormData = z.infer<typeof fermentableSchema>

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

export const SaveFermentable = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const baseId = searchParams.get('base')
  const isEditMode = !!id

  const { mutate: saveFermentable, isPending: isSaving } = useSaveFermentable()

  const { data: existingFermentable, isLoading: isLoadingFermentable } =
    useFermentableById(id || baseId || undefined)

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(fermentableSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      origin: '',
      supplier: '',
      notes: '',
    } as FormData,
  })

  useEffect(() => {
    if (existingFermentable) {
      reset({
        name: baseId ? '' : existingFermentable.name,
        type: existingFermentable.type,
        form: existingFermentable.form,
        color: toNumber(existingFermentable.color),
        yield: toNumber(existingFermentable.yield),
        origin: existingFermentable.origin || '',
        supplier: existingFermentable.supplier || '',
        notes: existingFermentable.notes || '',
      } as FormData)
      trigger()
    }
  }, [existingFermentable, reset, trigger, baseId])

  const typeOptions = useMemo(
    () =>
      Object.values(FermentableType).map(type => ({
        value: type,
        label: fermentableTypeLabels[type],
      })),
    [],
  )

  const formOptions = useMemo(
    () =>
      Object.values(FermentableForm).map(form => ({
        value: form,
        label: fermentableFormLabels[form],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    const cleanData: FermentableInput = {
      ...(isEditMode && id && { id }),
      name: data.name,
      type: data.type,
      form: data.form,
      ...(data.color && { color: data.color }),
      ...(data.yield && { yield: data.yield }),
      ...(data.origin && { origin: data.origin }),
      ...(data.supplier && { supplier: data.supplier }),
      ...(data.notes && { notes: data.notes }),
    }

    saveFermentable(cleanData)
    navigate('/fermentable')
  }

  const handleCancel = () => {
    navigate('/fermentable')
  }

  if (isEditMode && isLoadingFermentable) {
    return (
      <Layout activeMenuItem="fermentable">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="fermentable">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Fermentável' : 'Adicionar Fermentável'}
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
                  placeholder="Ex: Pilsen"
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
              name="form"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Forma *"
                  placeholder="Selecione a forma"
                  value={value || ''}
                  options={formOptions}
                  onSelect={onChange}
                  error={!!errors.form}
                  errorMessage={errors.form?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="color"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Cor (Lovibond)"
                  placeholder="Ex: 2.0"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="yield"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Rendimento (%)"
                  placeholder="Ex: 80"
                  value={
                    value !== undefined && value !== null
                      ? value.toString()
                      : ''
                  }
                  onChangeText={text => {
                    if (!text || text.trim() === '') {
                      onChange(undefined)
                    } else {
                      const numValue = parseFloat(text)
                      if (!isNaN(numValue)) {
                        onChange(numValue)
                      } else {
                        onChange(undefined)
                      }
                    }
                  }}
                  keyboardType="numeric"
                  error={!!errors.yield}
                  errorMessage={errors.yield?.message}
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
                  placeholder="Ex: Alemanha"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="supplier"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Fornecedor"
                  placeholder="Ex: Weyermann"
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
                  placeholder="Notas adicionais sobre o fermentável..."
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
