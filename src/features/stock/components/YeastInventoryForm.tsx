import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { InputText } from '../../../shared/components/InputText'
import { DateInput } from '../../../shared/components/DateInput'
import { Select } from '../../recipes/components/Select'
import { YeastInventoryUnit } from '../interfaces/inventory'
import { FormData } from '../pages/SaveStock'
import { getFieldError } from '../utils/formUtils'

interface YeastInventoryFormProps {
  control: Control<FormData>
  errors: FieldErrors<FormData>
  yeastOptions: Array<{ value: string; label: string }>
}

export const YeastInventoryForm: React.FC<YeastInventoryFormProps> = ({
  control,
  errors,
  yeastOptions,
}) => {
  const unitOptions = useMemo(
    () =>
      Object.values(YeastInventoryUnit).map(unit => ({
        value: unit,
        label: unit.replace('_', ' ').toUpperCase(),
      })),
    [],
  )

  return (
    <>
      <View style={styles.section}>
        <Controller
          control={control}
          name="yeastId"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Levedura *"
              placeholder="Selecione uma levedura"
              value={value || ''}
              options={yeastOptions}
              onSelect={onChange}
              error={getFieldError(errors, 'yeastId').error}
              errorMessage={getFieldError(errors, 'yeastId').message}
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
          name="productionDate"
          render={({ field: { value, onChange } }) => (
            <DateInput
              label="Data de Produção"
              placeholder="Selecione uma data"
              value={value || undefined}
              onChange={date => onChange(date || undefined)}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="viability"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Viabilidade (%)"
              placeholder="Ex: 95"
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
          name="cellCount"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Contagem de Células (bilhões)"
              placeholder="Ex: 100"
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
          name="starter"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Starter"
              placeholder="Selecione"
              value={value === undefined ? '' : value ? 'true' : 'false'}
              options={[
                { value: 'true', label: 'Sim' },
                { value: 'false', label: 'Não' },
              ]}
              onSelect={value => onChange(value === 'true' ? true : false)}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="pitchingRate"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Taxa de Pitching"
              placeholder="Ex: 0.75"
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
