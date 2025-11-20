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
import { TastingNoteInput } from '../interfaces/TastingNote'
import { useSaveTastingNote } from '../hooks/useSaveTastingNote'
import { useTastingNoteById } from '../hooks/useTastingNoteById'
import { useBatchesList } from '../../brewing/hooks/useBatchesList'

const tastingNoteSchema = z.object({
  batchId: z.string().min(1, 'Selecione um lote'),
  tastingDate: z.string().optional(),
  appearanceScore: z.number().min(0).max(10).optional(),
  aromaScore: z.number().min(0).max(10).optional(),
  flavorScore: z.number().min(0).max(10).optional(),
  mouthfeelScore: z.number().min(0).max(10).optional(),
  overallScore: z
    .number({ required_error: 'Pontuação geral é obrigatória' })
    .min(0, 'Pontuação deve estar entre 0 e 10')
    .max(10, 'Pontuação deve estar entre 0 e 10'),
  pros: z.string().optional(),
  cons: z.string().optional(),
  generalNotes: z.string().optional(),
})

export type FormData = z.infer<typeof tastingNoteSchema>

export const SaveReviews = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const { mutate: saveTastingNote, isPending: isSaving } = useSaveTastingNote()

  const { data: existingNote, isLoading: isLoadingNote } =
    useTastingNoteById(id)

  const { batches } = useBatchesList()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(tastingNoteSchema),
    mode: 'onChange',
    defaultValues: {
      batchId: '',
      tastingDate: '',
      pros: '',
      cons: '',
      generalNotes: '',
    } as FormData,
  })

  useEffect(() => {
    if (existingNote) {
      const date = existingNote.tastingDate
        ? new Date(existingNote.tastingDate).toISOString().split('T')[0]
        : ''
      reset({
        batchId: existingNote.batch.id,
        tastingDate: date,
        appearanceScore: existingNote.appearanceScore || undefined,
        aromaScore: existingNote.aromaScore || undefined,
        flavorScore: existingNote.flavorScore || undefined,
        mouthfeelScore: existingNote.mouthfeelScore || undefined,
        overallScore: existingNote.overallScore,
        pros: existingNote.pros || '',
        cons: existingNote.cons || '',
        generalNotes: existingNote.generalNotes || '',
      } as FormData)
    }
  }, [existingNote, reset])

  const batchOptions = useMemo(() => {
    return batches.map(batch => ({
      value: batch.id,
      label: batch.name || batch.batchCode || `Lote ${batch.id.slice(0, 8)}`,
    }))
  }, [batches])

  const onSubmit = (data: FormData) => {
    const cleanData: TastingNoteInput = {
      ...(isEditMode && id && { id }),
      batchId: data.batchId,
      ...(data.tastingDate && { tastingDate: data.tastingDate }),
      ...(data.appearanceScore && { appearanceScore: data.appearanceScore }),
      ...(data.aromaScore && { aromaScore: data.aromaScore }),
      ...(data.flavorScore && { flavorScore: data.flavorScore }),
      ...(data.mouthfeelScore && { mouthfeelScore: data.mouthfeelScore }),
      overallScore: data.overallScore,
      ...(data.pros && { pros: data.pros }),
      ...(data.cons && { cons: data.cons }),
      ...(data.generalNotes && { generalNotes: data.generalNotes }),
    }

    saveTastingNote(cleanData)
    navigate('/reviews')
  }

  const handleCancel = () => {
    navigate('/reviews')
  }

  if (isEditMode && isLoadingNote) {
    return (
      <Layout activeMenuItem="reviews">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="reviews">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Avaliação' : 'Nova Avaliação'}
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
              name="batchId"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Lote *"
                  placeholder="Selecione o lote"
                  value={value || ''}
                  options={batchOptions}
                  onSelect={onChange}
                  error={!!errors.batchId}
                  errorMessage={errors.batchId?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="tastingDate"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Data da Degustação"
                  placeholder="YYYY-MM-DD"
                  value={value || ''}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Pontuações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pontuações (0-10)</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="appearanceScore"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="Aparência"
                    placeholder="0-10"
                    value={value?.toString() || ''}
                    onChangeText={value =>
                      onChange(value ? parseFloat(value) : undefined)
                    }
                    keyboardType="numeric"
                    error={!!errors.appearanceScore}
                    errorMessage={errors.appearanceScore?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="aromaScore"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="Aroma"
                    placeholder="0-10"
                    value={value?.toString() || ''}
                    onChangeText={value =>
                      onChange(value ? parseFloat(value) : undefined)
                    }
                    keyboardType="numeric"
                    error={!!errors.aromaScore}
                    errorMessage={errors.aromaScore?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="flavorScore"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="Sabor"
                    placeholder="0-10"
                    value={value?.toString() || ''}
                    onChangeText={value =>
                      onChange(value ? parseFloat(value) : undefined)
                    }
                    keyboardType="numeric"
                    error={!!errors.flavorScore}
                    errorMessage={errors.flavorScore?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Controller
                control={control}
                name="mouthfeelScore"
                render={({ field: { value, onChange } }) => (
                  <InputText
                    label="Sensação na Boca"
                    placeholder="0-10"
                    value={value?.toString() || ''}
                    onChangeText={value =>
                      onChange(value ? parseFloat(value) : undefined)
                    }
                    keyboardType="numeric"
                    error={!!errors.mouthfeelScore}
                    errorMessage={errors.mouthfeelScore?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="overallScore"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Pontuação Geral *"
                  placeholder="0-10"
                  value={value?.toString() || ''}
                  onChangeText={value =>
                    onChange(value ? parseFloat(value) : undefined)
                  }
                  keyboardType="numeric"
                  error={!!errors.overallScore}
                  errorMessage={errors.overallScore?.message}
                />
              )}
            />
          </View>

          {/* Notas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="pros"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Pontos Positivos"
                  placeholder="O que você gostou..."
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
              name="cons"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Pontos Negativos"
                  placeholder="O que pode melhorar..."
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
              name="generalNotes"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Notas Gerais"
                  placeholder="Observações adicionais..."
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
