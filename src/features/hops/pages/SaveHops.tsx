import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigate, useParams } from 'react-router'
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
  HopForm,
  HopUse,
  HopInput,
  hopFormLabels,
  hopUseLabels,
} from '../interfaces/Hop'
import { useSaveHop } from '../hooks/useSaveHop'
import { useHopById } from '../hooks/useHopById'

const hopSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  alphaAcids: z
    .number({ required_error: 'Ácidos alfa são obrigatórios' })
    .min(0, 'Ácidos alfa devem ser >= 0'),
  betaAcids: z
    .number({ required_error: 'Ácidos beta são obrigatórios' })
    .min(0, 'Ácidos beta devem ser >= 0'),
  cohumulone: z.number().min(0, 'Cohumulone deve ser >= 0').optional(),
  totalOils: z.number().min(0, 'Óleos totais devem ser >= 0').optional(),
  form: z.nativeEnum(HopForm).optional(),
  uses: z.array(z.nativeEnum(HopUse)).optional(),
  aromaFlavor: z.string().optional(),
  harvestYear: z.number().int().positive().optional(),
  storageCondition: z.string().optional(),
  hsi: z.number().min(0, 'HSI deve ser >= 0').optional(),
  costPerKilogram: z
    .number()
    .min(0, 'Custo por quilograma deve ser >= 0')
    .optional(),
  notes: z.string().optional(),
  origin: z.string().optional(),
  supplier: z.string().optional(),
})

export type FormData = z.infer<typeof hopSchema>

