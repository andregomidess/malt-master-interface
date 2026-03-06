import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Select } from '../Select'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import { useWaterProfilesLoadOptions } from '../../../water/hooks/useWaterProfiles'
import { waterProfilesApi } from '../../../water/api/waterProfilesApi'
import type { WaterProfile } from '../../../water/interfaces/WaterProfile'
import { RecipeWater } from '../../context/RecipeContext'

interface AddWaterModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (water: RecipeWater) => void
}

export const AddWaterModal: React.FC<AddWaterModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const loadWaterOptions = useWaterProfilesLoadOptions()
  const [selectedWaterId, setSelectedWaterId] = useState<string>('')
  const [selectedWater, setSelectedWater] = useState<WaterProfile | null>(null)

  const handleSelectWater = async (id: string) => {
    setSelectedWaterId(id)
    const water = await waterProfilesApi.findById(id)
    setSelectedWater(water)
  }

  const handleAdd = () => {
    if (!selectedWaterId) return

    onAdd({
      waterId: selectedWaterId,
      amount: 0,
      water: selectedWater
        ? {
            name: selectedWater.name,
          }
        : undefined,
    })

    setSelectedWaterId('')
    setSelectedWater(null)
    onClose()
  }

  return (
    <RecipeModal visible={visible} onClose={onClose} title="Adicionar Água">
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Perfil de Água *"
            placeholder="Selecione um perfil de água"
            value={selectedWaterId}
            options={[]}
            loadOptions={loadWaterOptions}
            selectedLabel={selectedWater?.name}
            onSelect={handleSelectWater}
            error={!selectedWaterId}
            errorMessage={
              !selectedWaterId ? 'Selecione um perfil de água' : undefined
            }
          />
        </View>

        {selectedWater && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoText}>
              Origem: {selectedWater.origin ?? '—'}
            </Text>
            <Text variant="caption" style={styles.hint}>
              O volume será calculado automaticamente com base nos fermentáveis,
              perfil de mostura e equipamento.
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button variant="ghost" size="medium" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="medium"
            onPress={handleAdd}
            disabled={!selectedWaterId}
          >
            Adicionar
          </Button>
        </View>
      </View>
    </RecipeModal>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  field: {
    marginBottom: 8,
  },
  info: {
    backgroundColor: COLORS.neutral.gray[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoText: {
    color: COLORS.text.secondary,
  },
  hint: {
    color: COLORS.text.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
})
