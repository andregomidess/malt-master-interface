import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { GiWheat, GiHotSpices } from 'react-icons/gi'
import { BiPackage } from 'react-icons/bi'
import { BsDropletFill } from 'react-icons/bs'

interface FermentableStatsProps {
  totalFermentables: number
  baseMalts: number
  specialtyMalts: number
  sugarsAndAdjuncts: number
}

export const FermentableStats = ({
  totalFermentables,
  baseMalts,
  specialtyMalts,
  sugarsAndAdjuncts,
}: FermentableStatsProps) => {
  const stats = [
    {
      id: 'total',
      label: 'Total de Fermentáveis',
      value: totalFermentables.toString(),
      icon: BiPackage,
      color: COLORS.brand.primary,
      bgColor: '#FFE8D6',
    },
    {
      id: 'base',
      label: 'Maltes Base',
      value: baseMalts.toString(),
      icon: GiWheat,
      color: '#92400E',
      bgColor: '#FEF3C7',
    },
    {
      id: 'specialty',
      label: 'Maltes Especiais',
      value: specialtyMalts.toString(),
      icon: GiHotSpices,
      color: '#F97316',
      bgColor: '#FFEDD5',
    },
    {
      id: 'others',
      label: 'Açúcares & Adjuntos',
      value: sugarsAndAdjuncts.toString(),
      icon: BsDropletFill,
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

