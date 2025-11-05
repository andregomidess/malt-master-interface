import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { GiCookingPot, GiBarrel, GiWaterRecycling } from 'react-icons/gi'
import { BiPackage } from 'react-icons/bi'

interface EquipmentStatsProps {
  totalEquipments: number
  kettles: number
  fermenters: number
  chillers: number
}

export const EquipmentStats = ({
  totalEquipments,
  kettles,
  fermenters,
  chillers,
}: EquipmentStatsProps) => {
  const stats = [
    {
      id: 'total',
      label: 'Total de Equipamentos',
      value: totalEquipments.toString(),
      icon: BiPackage,
      color: COLORS.brand.primary,
      bgColor: '#FFE8D6',
    },
    {
      id: 'kettles',
      label: 'Panelas',
      value: kettles.toString(),
      icon: GiCookingPot,
      color: '#F97316',
      bgColor: '#FFEDD5',
    },
    {
      id: 'fermenters',
      label: 'Fermentadores',
      value: fermenters.toString(),
      icon: GiBarrel,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
    {
      id: 'chillers',
      label: 'Resfriadores',
      value: chillers.toString(),
      icon: GiWaterRecycling,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
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
