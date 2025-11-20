import React, { useState, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Select } from '../Select'
import { InputText } from '../../../../shared/components/InputText'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import { useYeastsList } from '../../../yeast/hooks/useYeasts'
import { RecipeYeast } from '../../context/RecipeContext'

interface AddYeastModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (yeast: RecipeYeast) => void
}

export const AddYeastModal: React.FC<AddYeastModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { yeasts } = useYeastsList()
  const [selectedYeastId, setSelectedYeastId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const yeastOptions = useMemo(() => {
    return yeasts.map(y => ({
      value: y.id,
      label: y.name,
    }))
  }, [yeasts])

  const selectedYeast = useMemo(() => {
    return yeasts.find(y => y.id === selectedYeastId)
  }, [yeasts, selectedYeastId])

  const handleAdd = () => {
    if (!selectedYeastId) {
      return
    }

    // Converter atenuação para número se necessário
    let attenuationNum: number | undefined = undefined
    if (
      selectedYeast?.attenuation !== undefined &&
      selectedYeast?.attenuation !== null
    ) {
      if (typeof selectedYeast.attenuation === 'string') {
        attenuationNum = parseFloat(selectedYeast.attenuation)
      } else {
        attenuationNum = selectedYeast.attenuation
      }
      // Garantir que não seja NaN
      if (isNaN(attenuationNum)) {
        attenuationNum = undefined
      }
    }

    onAdd({
      yeastId: selectedYeastId,
      amount: amount ? parseFloat(amount) : undefined,
      yeast: selectedYeast
        ? {
            name: selectedYeast.name,
            attenuation: attenuationNum,
          }
        : undefined,
    })

    // Reset form
    setSelectedYeastId('')
    setAmount('')
    onClose()
  }

  const isValid = !!selectedYeastId

  return (
    <RecipeModal visible={visible} onClose={onClose} title="Adicionar Levedura">
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Levedura *"
            placeholder="Selecione uma levedura"
            value={selectedYeastId}
            options={yeastOptions}
            onSelect={setSelectedYeastId}
            error={!selectedYeastId}
            errorMessage={
              !selectedYeastId ? 'Selecione uma levedura' : undefined
            }
          />
        </View>

        {selectedYeast && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoText}>
              Tipo: {selectedYeast.type} | Atenuação:{' '}
              {selectedYeast.attenuation || '—'}%
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <InputText
            label="Quantidade (g) - Opcional"
            placeholder="Ex: 11"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
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
