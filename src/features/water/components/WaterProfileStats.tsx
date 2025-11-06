import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { IoWater } from 'react-icons/io5'
import { GiChemicalDrop } from 'react-icons/gi'
import { TbGrain, TbScale } from 'react-icons/tb'

interface WaterProfileStatsProps {
  totalProfiles: number
  balanced: number
  hoppy: number
  malty: number
}

export const WaterProfileStats = ({
  totalProfiles,
  balanced,
  hoppy,
  malty,
}: WaterProfileStatsProps) => {
  const stats = [
    {
      id: 'total',
      label: 'Total de Perfis',
      value: totalProfiles.toString(),
      icon: IoWater,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      id: 'balanced',
      label: 'Perfis Balanceados',
      value: balanced.toString(),
      icon: TbScale,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      id: 'hoppy',
      label: 'Perfis Lupulados',
      value: hoppy.toString(),
      icon: GiChemicalDrop,
      color: '#F97316',
      bgColor: '#FFEDD5',
    },
    {
      id: 'malty',
      label: 'Perfis Maltados',
      value: malty.toString(),
      icon: TbGrain,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
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
