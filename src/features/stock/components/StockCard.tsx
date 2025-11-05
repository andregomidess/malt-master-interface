import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit } from 'react-icons/md'
import {
  StockItem,
  InventoryItemType,
  FermentableInventoryItem,
  HopInventoryItem,
  YeastInventoryItem,
} from '../data/mockStockData'

interface StockCardProps {
  item: StockItem
  onEdit?: () => void
}

export const StockCard = ({ item, onEdit }: StockCardProps) => {
  const defaultImageUrl =
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=100&h=100&fit=crop'

  const typeConfig = {
    [InventoryItemType.FERMENTABLE]: {
      label: 'Fermentável',
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    [InventoryItemType.HOP]: {
      label: 'Lúpulo',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    [InventoryItemType.YEAST]: {
      label: 'Levedura',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
  }

  const config = typeConfig[item.type]

  const getExpiryBadge = () => {
    if (item.isExpired) {
      return { label: 'Vencido', color: '#EF4444', bgColor: '#FEE2E2' }
    }
    if (item.isNearExpiry && item.daysUntilExpiry !== null) {
      return {
        label: `Vence em ${item.daysUntilExpiry} dias`,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
      }
    }
    return { label: 'Fresco', color: '#10B981', bgColor: '#D1FAE5' }
  }

  const expiryBadge = getExpiryBadge()

  const getSpecialAlerts = () => {
    const alerts: { label: string; color: string; bgColor: string }[] = []

    if (item.type === InventoryItemType.HOP) {
      const hopItem = item as HopInventoryItem
      if (!hopItem.isStillFresh) {
        alerts.push({
          label: 'Não está mais fresco',
          color: '#EF4444',
          bgColor: '#FEE2E2',
        })
      }
    }

    if (item.type === InventoryItemType.YEAST) {
      const yeastItem = item as YeastInventoryItem
      if (yeastItem.needsStarter) {
        alerts.push({
          label: 'Precisa Starter',
          color: '#F59E0B',
          bgColor: '#FEF3C7',
        })
      }
    }

    if (item.type === InventoryItemType.FERMENTABLE) {
      const fermentableItem = item as FermentableInventoryItem
      if (!fermentableItem.isQualityAcceptable) {
        alerts.push({
          label: 'Baixa Qualidade',
          color: '#EF4444',
          bgColor: '#FEE2E2',
        })
      }
    }

    return alerts
  }

  const specialAlerts = getSpecialAlerts()

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: item.imageUrl || defaultImageUrl }}
          style={styles.image}
        />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
              <Text style={[styles.badgeText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Quantidade:</Text>
          <Text style={styles.value}>
            {item.quantity} {item.unit}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Valor Total:</Text>
          <Text style={styles.value}>R$ {item.totalValue.toFixed(2)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <View
            style={[styles.badge, { backgroundColor: expiryBadge.bgColor }]}
          >
            <Text style={[styles.badgeText, { color: expiryBadge.color }]}>
              {expiryBadge.label}
            </Text>
          </View>
        </View>

        {specialAlerts.length > 0 && (
          <View style={styles.alertsContainer}>
            {specialAlerts.map((alert, index) => (
              <View
                key={index}
                style={[styles.badge, { backgroundColor: alert.bgColor }]}
              >
                <Text style={[styles.badgeText, { color: alert.color }]}>
                  {alert.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {item.type === InventoryItemType.HOP && (
          <View style={styles.specificInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Alfa Ácidos Atuais:</Text>
              <Text style={styles.value}>
                {(item as HopInventoryItem).currentAlphaAcids?.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Armazenamento:</Text>
              <Text style={styles.value}>
                {(item as HopInventoryItem).storageCondition || 'N/A'}
              </Text>
            </View>
          </View>
        )}

        {item.type === InventoryItemType.YEAST && (
          <View style={styles.specificInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Viabilidade Atual:</Text>
              <Text style={styles.value}>
                {(item as YeastInventoryItem).currentViability?.toFixed(1)}%
              </Text>
            </View>
          </View>
        )}

        {item.type === InventoryItemType.FERMENTABLE && (
          <View style={styles.specificInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Potencial de Extração:</Text>
              <Text style={styles.value}>
                {(item as FermentableInventoryItem).extractPotential}%
              </Text>
            </View>
            {(item as FermentableInventoryItem).lotNumber && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Lote:</Text>
                <Text style={styles.value}>
                  {(item as FermentableInventoryItem).lotNumber}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <MdEdit size={16} color={COLORS.text.secondary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    overflow: 'hidden',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    gap: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neutral.gray[200],
  },
  headerContent: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'column',
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  alertsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  specificInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
})
