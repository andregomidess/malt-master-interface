import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import {
  BatchStatus,
  BatchStatusLabels,
  BatchStatusColors
} from '../interfaces/Brewing'

interface BatchStatusBadgeProps {
  status: BatchStatus
}

export function BatchStatusBadge({ status }: BatchStatusBadgeProps) {
  const label = BatchStatusLabels[status]
  const color = BatchStatusColors[status]

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}22`,
          borderColor: `${color}55`
        }
      ]}
    >
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1
  },
  text: {
    fontSize: 12,
    fontWeight: '600'
  }
})

