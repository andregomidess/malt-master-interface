import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { GiChemicalDrop } from 'react-icons/gi'
import { BiPackage } from 'react-icons/bi'
import { BsSnow } from 'react-icons/bs'
import { FaBacteria } from 'react-icons/fa'

interface YeastStatsProps {
  totalYeasts: number
  ales: number
  lagers: number
  wildAndBacteria: number
}

export const YeastStats = ({
  totalYeasts,
  ales,
  lagers,
  wildAndBacteria,
}: YeastStatsProps) => {
  const stats = [
    {
      id: 'total',
      label: 'Total de Leveduras',
      value: totalYeasts.toString(),
      icon: BiPackage,
      color: COLORS.brand.primary,
      bgColor: '#FFE8D6',
    },
    {
      id: 'ales',
      label: 'Leveduras Ale',
      value: ales.toString(),
      icon: GiChemicalDrop,
      color: '#F97316',
      bgColor: '#FFEDD5',
    },
    {
      id: 'lagers',
      label: 'Leveduras Lager',
      value: lagers.toString(),
      icon: BsSnow,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      id: 'wild',
      label: 'Selvagens & Bactérias',
      value: wildAndBacteria.toString(),
      icon: FaBacteria,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
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