export const SaveHops = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const { mutate: saveHop, isPending: isSaving } = useSaveHop()

  const { data: existingHop, isLoading: isLoadingHop } = useHopById(id)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(hopSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      alphaAcids: 0,
      betaAcids: 0,
      uses: [],
      aromaFlavor: '',
      storageCondition: '',
      notes: '',
      origin: '',
      supplier: '',
    },
  })

  const uses = watch('uses')
  const formValues = watch()

  // Debug: Monitora erros e estado do formulário
  useEffect(() => {
    console.log('=== DEBUG FORMULÁRIO ===')
    console.log('isValid:', isValid)
    console.log('Erros:', errors)
    console.log('Valores do formulário:', formValues)
    console.log('Erros específicos:')
    if (errors.cohumulone) {
      console.log('  - cohumulone:', errors.cohumulone.message)
    }
    if (errors.totalOils) {
      console.log('  - totalOils:', errors.totalOils.message)
    }
    if (errors.hsi) {
      console.log('  - hsi:', errors.hsi.message)
    }
    if (errors.costPerKilogram) {
      console.log('  - costPerKilogram:', errors.costPerKilogram.message)
    }
    console.log('Valores dos campos problemáticos:')
    console.log(
      '  - cohumulone:',
      formValues.cohumulone,
      'tipo:',
      typeof formValues.cohumulone,
    )
    console.log(
      '  - totalOils:',
      formValues.totalOils,
      'tipo:',
      typeof formValues.totalOils,
    )
    console.log('=======================')
  }, [errors, isValid, formValues])

  useEffect(() => {
    if (existingHop) {
      const toNumber = (
        val: number | string | null | undefined,
      ): number | undefined => {
        if (val === null || val === undefined) return undefined
        if (typeof val === 'string') {
          const num = parseFloat(val)
          return isNaN(num) ? undefined : num
        }
        return typeof val === 'number' ? val : undefined
      }

      const formData = {
        name: existingHop.name,
        alphaAcids: toNumber(existingHop.alphaAcids) ?? 0,
        betaAcids: toNumber(existingHop.betaAcids) ?? 0,
        cohumulone: toNumber(existingHop.cohumulone),
        totalOils: toNumber(existingHop.totalOils),
        form: existingHop.form,
        uses: existingHop.uses || [],
        aromaFlavor: existingHop.aromaFlavor || '',
        harvestYear: existingHop.harvestYear || undefined,
        storageCondition: existingHop.storageCondition || '',
        hsi: toNumber(existingHop.hsi),
        costPerKilogram: toNumber(existingHop.costPerKilogram),
        notes: existingHop.notes || '',
        origin: existingHop.origin || '',
        supplier: existingHop.supplier || '',
      }

      reset(formData as FormData)
      trigger()
    }
  }, [existingHop, reset, trigger])

  const formOptions = useMemo(
    () =>
      Object.values(HopForm).map(form => ({
        value: form,
        label: hopFormLabels[form],
      })),
    [],
  )

  const useOptions = useMemo(
    () =>
      Object.values(HopUse).map(use => ({
        value: use,
        label: hopUseLabels[use],
      })),
    [],
  )

  const onSubmit = (data: FormData) => {
    const cleanData: HopInput = {
      ...(isEditMode && id && { id }),
      name: data.name,
      alphaAcids: data.alphaAcids,
      betaAcids: data.betaAcids,
      ...(data.cohumulone && { cohumulone: data.cohumulone }),
      ...(data.totalOils && { totalOils: data.totalOils }),
      ...(data.form && { form: data.form }),
      uses: data.uses || [],
      ...(data.aromaFlavor && { aromaFlavor: data.aromaFlavor }),
      ...(data.harvestYear && { harvestYear: data.harvestYear }),
      ...(data.storageCondition && { storageCondition: data.storageCondition }),
      ...(data.hsi && { hsi: data.hsi }),
      ...(data.costPerKilogram && { costPerKilogram: data.costPerKilogram }),
      ...(data.notes && { notes: data.notes }),
      ...(data.origin && { origin: data.origin }),
      ...(data.supplier && { supplier: data.supplier }),
    }

    saveHop(cleanData)
    navigate('/hops')
  }

  const handleCancel = () => {
    navigate('/hops')
  }

  const toggleUse = (use: HopUse) => {
    const currentUses = uses || []
    const newUses = currentUses.includes(use)
      ? currentUses.filter(u => u !== use)
      : [...currentUses, use]
    setValue('uses', newUses, { shouldValidate: true })
  }

  if (isEditMode && isLoadingHop) {
    return (
      <Layout activeMenuItem="hops">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="hops">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode ? 'Editar Lúpulo' : 'Adicionar Lúpulo'}
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
                  placeholder="Ex: Cascade"
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
              name="supplier"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Fornecedor"
                  placeholder="Ex: Yakima Valley Hops"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          {/* Ácidos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ácidos</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="alphaAcids"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Ácidos Alfa (%) *"
                  placeholder="Ex: 5.5"
                  value={value}
                  onChange={onChange}
                  error={!!errors.alphaAcids}
                  errorMessage={errors.alphaAcids?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="betaAcids"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Ácidos Beta (%) *"
                  placeholder="Ex: 4.8"
                  value={value}
                  onChange={onChange}
                  error={!!errors.betaAcids}
                  errorMessage={errors.betaAcids?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="cohumulone"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Cohumulone (%)"
                  placeholder="Ex: 30"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="totalOils"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Óleos Totais (ml/100g)"
                  placeholder="Ex: 1.2"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          {/* Forma e Usos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Forma e Usos</Text>
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="form"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Forma"
                  placeholder="Selecione a forma"
                  value={value || ''}
                  options={formOptions}
                  onSelect={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="uses"
              render={() => (
                <>
                  <Text style={styles.label}>Usos</Text>
                  <View style={styles.tagsContainer}>
                    {useOptions.map(use => {
                      const isSelected = uses?.includes(use.value as HopUse)
                      return (
                        <TouchableOpacity
                          key={use.value}
                          style={[
                            styles.tagChip,
                            isSelected && styles.tagChipSelected,
                          ]}
                          onPress={() => toggleUse(use.value as HopUse)}
                        >
                          <Text
                            style={[
                              styles.tagChipText,
                              isSelected && styles.tagChipTextSelected,
                            ]}
                          >
                            {use.label}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </>
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
              name="aromaFlavor"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Aroma/Sabor"
                  placeholder="Ex: Cítrico, floral, frutado"
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
              name="harvestYear"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Ano da Colheita"
                  placeholder="Ex: 2024"
                  value={value?.toString() || ''}
                  onChangeText={value =>
                    onChange(value ? parseInt(value, 10) : undefined)
                  }
                  keyboardType="numeric"
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="storageCondition"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Condições de Armazenamento"
                  placeholder="Ex: Refrigerado, vácuo"
                  value={value || ''}
                  onChangeText={value => onChange(value || undefined)}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="hsi"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="HSI (Hop Storage Index)"
                  placeholder="Ex: 0.25"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="costPerKilogram"
              render={({ field: { value, onChange } }) => (
                <DecimalInput
                  label="Custo por Quilograma (R$)"
                  placeholder="Ex: 150.00"
                  value={value}
                  onChange={onChange}
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
                  placeholder="Notas adicionais sobre o lúpulo..."
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
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
