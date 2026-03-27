import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe } from '../../context/RecipeContext'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus } from 'react-icons/bi'
import type { RecipeHop } from '../../context/RecipeContext'
import { AddHopModal } from '../modals/AddHopModal'
import {
  RecipeQuantityStepper,
  HOP_AMOUNT_STEP_G,
  HOP_AMOUNT_MIN_G,
} from '../RecipeQuantityStepper'

export const HopsTab: React.FC = () => {
  const { recipe, addHop, updateHop, removeHop } = useRecipe()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingHop, setEditingHop] = useState<(typeof recipe.hops)[0] | null>(
    null,
  )

  const handleAddHop = () => {
    setEditingHop(null)
    setIsModalVisible(true)
  }

  const handleEditHop = (hop: (typeof recipe.hops)[0]) => {
    setEditingHop(hop)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setEditingHop(null)
  }

  const handleSaveHop = (hop: RecipeHop) => {
    if (editingHop?.id) {
      updateHop(editingHop.id, hop)
    } else {
      addHop(hop)
    }
    handleCloseModal()
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
                <View style={styles.amountRow}>
                  <RecipeQuantityStepper
                    value={Number(hop.amount) || 0}
                    unit="g"
                    step={HOP_AMOUNT_STEP_G}
                    min={HOP_AMOUNT_MIN_G}
                    labelForA11y={hop.hop?.name || 'Lúpulo'}
                    onChange={next => {
                      if (!hop.id) return
                      updateHop(hop.id, {
                        ...hop,
                        amount: next,
                      })
                    }}
                  />
                  <Text variant="bodySmall" style={styles.itemMeta}>
                    {hop.boilTime != null ? `${hop.boilTime} min` : '— min'} ·{' '}
                    {hop.stage === 'whirlpool'
                      ? 'Whirlpool'
                      : hop.stage === 'dry_hop'
                        ? 'Dry hop'
                        : 'Fervura'}
                  </Text>
                </View>
              </View>
              <View style={styles.itemActions}>
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() => handleEditHop(hop)}
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
                  onPress={() => hop.id && removeHop(hop.id)}
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

      <AddHopModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAdd={handleSaveHop}
        initialValue={editingHop}
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
  itemName: {
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  itemMeta: {
    color: COLORS.text.secondary,
    flexShrink: 1,
  },
})
