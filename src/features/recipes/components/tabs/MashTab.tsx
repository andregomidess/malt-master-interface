import React, { useState, useMemo } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRecipe, RecipeMash } from '../../context/RecipeContext'
import { Text } from '../../../../shared/components/Typography'
import { Button } from '../../../../shared/components/Button'
import { COLORS } from '../../../../shared/styles/colors'
import { BiPlus, BiCheckCircle, BiErrorCircle } from 'react-icons/bi'
import { SelectMashProfileModal } from '../modals/SelectMashProfileModal'
import { getBrewReadinessMessages } from '../../utils/recipeDraft'

export const MashTab: React.FC = () => {
  const { recipe, updateRecipe } = useRecipe()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const brewReadinessIssues = useMemo(
    () => getBrewReadinessMessages(recipe),
    [recipe],
  )
  const brewReadinessOk = brewReadinessIssues.length === 0

  const handleSelectMash = (mash: RecipeMash) => {
    updateRecipe({ mash })
  }

  const handleRemoveMash = () => {
    updateRecipe({ mash: null })
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="body" style={styles.title}>
          Mostura
        </Text>
        <Button
          variant="primary"
          size="small"
          onPress={() => setIsModalVisible(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <BiPlus size={16} color={COLORS.neutral.white} />
            <Text variant="button" style={{ color: COLORS.neutral.white }}>
              {recipe.mash?.mashProfileId ? 'Alterar' : 'Selecionar'}
            </Text>
          </View>
        </Button>
      </View>

      {!recipe.mash?.mashProfileId ? (
        <View style={styles.emptyState}>
          <Text variant="bodySmall" style={styles.emptyText}>
            Nenhum perfil de mostura selecionado ainda.
          </Text>
        </View>
      ) : (
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="body" style={styles.itemName}>
              {recipe.mash.mashProfile?.name || 'Perfil de Mostura'}
            </Text>
            {recipe.mash.mashProfile?.estimatedEfficiency && (
              <Text variant="bodySmall" style={styles.itemInfo}>
                Eficiência Estimada:{' '}
                {recipe.mash.mashProfile.estimatedEfficiency}%
              </Text>
            )}
          </View>
          <Button variant="ghost" size="small" onPress={handleRemoveMash}>
            <Text variant="button" style={{ color: COLORS.status.error }}>
              Remover
            </Text>
          </Button>
        </View>
      )}

      <SelectMashProfileModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSelectMash}
        currentMashProfileId={recipe.mash?.mashProfileId}
      />

      <View style={styles.brewReadinessCard}>
        <Text variant="body" style={styles.brewReadinessTitle}>
          Prontidão para brassagem
        </Text>
        <Text variant="bodySmall" style={styles.brewReadinessHint}>
          Use esta verificação antes de iniciar uma brassagem no sistema. Lúpulo
          e levedura são opcionais (ex.: fermentação espontânea ou receita só de
          malte).
        </Text>
        {brewReadinessOk ? (
          <View style={styles.brewReadinessOkRow}>
            <BiCheckCircle size={20} color={COLORS.status.success} />
            <Text variant="bodySmall" style={styles.brewReadinessOkText}>
              Os dados mínimos para planejar a brassagem estão preenchidos.
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.brewReadinessErrRow}>
              <BiErrorCircle size={20} color={COLORS.status.warning} />
              <Text variant="bodySmall" style={styles.brewReadinessErrLead}>
                Para brassar com segurança no app, ainda falta informação sobre:
              </Text>
            </View>
            {brewReadinessIssues.map(msg => (
              <Text key={msg} variant="bodySmall" style={styles.brewReadinessBullet}>
                • {msg}
              </Text>
            ))}
          </View>
        )}
      </View>
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
  brewReadinessCard: {
    marginTop: 28,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.neutral.gray[50],
  },
  brewReadinessTitle: {
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  brewReadinessHint: {
    color: COLORS.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  brewReadinessOkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  brewReadinessOkText: {
    flex: 1,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  brewReadinessErrRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  brewReadinessErrLead: {
    flex: 1,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  brewReadinessBullet: {
    color: COLORS.text.secondary,
    marginLeft: 8,
    marginTop: 4,
    lineHeight: 20,
  },
})
