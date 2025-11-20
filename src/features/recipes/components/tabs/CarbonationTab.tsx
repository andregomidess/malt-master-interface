import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe } from '../../context/RecipeContext'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus } from 'react-icons/bi'
import { SelectCarbonationProfileModal } from '../modals/SelectCarbonationProfileModal'
import { RecipeCarbonation } from '../../context/RecipeContext'

export const CarbonationTab: React.FC = () => {
  const { recipe, updateRecipe } = useRecipe()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleSelectCarbonation = (carbonation: RecipeCarbonation) => {
    updateRecipe({ carbonation })
  }

  const handleRemoveCarbonation = () => {
    updateRecipe({ carbonation: null })
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="body" style={styles.title}>
          Carbonatação
        </Text>
        <Button
          variant="primary"
          size="small"
          onPress={() => setIsModalVisible(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <BiPlus size={16} color={COLORS.neutral.white} />
            <Text variant="button" style={{ color: COLORS.neutral.white }}>
              {recipe.carbonation?.carbonationProfileId
                ? 'Alterar'
                : 'Selecionar'}
            </Text>
          </View>
        </Button>
      </View>

      {!recipe.carbonation?.carbonationProfileId ? (
        <View style={styles.emptyState}>
          <Text variant="bodySmall" style={styles.emptyText}>
            Nenhum perfil de carbonatação selecionado ainda.
          </Text>
        </View>
      ) : (
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="body" style={styles.itemName}>
              {recipe.carbonation.carbonationProfile?.name ||
                'Perfil de Carbonatação'}
            </Text>
            {recipe.carbonation.carbonationProfile?.targetCO2Volumes && (
              <Text variant="bodySmall" style={styles.itemInfo}>
                CO2 Volumes:{' '}
                {recipe.carbonation.carbonationProfile.targetCO2Volumes}
              </Text>
            )}
          </View>
          <Button
            variant="ghost"
            size="small"
            onPress={handleRemoveCarbonation}
          >
            <Text variant="button" style={{ color: COLORS.status.error }}>
              Remover
            </Text>
          </Button>
        </View>
      )}

      <SelectCarbonationProfileModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSelectCarbonation}
        currentCarbonationProfileId={recipe.carbonation?.carbonationProfileId}
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
  itemInfo: {
    color: COLORS.text.secondary,
  },
})
