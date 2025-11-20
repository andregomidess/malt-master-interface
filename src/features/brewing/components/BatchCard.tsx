import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import {
  Batch,
  formatDate,
  formatGravity,
  formatPercentage,
} from '../interfaces/Brewing'
import { BatchStatusBadge } from './BatchStatusBadge'
import { MdDelete } from 'react-icons/md'
import { BiPlay } from 'react-icons/bi'

interface BatchCardProps {
  batch: Batch
  onPress: () => void
  onDelete?: () => void
  onStartSession?: () => void
}

export function BatchCard({
  batch,
  onPress,
  onDelete,
  onStartSession,
}: BatchCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>
            {batch.name || batch.recipe?.name || 'Sem nome'}
          </Text>
          <Text style={styles.code}>{batch.batchCode || '—'}</Text>
        </View>
        <BatchStatusBadge status={batch.status} />
      </View>

      {batch.recipe && (
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeLabel}>Estilo:</Text>
          <Text style={styles.recipeValue}>
            {batch.recipe.styleName || batch.recipe.beerStyle?.name || '—'}
          </Text>
        </View>
      )}

      {batch.equipment && (
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeLabel}>Equipamento:</Text>
          <Text style={styles.recipeValue}>{batch.equipment.name}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Data Brassagem</Text>
          <Text style={styles.metricValue}>{formatDate(batch.brewDate)}</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Volume</Text>
          <Text style={styles.metricValue}>
            {batch.plannedVolume ? `${batch.plannedVolume} L` : '—'}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>OG Real</Text>
          <Text style={styles.metricValue}>
            {formatGravity(batch.actualOriginalGravity)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>FG Real</Text>
          <Text style={styles.metricValue}>
            {formatGravity(batch.actualFinalGravity)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>ABV Real</Text>
          <Text style={styles.metricValue}>
            {formatPercentage(batch.actualAbv)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Eficiência</Text>
          <Text style={styles.metricValue}>
            {formatPercentage(batch.actualEfficiency)}
          </Text>
        </View>
      </View>

      {batch.observations && (
        <>
          <View style={styles.divider} />
          <View style={styles.observations}>
            <Text style={styles.observationsLabel}>Observações:</Text>
            <Text style={styles.observationsText} numberOfLines={2}>
              {batch.observations}
            </Text>
          </View>
        </>
      )}

      <View style={styles.divider} />
      <View style={styles.actions}>
        {onStartSession && (
          <TouchableOpacity
            style={styles.sessionButton}
            onPress={e => {
              e.stopPropagation()
              onStartSession()
            }}
            activeOpacity={0.7}
          >
            <BiPlay size={16} color={COLORS.neutral.white} />
            <Text style={styles.sessionButtonText}>Iniciar Sessão</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={e => {
              e.stopPropagation()
              onDelete()
            }}
            activeOpacity={0.7}
          >
            <MdDelete size={16} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Deletar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  code: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  recipeInfo: {
    flexDirection: 'row',
    gap: 6,
  },
  recipeLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  recipeValue: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    minWidth: '30%',
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  observations: {
    gap: 4,
  },
  observationsLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  observationsText: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.brand.primary,
    flex: 1,
  },
  sessionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
})
