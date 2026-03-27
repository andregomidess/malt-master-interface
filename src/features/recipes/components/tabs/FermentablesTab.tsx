import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe } from '../../context/RecipeContext'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus } from 'react-icons/bi'
import { AddFermentableModal } from '../modals/AddFermentableModal'
import { FermentableUsageType } from '../../interfaces/Recipe'
import type { RecipeFermentable } from '../../context/RecipeContext'
import {
  RecipeQuantityStepper,
  FERMENTABLE_AMOUNT_STEP_KG,
  FERMENTABLE_AMOUNT_MIN_KG,
} from '../RecipeQuantityStepper'

const usageTypeLabel: Record<FermentableUsageType, string> = {
  [FermentableUsageType.MASH]: 'Mostura',
  [FermentableUsageType.STEEP]: 'Steep',
  [FermentableUsageType.BOIL]: 'Fervura',
  [FermentableUsageType.LATE_BOIL]: 'Fervura tardia',
  [FermentableUsageType.FERMENTATION]: 'Fermentação',
}

export const FermentablesTab: React.FC = () => {
  const { recipe, addFermentable, updateFermentable, removeFermentable } =
    useRecipe()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingFermentable, setEditingFermentable] = useState<
    (typeof recipe.fermentables)[0] | null
  >(null)

  const handleAddFermentable = () => {
    setEditingFermentable(null)
    setIsModalVisible(true)
  }

  const handleEditFermentable = (
    fermentable: (typeof recipe.fermentables)[0],
  ) => {
    setEditingFermentable(fermentable)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setEditingFermentable(null)
  }

  const handleSaveFermentable = (fermentable: RecipeFermentable) => {
    if (editingFermentable?.id) {
      updateFermentable(editingFermentable.id, fermentable)
    } else {
      addFermentable(fermentable)
    }
    handleCloseModal()
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="body" style={styles.title}>
          Fermentáveis
        </Text>
        <Button variant="primary" size="small" onPress={handleAddFermentable}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <BiPlus size={16} color={COLORS.neutral.white} />
            <Text variant="button" style={{ color: COLORS.neutral.white }}>
              Adicionar
            </Text>
          </View>
        </Button>
      </View>

      {recipe.fermentables.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodySmall" style={styles.emptyText}>
            Nenhum fermentável adicionado ainda.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recipe.fermentables.map(fermentable => (
            <View key={fermentable.id} style={styles.item}>
              <View style={styles.itemContent}>
                <Text variant="body" style={styles.itemName}>
                  {fermentable.fermentable?.name || 'Fermentável'}
                </Text>
                <View style={styles.amountRow}>
                  <RecipeQuantityStepper
                    value={Number(fermentable.amount) || 0}
                    unit="kg"
                    step={FERMENTABLE_AMOUNT_STEP_KG}
                    min={FERMENTABLE_AMOUNT_MIN_KG}
                    labelForA11y={
                      fermentable.fermentable?.name || 'Fermentável'
                    }
                    onChange={next => {
                      if (!fermentable.id) return
                      updateFermentable(fermentable.id, {
                        ...fermentable,
                        amount: next,
                      })
                    }}
                  />
                  {fermentable.usageType ? (
                    <Text variant="bodySmall" style={styles.itemUsage}>
                      {usageTypeLabel[fermentable.usageType]}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.itemActions}>
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() => handleEditFermentable(fermentable)}
                >
                  <Text
                    variant="button"
                    style={{ color: COLORS.status.warning }}
                  >
                    Editar
                  </Text>
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() =>
                    fermentable.id && removeFermentable(fermentable.id)
                  }
                >
                  <Text variant="button" style={{ color: COLORS.status.error }}>
                    Remover
                  </Text>
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}

      <AddFermentableModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAdd={handleSaveFermentable}
        initialValue={editingFermentable}
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
  amountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.neutral.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  itemContent: {
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemUsage: {
    color: COLORS.text.secondary,
  },
  itemName: {
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
})
