import { View, StyleSheet } from 'react-native'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { Text } from './Typography'
import { COLORS } from '../styles/colors'

interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  emptyMessage?: string
}

export function Table<T>({
  data,
  columns,
  emptyMessage = 'Nenhum dado disponível',
}: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <View style={styles.container}>
      <View style={styles.thead}>
        {table.getHeaderGroups().map(headerGroup => (
          <View key={headerGroup.id} style={styles.tr}>
            {headerGroup.headers.map(header => (
              <View
                key={header.id}
                style={[styles.th, { flex: header.getSize() / 100 }]}
              >
                <Text style={styles.thText}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.tbody}>
        {data.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          table.getRowModel().rows.map(row => (
            <View key={row.id} style={styles.tr}>
              {row.getVisibleCells().map(cell => (
                <View
                  key={cell.id}
                  style={[styles.td, { flex: cell.column.getSize() / 100 }]}
                >
                  <Text style={styles.tdText}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: COLORS.neutral.white,
    overflow: 'hidden',
    width: '100%',
  },
  thead: {
    backgroundColor: COLORS.neutral.gray[100],
  },
  tbody: {
    backgroundColor: COLORS.neutral.white,
  },
  tr: {
    flexDirection: 'row',
    minHeight: 48,
    width: '100%',
  },
  th: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  thText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
    textTransform: 'uppercase',
  },
  td: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  tdText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
})
