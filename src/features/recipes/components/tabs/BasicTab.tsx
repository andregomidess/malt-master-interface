import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { useRecipe } from '../../context/RecipeContext'
import { InputText } from '../../../../shared/components/InputText'
import { DateInput } from '../../../../shared/components/DateInput'
import { Select } from '../Select'
import { Textarea } from '../Textarea'
import { ImageUploader } from '../ImageUploader'
import { useBeerStylesAll } from '../../../beer-style/hooks/useBeerStyles'
import { useEquipments } from '../../../equipment/hooks/useEquipments'
import { useMemo } from 'react'
import { RecipeType, recipeTypeLabels } from '../../interfaces/Recipe'
import { COLORS } from '../../../../shared/styles/colors'
import { Text } from '../../../../shared/components/Typography'
import { DecimalInput } from '../../../../shared/components/DecimalInput'
import type { RecipeBasicFormData } from '../../pages/SaveRecipes'

interface BasicTabProps {
  control: Control<RecipeBasicFormData>
  errors: FieldErrors<RecipeBasicFormData>
}

export const BasicTab: React.FC<BasicTabProps> = ({ control, errors }) => {
  const { updateRecipe } = useRecipe()
  const { beerStyles } = useBeerStylesAll()
  const { data: equipmentsData } = useEquipments()

  const equipmentOptions = useMemo(() => {
    if (!equipmentsData?.pages) return []
    const allEquipments = equipmentsData.pages.flatMap(page => page.data)
    return allEquipments.map(eq => ({
      value: eq.id,
      label: eq.name,
    }))
  }, [equipmentsData])

  const beerStyleOptions = useMemo(() => {
    return beerStyles.map(style => ({
      value: style.id,
      label: style.name,
    }))
  }, [beerStyles])

  const recipeTypeOptions = Object.values(RecipeType).map(type => ({
    value: type,
    label: recipeTypeLabels[type],
  }))

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text variant="body" style={styles.sectionTitle}>
          Imagem da Receita
        </Text>
        <Controller
          control={control}
          name="imageUrl"
          render={({ field: { value, onChange } }) => (
            <ImageUploader
              imageUrl={value || null}
              onImageSelect={imageUrl => {
                onChange(imageUrl)
                updateRecipe({ imageUrl })
              }}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Nome da Receita *"
              placeholder="Ex: Minha IPA Favorita"
              value={value || ''}
              onChangeText={text => {
                onChange(text)
                updateRecipe({ name: text })
              }}
              error={!!errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="beerStyle"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Estilo de Cerveja *"
              placeholder="Selecione o estilo"
              value={value || ''}
              options={beerStyleOptions}
              onSelect={selectedValue => {
                onChange(selectedValue)
                const selectedStyle = beerStyles.find(
                  s => s.id === selectedValue,
                )
                if (selectedStyle) {
                  updateRecipe({ beerStyle: selectedStyle })
                }
              }}
              error={!!errors.beerStyle}
              errorMessage={errors.beerStyle?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <>
              <Text variant="bodySmall" style={styles.label}>
                Tipo de Brassagem *
              </Text>
              <View style={styles.radioGroup}>
                {recipeTypeOptions.map(option => (
                  <View key={option.value} style={styles.radioOption}>
                    <View
                      style={[
                        styles.radio,
                        value === option.value && styles.radioSelected,
                      ]}
                    >
                      {value === option.value && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text
                      variant="bodySmall"
                      style={styles.radioLabel}
                      onPress={() => {
                        onChange(option.value as RecipeType)
                        updateRecipe({ type: option.value as RecipeType })
                      }}
                    >
                      {option.label}
                    </Text>
                  </View>
                ))}
              </View>
              {errors.type && (
                <Text variant="bodySmall" style={styles.errorText}>
                  {errors.type.message}
                </Text>
              )}
            </>
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="equipmentId"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Equipamento *"
              placeholder="Selecione o equipamento"
              value={value || ''}
              options={equipmentOptions}
              onSelect={selectedValue => {
                onChange(selectedValue)
                const selectedEquipment = equipmentsData?.pages
                  .flatMap(page => page.data)
                  .find(eq => eq.id === selectedValue)
                if (selectedEquipment) {
                  updateRecipe({ equipment: selectedEquipment })
                }
              }}
              error={!!errors.equipmentId}
              errorMessage={errors.equipmentId?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="finalVolume"
          render={({ field: { value, onChange } }) => (
            <DecimalInput
              label="Volume Final (Litros) *"
              placeholder="20"
              value={value}
              onChange={numValue => {
                onChange(numValue)
                updateRecipe({ finalVolume: numValue || null })
              }}
              error={!!errors.finalVolume}
              errorMessage={errors.finalVolume?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="mashVolume"
          render={({ field: { value, onChange } }) => (
            <DecimalInput
              label="Volume de Mostura (Litros)"
              placeholder="18"
              value={value}
              onChange={numValue => {
                onChange(numValue)
                updateRecipe({ mashVolume: numValue || null })
              }}
              error={!!errors.mashVolume}
              errorMessage={errors.mashVolume?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="preBoilVolume"
          render={({ field: { value, onChange } }) => (
            <DecimalInput
              label="Volume Pré-Fervura (Litros)"
              placeholder="Ex: 25 (ponto de partida para OG)"
              value={value}
              onChange={numValue => {
                onChange(numValue)
                updateRecipe({ preBoilVolume: numValue || null })
              }}
              error={!!errors.preBoilVolume}
              errorMessage={errors.preBoilVolume?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="boilTime"
          render={({ field: { value, onChange } }) => (
            <DecimalInput
              label="Tempo de Fervura (Minutos)"
              placeholder="75"
              value={value}
              onChange={numValue => {
                onChange(numValue)
                updateRecipe({ boilTime: numValue || null })
              }}
              error={!!errors.boilTime}
              errorMessage={errors.boilTime?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="postBoilVolume"
          render={({ field: { value, onChange } }) => (
            <DecimalInput
              label="Volume Pós-Fervura - Quente (Litros)"
              placeholder="Ex: 22 (opcional, calcula se vazio)"
              value={value}
              onChange={numValue => {
                onChange(numValue)
                updateRecipe({ postBoilVolume: numValue || null })
              }}
              error={!!errors.postBoilVolume}
              errorMessage={errors.postBoilVolume?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="mashEfficiency"
          render={({ field: { value, onChange } }) => (
            <>
              <DecimalInput
                label="Eficiência de Mostura (%)"
                placeholder="Ex: 75 (extração do grão)"
                value={value}
                onChange={numValue => {
                  onChange(numValue)
                  updateRecipe({ mashEfficiency: numValue || null })
                }}
                error={!!errors.mashEfficiency}
                errorMessage={errors.mashEfficiency?.message}
              />
            </>
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="brewDate"
          render={({ field: { value, onChange } }) => (
            <DateInput
              label="Data de Criação"
              placeholder="Selecione uma data"
              value={value || undefined}
              onChange={date => {
                onChange(date || '')
                updateRecipe({ brewDate: date || null })
              }}
              error={!!errors.brewDate}
              errorMessage={errors.brewDate?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="about"
          render={({ field: { value, onChange } }) => (
            <Textarea
              label="Descrição da Receita"
              placeholder="Uma receita equilibrada com notas cítricas e resinosas..."
              value={value || ''}
              onChangeText={text => {
                onChange(text)
                updateRecipe({ about: text || null })
              }}
              rows={4}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="notes"
          render={({ field: { value, onChange } }) => (
            <Textarea
              label="Instruções Específicas"
              placeholder="Usar levedura US-05, fermentar a 19°C..."
              value={value || ''}
              onChangeText={text => {
                onChange(text)
                updateRecipe({ notes: text || null })
              }}
              rows={4}
            />
          )}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: COLORS.brand.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brand.primary,
  },
  radioLabel: {
    color: COLORS.text.primary,
  },
  errorText: {
    marginTop: 4,
    color: COLORS.status.error,
    fontSize: 12,
  },
})
