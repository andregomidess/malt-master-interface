import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { GiBeerBottle } from 'react-icons/gi'
import { MdLocalBar } from 'react-icons/md'
import { IoWater } from 'react-icons/io5'
import { BiWorld } from 'react-icons/bi'

interface BeerStyleStatsProps {
  total: number
  ales: number
  lagers: number
  sours: number
}

export const BeerStyleStats = ({
  total,
  ales,
  lagers,
  sours,
}: BeerStyleStatsProps) => {
  const stats = [
    {
      id: 'total',
      label: 'Total de Estilos',
      value: total.toString(),
      icon: GiBeerBottle,
      color: COLORS.brand.primary,
      bgColor: '#FEF3C7',
    },
    {
      id: 'ales',
      label: 'Estilos Ale',
      value: ales.toString(),
      icon: MdLocalBar,
      color: '#D97706',
      bgColor: '#FFEDD5',
    },
    {
      id: 'lagers',
      label: 'Estilos Lager',
      value: lagers.toString(),
      icon: IoWater,
      bgColor: '#DBEAFE',
      color: '#3B82F6',
    },
    {
      id: 'sours',
      label: 'Estilos Selvagens',
      value: sours.toString(),
      icon: BiWorld,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
  ]

  return (
    <View style={styles.container}>
      {stats.map(stat => {
        const Icon = stat.icon
        return (
          <View key={stat.id} style={styles.statCard}>
            <View
              style={[styles.iconContainer, { backgroundColor: stat.bgColor }]}
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
  )
}

const styles = StyleSheet.create({
  container: {
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
})

