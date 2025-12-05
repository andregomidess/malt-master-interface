import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe } from '../../context/RecipeContext'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus } from 'react-icons/bi'
import { AddYeastModal } from '../modals/AddYeastModal'

export const YeastsTab: React.FC = () => {
  const { recipe, addYeast, removeYeast } = useRecipe()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleAddYeast = () => {
    setIsModalVisible(true)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="body" style={styles.title}>
          Leveduras
        </Text>
        <Button variant="primary" size="small" onPress={handleAddYeast}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <BiPlus size={16} color={COLORS.neutral.white} />
            <Text variant="button" style={{ color: COLORS.neutral.white }}>
              Adicionar
            </Text>
          </View>
        </Button>
      </View>

      {recipe.yeasts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodySmall" style={styles.emptyText}>
            Nenhuma levedura adicionada ainda.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recipe.yeasts.map(yeast => (
            <View key={yeast.id} style={styles.item}>
              <View style={styles.itemContent}>
                <Text variant="body" style={styles.itemName}>
                  {yeast.yeast?.name || 'Levedura'}
                </Text>
                <View style={styles.itemDetails}>
                  {yeast.amount && (
                    <Text variant="bodySmall" style={styles.itemAmount}>
                      {yeast.amount} g
                    </Text>
                  )}
                  {yeast.stage && (
                    <Text variant="bodySmall" style={styles.itemStage}>
                      •{' '}
                      {yeast.stage === 'primary'
                        ? 'Primária'
                        : yeast.stage === 'secondary'
                          ? 'Secundária'
                          : 'Starter'}
                    </Text>
                  )}
                </View>
              </View>
              <Button
                variant="ghost"
                size="small"
                onPress={() => yeast.id && removeYeast(yeast.id)}
              >
                <Text variant="button" style={{ color: COLORS.status.error }}>
                  Remover
                </Text>
              </Button>
            </View>
          ))}
        </View>
      )}

      <AddYeastModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={addYeast}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.text.secondary,
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemAmount: {
    color: COLORS.text.secondary,
  },
  itemStage: {
    color: COLORS.text.secondary,
  },
})
