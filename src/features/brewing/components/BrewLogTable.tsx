import { View, StyleSheet, ScrollView } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { BrewLog } from '../interfaces/Brewing'

interface BrewLogTableProps {
  logs: BrewLog[]
}

export function BrewLogTable({ logs }: BrewLogTableProps) {
  if (logs.length === 0) {
    return (
      <Text style={styles.emptyText}>Nenhuma medição registrada ainda</Text>
    )
  }

  const sortedLogs = [...logs].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={[styles.headerCell, styles.dateCell]}>Data/Hora</Text>
          <Text style={[styles.headerCell, styles.gravityCell]}>SG</Text>
          <Text style={[styles.headerCell, styles.tempCell]}>Temp</Text>
          <Text style={[styles.headerCell, styles.phCell]}>pH</Text>
          <Text style={[styles.headerCell, styles.eventCell]}>Evento</Text>
          <Text style={[styles.headerCell, styles.noteCell]}>Nota</Text>
        </View>

        {sortedLogs.map(log => (
          <View key={log.id} style={styles.row}>
            <Text style={[styles.cell, styles.dateCell]}>
              {new Date(log.timestamp).toLocaleString('pt-BR')}
            </Text>
            <Text style={[styles.cell, styles.gravityCell]}>
              {log.gravity?.toFixed(3) || '—'}
            </Text>
            <Text style={[styles.cell, styles.tempCell]}>
              {log.temperature ? `${log.temperature}°C` : '—'}
            </Text>
            <Text style={[styles.cell, styles.phCell]}>
              {log.ph?.toFixed(2) || '—'}
            </Text>
            <Text style={[styles.cell, styles.eventCell]}>
              {log.event || '—'}
            </Text>
            <Text style={[styles.cell, styles.noteCell]} numberOfLines={2}>
              {log.note || '—'}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  table: {
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
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.primary
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light
  },
  cell: {
    fontSize: 13,
    color: COLORS.text.primary
  },
  dateCell: {
    width: 160
  },
  gravityCell: {
    width: 80,
    fontWeight: '700'
  },
  tempCell: {
    width: 70
  },
  phCell: {
    width: 60
  },
  eventCell: {
    width: 100
  },
  noteCell: {
    width: 200
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingVertical: 20
  }
})

