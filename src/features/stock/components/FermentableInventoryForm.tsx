import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { InputText } from '../../../shared/components/InputText'
import { Select } from '../../recipes/components/Select'
import { FermentableInventoryUnit } from '../interfaces/inventory'
import { FormData } from '../pages/SaveStock'
import { getFieldError } from '../utils/formUtils'

interface FermentableInventoryFormProps {
  control: Control<FormData>
  errors: FieldErrors<FormData>
  fermentableOptions: Array<{ value: string; label: string }>
}

export const FermentableInventoryForm: React.FC<
  FermentableInventoryFormProps
> = ({ control, errors, fermentableOptions }) => {
  const unitOptions = useMemo(
    () =>
      Object.values(FermentableInventoryUnit).map(unit => ({
        value: unit,
        label: unit.toUpperCase(),
      })),
    [],
  )

  return (
    <>
      <View style={styles.section}>
        <Controller
          control={control}
          name="fermentableId"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Fermentável *"
              placeholder="Selecione um fermentável"
              value={value || ''}
              options={fermentableOptions}
              onSelect={onChange}
              error={getFieldError(errors, 'fermentableId').error}
              errorMessage={getFieldError(errors, 'fermentableId').message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="unit"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Unidade *"
              placeholder="Selecione a unidade"
              value={value || ''}
              options={unitOptions}
              onSelect={onChange}
              error={!!errors.unit}
              errorMessage={errors.unit?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="extractPotential"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Potencial de Extração (%)"
              placeholder="Ex: 80"
              value={value?.toString() || ''}
              onChangeText={value =>
                onChange(value ? parseFloat(value) : undefined)
              }
              keyboardType="numeric"
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="lotNumber"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Número do Lote"
              placeholder="Ex: LOT123"
              value={value || ''}
              onChangeText={value => onChange(value || undefined)}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="moisture"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Umidade (%)"
              placeholder="Ex: 4.5"
              value={value?.toString() || ''}
              onChangeText={value =>
                onChange(value ? parseFloat(value) : undefined)
              }
              keyboardType="numeric"
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="protein"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Proteína (%)"
              placeholder="Ex: 11.5"
              value={value?.toString() || ''}
              onChangeText={value =>
                onChange(value ? parseFloat(value) : undefined)
              }
              keyboardType="numeric"
            />
          )}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
})
