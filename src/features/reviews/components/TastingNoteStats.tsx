import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdRateReview } from 'react-icons/md'
import { TbStarFilled } from 'react-icons/tb'
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5'
import { TastingNoteStatistics } from '../interfaces/TastingNote'

interface TastingNoteStatsProps {
  statistics: TastingNoteStatistics | null
}

export const TastingNoteStats = ({ statistics }: TastingNoteStatsProps) => {
  if (!statistics) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Nenhuma estatística disponível ainda
        </Text>
      </View>
    )
  }

  const stats = [
    {
      id: 'total',
      label: 'Total de Avaliações',
      value: statistics.totalTastings.toString(),
      icon: MdRateReview,
      color: COLORS.brand.primary,
      bgColor: '#FEF3C7',
    },
    {
      id: 'average',
      label: 'Média Geral',
      value: statistics.averageOverall.toFixed(1),
      icon: TbStarFilled,
      color: '#D58300',
      bgColor: '#FEF3C7',
    },
    {
      id: 'highest',
      label: 'Maior Nota',
      value: statistics.highestScore.toFixed(1),
      icon: IoTrendingUp,
      color: COLORS.status.success,
      bgColor: '#D1FAE5',
    },
    {
      id: 'lowest',
      label: 'Menor Nota',
      value: statistics.lowestScore.toFixed(1),
      icon: IoTrendingDown,
      color: COLORS.status.error,
      bgColor: '#FEE2E2',
    },
  ]

  const categoryAverages = [
    {
      id: 'appearance',
      label: 'Aparência',
      value: statistics.averageAppearance,
      icon: '👁️',
      color: '#D58300',
    },
    {
      id: 'aroma',
      label: 'Aroma',
      value: statistics.averageAroma,
      icon: '👃',
      color: '#F59E0B',
    },
    {
      id: 'flavor',
      label: 'Sabor',
      value: statistics.averageFlavor,
      icon: '👅',
      color: '#FFA726',
    },
    {
      id: 'mouthfeel',
      label: 'Sensação',
      value: statistics.averageMouthfeel,
      icon: '🫧',
      color: '#E67E22',
    },
  ]

  return (
    <View style={styles.container}>
      {/* Estatísticas Principais */}
      <View style={styles.mainStatsContainer}>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <View key={stat.id} style={styles.statCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: stat.bgColor },
                ]}
              >
                <Icon size={24} color={stat.color} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          )
        })}
      </View>

      {/* Médias por Categoria */}
      <View style={styles.categoryAveragesContainer}>
        <Text style={styles.sectionTitle}>Médias por Categoria</Text>
        <View style={styles.categoryGrid}>
          {categoryAverages.map(category => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </View>
              <View style={styles.categoryValueContainer}>
                <Text style={[styles.categoryValue, { color: category.color }]}>
                  {category.value.toFixed(1)}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${(category.value / 10) * 100}%`,
                        backgroundColor: category.color,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  emptyContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  mainStatsContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  categoryAveragesContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: 200,
    gap: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  categoryValueContainer: {
    gap: 6,
  },
  categoryValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.neutral.gray[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
})
