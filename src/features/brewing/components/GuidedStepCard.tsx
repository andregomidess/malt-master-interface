import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { BiCheck, BiCheckCircle } from 'react-icons/bi'

interface GuidedStepCardProps {
  stepOrder: number
  title: string
  description?: string
  details?: Array<{ label: string; value: string }>
  isCompleted: boolean
  isActive: boolean
  onToggleComplete: () => void
  onActivate?: () => void
}

export function GuidedStepCard({
  stepOrder,
  title,
  description,
  details,
  isCompleted,
  isActive,
  onToggleComplete,
  onActivate,
}: GuidedStepCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.containerActive,
        isCompleted && styles.containerCompleted,
      ]}
      onPress={onActivate}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View
            style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          >
            {isCompleted && <BiCheck size={16} color={COLORS.neutral.white} />}
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepNumber}>Passo {stepOrder}</Text>
            <Text
              style={[
                styles.title,
                isCompleted && styles.titleCompleted,
                isActive && styles.titleActive,
              ]}
            >
              {title}
            </Text>
          </View>
        </View>
        {isCompleted && (
          <BiCheckCircle size={24} color={COLORS.status.success} />
        )}
      </View>

      {description && <Text style={styles.description}>{description}</Text>}

      {details && details.length > 0 && (
        <View style={styles.details}>
          {details.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{detail.label}:</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={e => {
          e.stopPropagation()
          onToggleComplete()
        }}
      >
        <Text style={styles.toggleButtonText}>
          {isCompleted ? 'Marcar como não concluído' : 'Marcar como concluído'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    gap: 12,
  },
  containerActive: {
    borderColor: COLORS.brand.primary,
    backgroundColor: COLORS.neutral.gray[50],
  },
  containerCompleted: {
    borderColor: COLORS.status.success,
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.status.success,
    borderColor: COLORS.status.success,
  },
  stepInfo: {
    flex: 1,
    gap: 4,
  },
  stepNumber: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.text.secondary,
  },
  titleActive: {
    color: COLORS.brand.primary,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  details: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.neutral.gray[100],
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  toggleButtonText: {
    fontSize: 12,
    color: COLORS.brand.primary,
    fontWeight: '600',
  },
})
