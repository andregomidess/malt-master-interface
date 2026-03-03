import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { InputText } from '../../../../shared/components/InputText'
import { Select } from '../Select'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import { useFermentablesLoadOptions } from '../../../fermentable/hooks/useFermentables'
import { fermentablesApi } from '../../../fermentable/api/fermentablesApi'
import type { Fermentable } from '../../../fermentable/interfaces/Fermentable'
import { RecipeFermentable } from '../../context/RecipeContext'

interface AddFermentableModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (fermentable: RecipeFermentable) => void
}

export const AddFermentableModal: React.FC<AddFermentableModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const loadFermentableOptions = useFermentablesLoadOptions()
  const [selectedFermentableId, setSelectedFermentableId] = useState<string>('')
  const [selectedFermentable, setSelectedFermentable] =
    useState<Fermentable | null>(null)
  const [amount, setAmount] = useState<string>('')

  const handleSelectFermentable = async (id: string) => {
    setSelectedFermentableId(id)
    const fermentable = await fermentablesApi.findById(id)
    setSelectedFermentable(fermentable)
  }

  const handleAdd = () => {
    if (!selectedFermentableId || !amount) {
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    onAdd({
      fermentableId: selectedFermentableId,
      amount: amountNum,
      fermentable: selectedFermentable
        ? {
            name: selectedFermentable.name,
            type: selectedFermentable.type,
            color: selectedFermentable.color || undefined,
            yield: selectedFermentable.yield || undefined,
            ppg: selectedFermentable.ppg || undefined,
            form: selectedFermentable.form,
          }
        : undefined,
    })

    // Reset form
    setSelectedFermentableId('')
    setSelectedFermentable(null)
    setAmount('')
    onClose()
  }

  const isValid = selectedFermentableId && amount && parseFloat(amount) > 0

  return (
    <RecipeModal
      visible={visible}
      onClose={onClose}
      title="Adicionar Fermentável"
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Fermentável *"
            placeholder="Selecione um fermentável"
            value={selectedFermentableId}
            options={[]}
            loadOptions={loadFermentableOptions}
            selectedLabel={selectedFermentable?.name}
            onSelect={handleSelectFermentable}
            error={!selectedFermentableId}
            errorMessage={
              !selectedFermentableId ? 'Selecione um fermentável' : undefined
            }
          />
        </View>

        {selectedFermentable && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoText}>
              Cor: {selectedFermentable.color ?? '—'} °L | Rendimento:{' '}
              {selectedFermentable.yield ?? '—'}%
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <InputText
            label="Quantidade (kg) *"
            placeholder="Ex: 4.5"
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
