import React from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'

interface ScaleRecipeModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
}

export const ScaleRecipeModal: React.FC<ScaleRecipeModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onCancel()
    onClose()
  }

  return (
    <RecipeModal visible={visible} onClose={onClose} title="Redimensionar?">
      <View style={styles.content}>
        <Text variant="body" style={styles.message}>
          Deseja redimensionar a receita para o novo equipamento? Os volumes e
          ingredientes serão ajustados automaticamente.
        </Text>
        <View style={styles.actions}>
          <Button
            variant="outline"
            size="medium"
            onPress={handleCancel}
            style={styles.button}
          >
            Não
          </Button>
          <Button
            variant="primary"
            size="medium"
            onPress={handleConfirm}
            style={styles.button}
          >
            Sim
          </Button>
        </View>
      </View>
    </RecipeModal>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  message: {
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
})
