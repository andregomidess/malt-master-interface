import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe } from '../../context/RecipeContext'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus } from 'react-icons/bi'
import { AddHopModal } from '../modals/AddHopModal'

export const HopsTab: React.FC = () => {
  const { recipe, addHop, removeHop } = useRecipe()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleAddHop = () => {
    setIsModalVisible(true)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="body" style={styles.title}>
          Lúpulos
        </Text>
        <Button variant="primary" size="small" onPress={handleAddHop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <BiPlus size={16} color={COLORS.neutral.white} />
            <Text variant="button" style={{ color: COLORS.neutral.white }}>
              Adicionar
            </Text>
          </View>
        </Button>
      </View>

      {recipe.hops.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodySmall" style={styles.emptyText}>
            Nenhum lúpulo adicionado ainda.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recipe.hops.map(hop => (
            <View key={hop.id} style={styles.item}>
              <View style={styles.itemContent}>
                <Text variant="body" style={styles.itemName}>
                  {hop.hop?.name || 'Lúpulo'}
                </Text>
                <Text variant="bodySmall" style={styles.itemAmount}>
                  {hop.amount} g - {hop.boilTime || 0} min
                </Text>
              </View>
              <Button
                variant="ghost"
                size="small"
                onPress={() => hop.id && removeHop(hop.id)}
              >
                <Text variant="button" style={{ color: COLORS.status.error }}>
                  Remover
                </Text>
              </Button>
            </View>
          ))}
        </View>
      )}

      <AddHopModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={addHop}
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
