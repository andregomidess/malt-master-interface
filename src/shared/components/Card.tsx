import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { ReactNode } from 'react'
import { Text, Heading } from './Typography'
import { COLORS } from '../styles/colors'

interface CardProps {
  children: ReactNode
  style?: ViewStyle
  onPress?: () => void
}

export const Card = ({ children, style, onPress }: CardProps) => {
  const Component = onPress ? TouchableOpacity : View

  return (
    <Component
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  )
}

interface ActionCardProps {
  title: string
  description: string
  icon: ReactNode
  onPress?: () => void
}

export const ActionCard = ({
  title,
  description,
  icon,
  onPress,
}: ActionCardProps) => {
  return (
    <Card onPress={onPress} style={styles.actionCard}>
      <View style={styles.actionCardIcon}>{icon}</View>

      <View style={styles.actionCardContent}>
        <View style={styles.actionCardHeader}>
          <Text variant="body" style={styles.actionCardTitle}>
            {title}
          </Text>
        </View>
        <Text style={styles.actionCardDescription}>{description}</Text>
      </View>
    </Card>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
}

export const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <Card style={styles.statCard}>
      <View style={styles.statCardIcon}>{icon}</View>

      <View style={styles.statCardContent}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Heading variant="h3" style={styles.statCardValue}>
          {value}
        </Heading>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  actionCard: {
    alignItems: 'flex-start',
    gap: 6,
  },
  actionCardIcon: {},
  actionCardContent: {
    flex: 1,
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  actionCardDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: '100%',
  },
  statCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.neutral.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardContent: {
    flex: 1,
    gap: 4,
  },
  statCardTitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  statCardTrend: {
    marginTop: 4,
  },
  statCardTrendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendUp: {
    color: COLORS.status.success,
  },
  trendDown: {
    color: COLORS.status.error,
  },
})
