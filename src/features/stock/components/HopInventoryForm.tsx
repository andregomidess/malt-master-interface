import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { InputText } from '../../../shared/components/InputText'
import { Select } from '../../recipes/components/Select'
import { HopInventoryUnit } from '../interfaces/inventory'
import { FormData } from '../pages/SaveStock'
import { getFieldError } from '../utils/formUtils'

interface HopInventoryFormProps {
  control: Control<FormData>
  errors: FieldErrors<FormData>
  hopOptions: Array<{ value: string; label: string }>
}

export const HopInventoryForm: React.FC<HopInventoryFormProps> = ({
  control,
  errors,
  hopOptions,
}) => {
  const unitOptions = useMemo(
    () =>
      Object.values(HopInventoryUnit).map(unit => ({
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
          name="hopId"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Lúpulo *"
              placeholder="Selecione um lúpulo"
              value={value || ''}
              options={hopOptions}
              onSelect={onChange}
              error={getFieldError(errors, 'hopId').error}
              errorMessage={getFieldError(errors, 'hopId').message}
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
          name="alphaAcidsAtPurchase"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Ácidos Alfa na Compra (%)"
              placeholder="Ex: 5.5"
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
              placeholder="Ex: Refrigerado"
              value={value || ''}
              onChangeText={value => onChange(value || undefined)}
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
