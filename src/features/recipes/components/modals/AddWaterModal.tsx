import React, { useState, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Select } from '../Select'
import { InputText } from '../../../../shared/components/InputText'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import { useWaterProfilesList } from '../../../water/hooks/useWaterProfiles'
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
  const { waterProfiles } = useWaterProfilesList()
  const [selectedWaterId, setSelectedWaterId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const waterOptions = useMemo(() => {
    return waterProfiles.map(w => ({
      value: w.id,
      label: w.name,
    }))
  }, [waterProfiles])

  const selectedWater = useMemo(() => {
    return waterProfiles.find(w => w.id === selectedWaterId)
  }, [waterProfiles, selectedWaterId])

  const handleAdd = () => {
    if (!selectedWaterId || !amount) {
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    onAdd({
      waterId: selectedWaterId,
      amount: amountNum,
      water: selectedWater
        ? {
            name: selectedWater.name,
          }
        : undefined,
    })

    // Reset form
    setSelectedWaterId('')
    setAmount('')
    onClose()
  }

  const isValid = selectedWaterId && amount && parseFloat(amount) > 0

  return (
    <RecipeModal visible={visible} onClose={onClose} title="Adicionar Água">
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Perfil de Água *"
            placeholder="Selecione um perfil de água"
            value={selectedWaterId}
            options={waterOptions}
            onSelect={setSelectedWaterId}
            error={!selectedWaterId}
            errorMessage={
              !selectedWaterId ? 'Selecione um perfil de água' : undefined
            }
          />
        </View>

        {selectedWater && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoText}>
              Origem: {selectedWater.origin || '—'}
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <InputText
            label="Quantidade (L) *"
            placeholder="Ex: 20"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            error={!amount || parseFloat(amount) <= 0}
            errorMessage={
              !amount || parseFloat(amount) <= 0
                ? 'Quantidade deve ser maior que zero'
                : undefined
            }
          />
        </View>

        <View style={styles.actions}>
          <Button variant="ghost" size="medium" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="medium"
            onPress={handleAdd}
            disabled={!isValid}
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
})
