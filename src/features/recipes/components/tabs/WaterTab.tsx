import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe } from '../../context/RecipeContext'
import { useRecipeCalculations } from '../../hooks/useRecipeCalculations'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus } from 'react-icons/bi'
import { AddWaterModal } from '../modals/AddWaterModal'

function getDisplayVolume(
  index: number,
  total: number,
  strikeWater: number | null,
  spargeWater: number | null,
  totalWater: number | null,
  manualAmount: number,
): string {
  if (manualAmount > 0) return `${manualAmount} L`
  if (totalWater == null) return '—'
  if (total === 1) return `~${totalWater} L (calculado)`
  if (total === 2) {
    if (index === 0 && strikeWater != null) return `~${strikeWater} L (mostura)`
    if (index === 1 && spargeWater != null) return `~${spargeWater} L (lavagem)`
  }
  return `~${totalWater} L`
}

export const WaterTab: React.FC = () => {
  const { recipe, addWater, removeWater } = useRecipe()
  const calculations = useRecipeCalculations()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleAddWater = () => {
    setIsModalVisible(true)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="body" style={styles.title}>
          Água
        </Text>
        <Button variant="primary" size="small" onPress={handleAddWater}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <BiPlus size={16} color={COLORS.neutral.white} />
            <Text variant="button" style={{ color: COLORS.neutral.white }}>
              Adicionar
            </Text>
          </View>
        </Button>
      </View>

      {recipe.waters.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodySmall" style={styles.emptyText}>
            Nenhuma água adicionada ainda.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recipe.waters.map((water, index) => (
            <View key={water.id} style={styles.item}>
              <View style={styles.itemContent}>
                <Text variant="body" style={styles.itemName}>
                  {water.water?.name || 'Água'}
                </Text>
                <Text variant="bodySmall" style={styles.itemAmount}>
                  {getDisplayVolume(
                    index,
                    recipe.waters.length,
                    calculations.strikeWaterVolume ?? null,
                    calculations.spargeWaterVolume ?? null,
                    calculations.totalWaterVolume ?? null,
                    water.amount,
                  )}
                </Text>
              </View>
              <Button
                variant="ghost"
                size="small"
                onPress={() => water.id && removeWater(water.id)}
              >
                <Text variant="button" style={{ color: COLORS.status.error }}>
                  Remover
                </Text>
              </Button>
            </View>
          ))}
        </View>
      )}

      <AddWaterModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={addWater}
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
  itemAmount: {
    color: COLORS.text.secondary,
  },
})
