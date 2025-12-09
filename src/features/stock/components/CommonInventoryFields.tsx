import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { InputText } from '../../../shared/components/InputText'
import { DateInput } from '../../../shared/components/DateInput'
import { FormData } from '../pages/SaveStock'

interface CommonInventoryFieldsProps {
  control: Control<FormData>
  errors: FieldErrors<FormData>
}

export const CommonInventoryFields: React.FC<CommonInventoryFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <>
      <View style={styles.section}>
        <Controller
          control={control}
          name="quantity"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Quantidade *"
              placeholder="Ex: 5.0"
              value={value?.toString() || ''}
              onChangeText={value =>
                onChange(value ? parseFloat(value) : undefined)
              }
              keyboardType="numeric"
              error={!!errors.quantity}
              errorMessage={errors.quantity?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="purchaseDate"
          render={({ field: { value, onChange } }) => (
            <DateInput
              label="Data de Compra"
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
          name="bestBeforeDate"
          render={({ field: { value, onChange } }) => (
            <DateInput
              label="Data de Validade"
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
          name="costPerUnit"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Custo por Unidade"
              placeholder="Ex: 25.50"
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
          name="notes"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Observações"
              placeholder="Notas adicionais..."
              value={value || ''}
              onChangeText={value => onChange(value || undefined)}
              multiline
              numberOfLines={4}
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
