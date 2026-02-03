import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { Button } from '../../../shared/components/Button'
import { COLORS } from '../../../shared/styles/colors'
import { BiX } from 'react-icons/bi'

export interface MeasuredValue {
  id: string
  label: string
  value: number | null | undefined
  target?: number | null
  unit?: string
}

interface MeasuredValuesPanelProps {
  values: MeasuredValue[]
  onUpdate: (id: string, value: number | null) => void
  onSave?: () => void
}

function formatValue(val: number | null | undefined, unit?: string): string {
  if (val === null || val === undefined) return '—'
  return unit === 'SG' ? val.toFixed(3) : val.toString()
}

export function MeasuredValuesPanel({
  values,
  onUpdate,
  onSave,
}: MeasuredValuesPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<{
    id: string
    value: string
  } | null>(null)

  const handleEdit = (id: string, currentValue: number | null | undefined) => {
    setEditingValue({
      id,
      value:
        currentValue !== null && currentValue !== undefined
          ? currentValue.toString()
          : '',
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingValue) {
      const trimmed = editingValue.value.trim()
      const numValue = trimmed === '' ? null : parseFloat(trimmed)
      onUpdate(
        editingValue.id,
        numValue !== null && !isNaN(numValue) ? numValue : null,
      )
    }
    setIsModalOpen(false)
    setEditingValue(null)
    onSave?.()
  }

  const getDisplayText = (item: MeasuredValue): string => {
    const hasValue = item.value !== null && item.value !== undefined
    const hasTarget = item.target !== null && item.target !== undefined

    if (hasValue && hasTarget) {
      return `${formatValue(item.value, item.unit)} (alvo ${formatValue(item.target, item.unit)})`
    }
    if (hasValue) {
      return formatValue(item.value, item.unit)
    }
    if (hasTarget) {
      return `— (alvo ${formatValue(item.target, item.unit)})`
    }
    return '—'
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Medições do Lote</Text>
          <Text style={styles.subtitle}>
            Alvos vêm da receita. Preencha apenas os valores medidos no brew
            day.
          </Text>
        </View>
      </View>

      <View style={styles.valuesList}>
        {values.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.valueRow}
            onPress={() => handleEdit(item.id, item.value)}
          >
            <View style={styles.valueInfo}>
              <Text style={styles.valueLabel}>{item.label}</Text>
              <Text style={styles.valueUnit}>
                {item.unit ? `(${item.unit})` : ''}
              </Text>
            </View>
            <Text style={styles.valueDisplay}>{getDisplayText(item)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Valor Medido</Text>
              <TouchableOpacity
                onPress={() => setIsModalOpen(false)}
                style={styles.closeButton}
              >
                <BiX size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            {editingValue && (
              <View style={styles.modalBody}>
                <InputText
                  label="Valor medido"
                  placeholder="Digite o valor medido no brew day"
                  value={editingValue.value}
                  onChangeText={val =>
                    setEditingValue({ ...editingValue, value: val })
                  }
                  keyboardType="numeric"
                />

                <View style={styles.modalActions}>
                  <Button
                    variant="ghost"
                    size="medium"
                    onPress={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" size="medium" onPress={handleSave}>
                    Salvar
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    lineHeight: 16,
  },
  valuesList: {
    gap: 12,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.neutral.gray[50],
    borderRadius: 8,
  },
  valueInfo: {
    flex: 1,
    gap: 4,
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  valueUnit: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  valueDisplay: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.brand.primary,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    padding: 24,
    gap: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    gap: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
})
