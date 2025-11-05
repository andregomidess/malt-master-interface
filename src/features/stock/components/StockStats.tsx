import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import {
  BiPackage,
  BiDollarCircle,
  BiTime,
  BiErrorCircle,
} from 'react-icons/bi'

interface StockStatsProps {
  totalItems: number
  totalValue: number
  itemsNearExpiry: number
  itemsExpired: number
}

export const StockStats = ({
  totalItems,
  totalValue,
  itemsNearExpiry,
  itemsExpired,
}: StockStatsProps) => {
  const stats = [
    {
      id: 'total',
      label: 'Total de Itens',
      value: totalItems.toString(),
      icon: BiPackage,
      color: COLORS.brand.primary,
      bgColor: '#FFE8D6',
    },
    {
      id: 'value',
      label: 'Valor Total',
      value: `R$ ${totalValue.toFixed(2)}`,
      icon: BiDollarCircle,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      id: 'near-expiry',
      label: 'Próximos ao Vencimento',
      value: itemsNearExpiry.toString(),
      icon: BiTime,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      id: 'expired',
      label: 'Vencidos',
      value: itemsExpired.toString(),
      icon: BiErrorCircle,
      color: '#EF4444',
      bgColor: '#FEE2E2',
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
