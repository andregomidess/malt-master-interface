import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Select } from '../Select'
import { InputText } from '../../../../shared/components/InputText'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import { useYeastsLoadOptions } from '../../../yeast/hooks/useYeasts'
import { yeastsApi } from '../../../yeast/api/yeastsApi'
import type { Yeast } from '../../../yeast/interfaces/Yeast'
import { RecipeYeast } from '../../context/RecipeContext'

interface AddYeastModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (yeast: RecipeYeast) => void
  initialValue?: RecipeYeast | null
}

export const AddYeastModal: React.FC<AddYeastModalProps> = ({
  visible,
  onClose,
  onAdd,
  initialValue,
}) => {
  const loadYeastOptions = useYeastsLoadOptions()
  const [selectedYeastId, setSelectedYeastId] = useState<string>('')
  const [selectedYeast, setSelectedYeast] = useState<Yeast | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [stage, setStage] = useState<string>('primary')

  useEffect(() => {
    if (visible && initialValue) {
      setSelectedYeastId(initialValue.yeastId)
      setAmount(initialValue.amount != null ? String(initialValue.amount) : '')
      setStage(initialValue.stage ?? 'primary')
      yeastsApi
        .findById(initialValue.yeastId)
        .then(setSelectedYeast)
        .catch(() => setSelectedYeast(null))
    } else if (visible && !initialValue) {
      setSelectedYeastId('')
      setSelectedYeast(null)
      setAmount('')
      setStage('primary')
    }
  }, [visible, initialValue])

  const handleSelectYeast = async (id: string) => {
    setSelectedYeastId(id)
    const yeast = await yeastsApi.findById(id)
    setSelectedYeast(yeast)
  }

  const stageOptions = [
    { value: 'primary', label: 'Primária' },
    { value: 'secondary', label: 'Secundária' },
    { value: 'starter', label: 'Starter' },
  ]

  const handleAdd = () => {
    if (!selectedYeastId) {
      return
    }

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
      if (isNaN(attenuationNum)) {
        attenuationNum = undefined
      }
    }

    onAdd({
      yeastId: selectedYeastId,
      amount: amount ? parseFloat(amount) : undefined,
      stage: stage as 'primary' | 'secondary' | 'starter',
      yeast: selectedYeast
        ? {
            name: selectedYeast.name,
            attenuation: attenuationNum,
          }
        : undefined,
    })

    if (!initialValue) {
      setSelectedYeastId('')
      setSelectedYeast(null)
      setAmount('')
      setStage('primary')
    }
    onClose()
  }

  const isValid = !!selectedYeastId
  const isEditing = !!initialValue

  return (
    <RecipeModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Editar Levedura' : 'Adicionar Levedura'}
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Levedura *"
            placeholder="Selecione uma levedura"
            value={selectedYeastId}
            options={[]}
            loadOptions={loadYeastOptions}
            selectedLabel={selectedYeast?.name}
            onSelect={handleSelectYeast}
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
              {selectedYeast.attenuation ?? '—'}%
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <InputText
            label="Quantidade (pacotes) - Opcional"
            placeholder="Ex: 1"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
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
            {isEditing ? 'Salvar' : 'Adicionar'}
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
