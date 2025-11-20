import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe } from '../../context/RecipeContext'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus } from 'react-icons/bi'
import { AddFermentableModal } from '../modals/AddFermentableModal'

export const FermentablesTab: React.FC = () => {
  const { recipe, addFermentable, removeFermentable } = useRecipe()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleAddFermentable = () => {
    setIsModalVisible(true)
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
                <Text variant="bodySmall" style={styles.itemAmount}>
                  {fermentable.amount} kg
                </Text>
              </View>
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
          ))}
        </View>
      )}

      <AddFermentableModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={addFermentable}
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
