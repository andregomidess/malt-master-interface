import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { HopAddition } from '../interfaces/Brewing'

interface HopScheduleProps {
  hops: HopAddition[]
}

export function HopSchedule({ hops }: HopScheduleProps) {
  if (hops.length === 0) {
    return (
      <Text style={styles.emptyText}>Nenhuma adição de lúpulo definida</Text>
    )
  }

  const sortedHops = [...hops].sort((a, b) => b.time - a.time)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tempo</Text>
        <Text style={styles.headerText}>Lúpulo</Text>
        <Text style={styles.headerText}>Quantidade</Text>
        <Text style={styles.headerText}>AA%</Text>
      </View>

      {sortedHops.map((hop, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.timeCell}>
            {hop.time === 0 ? 'Whirlpool' : `${hop.time} min`}
          </Text>
          <Text style={styles.nameCell}>{hop.name}</Text>
          <Text style={styles.amountCell}>
            {hop.amount} {hop.unit}
          </Text>
          <Text style={styles.aaCell}>
            {hop.alphaAcid ? `${hop.alphaAcid}%` : '—'}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.neutral.white
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light
  },
  headerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light
  },
  timeCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand.primary,
    textAlign: 'center'
  },
  nameCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center'
  },
  amountCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text.primary,
    textAlign: 'center'
  },
  aaCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingVertical: 20
  }
})

