import React, { useState, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { InputText } from '../../../../shared/components/InputText'
import { Select } from '../Select'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import { useHopsList } from '../../../hops/hooks/useHops'
import { RecipeHop } from '../../context/RecipeContext'

interface AddHopModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (hop: RecipeHop) => void
}

const stageOptions = [
  { value: 'boil', label: 'Fervura' },
  { value: 'whirlpool', label: 'Whirlpool' },
  { value: 'dry_hop', label: 'Dry Hop' },
]

export const AddHopModal: React.FC<AddHopModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { hops } = useHopsList()
  const [selectedHopId, setSelectedHopId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [boilTime, setBoilTime] = useState<string>('')
  const [stage, setStage] = useState<string>('boil')

  const hopOptions = useMemo(() => {
    return hops.map(h => ({
      value: h.id,
      label: h.name,
    }))
  }, [hops])

  const selectedHop = useMemo(() => {
    return hops.find(h => h.id === selectedHopId)
  }, [hops, selectedHopId])

  const handleAdd = () => {
    if (!selectedHopId || !amount) {
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    onAdd({
      hopId: selectedHopId,
      amount: amountNum,
      boilTime: boilTime ? parseFloat(boilTime) : undefined,
      stage: stage as 'boil' | 'whirlpool' | 'dry_hop',
      hop: selectedHop
        ? {
            name: selectedHop.name,
            alphaAcids: selectedHop.alphaAcids,
          }
        : undefined,
    })

    // Reset form
    setSelectedHopId('')
    setAmount('')
    setBoilTime('')
    setStage('boil')
    onClose()
  }

  const isValid = selectedHopId && amount && parseFloat(amount) > 0

  return (
    <RecipeModal visible={visible} onClose={onClose} title="Adicionar Lúpulo">
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Lúpulo *"
            placeholder="Selecione um lúpulo"
            value={selectedHopId}
            options={hopOptions}
            onSelect={setSelectedHopId}
            error={!selectedHopId}
            errorMessage={!selectedHopId ? 'Selecione um lúpulo' : undefined}
          />
        </View>

        {selectedHop && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoText}>
              Alfa Ácidos: {selectedHop.alphaAcids}%
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <InputText
            label="Quantidade (g) *"
            placeholder="Ex: 25"
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

        <View style={styles.field}>
          <Select
            label="Estágio *"
            placeholder="Selecione o estágio"
            value={stage}
            options={stageOptions}
            onSelect={setStage}
          />
        </View>

        {stage === 'boil' && (
          <View style={styles.field}>
            <InputText
              label="Tempo de Fervura (minutos)"
              placeholder="Ex: 60"
              value={boilTime}
              onChangeText={setBoilTime}
              keyboardType="numeric"
            />
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
