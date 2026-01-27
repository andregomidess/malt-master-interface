import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Heading } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import {
  StyleValidationResult,
  getValidationTooltip,
} from '../utils/validateStyleRanges'

type ValueFormat = 'gravity' | 'percent' | 'integer' | 'decimal'

function formatValue(
  value: number | null | undefined,
  format: ValueFormat,
): string {
  if (value === null || value === undefined) return '—'
  switch (format) {
    case 'gravity':
      return value.toFixed(3)
    case 'percent':
      return `${value.toFixed(1)} %`
    case 'integer':
      return String(Math.round(value))
    case 'decimal':
      return value.toFixed(1)
    default:
      return String(value)
  }
}

function formatTick(v: number, f: ValueFormat): string {
  switch (f) {
    case 'gravity':
      return v.toFixed(3)
    case 'percent':
      return v.toFixed(1)
    case 'integer':
      return String(Math.round(v))
    case 'decimal':
      return v.toFixed(1)
    default:
      return String(v)
  }
}

export interface StyleRangeBarProps {
  label: string
  validation: StyleValidationResult | null
  valueFormat?: ValueFormat
  cardBgColor?: string
  containerStyle?: object
}

export const StyleRangeBar: React.FC<StyleRangeBarProps> = ({
  label,
  validation,
  valueFormat = 'decimal',
  cardBgColor,
  containerStyle,
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const value = validation?.value
  const min = validation?.min
  const max = validation?.max
  const isValid = validation?.isValid
  const hasRange = min != null && max != null
  const hasValue = value != null

  if (!hasRange || !hasValue) {
    return (
      <View
        style={[
          styles.card,
          cardBgColor && { backgroundColor: cardBgColor },
          containerStyle,
        ]}
      >
        <Text variant="caption" style={styles.label}>
          {label}
        </Text>
        <Heading variant="h4" style={styles.value}>
          {formatValue(value, valueFormat)}
        </Heading>
        {validation && validation.range !== '—' && (
          <Text variant="caption" style={styles.range}>
            Estilo: {validation.range}
          </Text>
        )}
      </View>
    )
  }

  const span = Math.max(max - min, 0.001)
  const margin = span * 0.15
  let rangeLow = min - margin
  let rangeHigh = max + margin
  if (value < rangeLow) rangeLow = value - margin
  if (value > rangeHigh) rangeHigh = value + margin
  const totalRange = rangeHigh - rangeLow

  const toPercent = (v: number) =>
    Math.max(0, Math.min(100, ((v - rangeLow) / totalRange) * 100))

  const posPercent = toPercent(value)
  const inRangeStart = toPercent(min)
  const inRangeWidth = toPercent(max) - inRangeStart

  const markerColor =
    isValid === true
      ? COLORS.status.info
      : isValid === false
        ? COLORS.status.error
        : COLORS.text.tertiary

  const tooltipContent = validation ? getValidationTooltip(validation) : ''
  const showTooltip = isValid === false && tooltipContent !== ''

  const cardContent = (
    <View
      style={[styles.card, cardBgColor && { backgroundColor: cardBgColor }]}
    >
      <View style={styles.header}>
        <Text variant="caption" style={styles.label}>
          {label}
        </Text>
        <Text variant="caption" style={styles.valueInline}>
          {formatValue(value, valueFormat)}
        </Text>
      </View>

      <View style={styles.barRow}>
        <Text variant="caption" style={styles.tick} numberOfLines={1}>
          {formatTick(min, valueFormat)}
        </Text>
        <View style={styles.trackWrapper}>
          <View style={styles.track}>
            <View
              style={[
                styles.rangeSegment,
                {
                  left: `${inRangeStart}%`,
                  width: `${Math.max(inRangeWidth, 2)}%`,
                },
              ]}
            />
            <View
              style={[
                styles.marker,
                {
                  left: `${posPercent}%`,
                  backgroundColor: markerColor,
                },
              ]}
            />
          </View>
        </View>
        <Text
          variant="caption"
          style={[styles.tick, styles.tickRight]}
          numberOfLines={1}
        >
          {formatTick(max, valueFormat)}
        </Text>
      </View>

      {validation && validation.range !== '—' && (
        <Text variant="caption" style={styles.range}>
          Estilo: {validation.range}
        </Text>
      )}
    </View>
  )

  const wrapped = (content: React.ReactNode) =>
    containerStyle ? <View style={containerStyle}>{content}</View> : content

  if (showTooltip) {
    return wrapped(
      <TouchableOpacity
        style={styles.tooltipWrap}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}
      >
        {cardContent}
        {isPressed && (
          <View style={styles.tooltip}>
            <Text variant="caption" style={styles.tooltipText}>
              {tooltipContent}
            </Text>
          </View>
        )}
      </TouchableOpacity>,
    )
  }

  return wrapped(cardContent)
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    minHeight: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: COLORS.text.secondary,
  },
  value: {
    color: COLORS.text.primary,
    marginTop: 4,
  },
  valueInline: {
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  range: {
    color: COLORS.text.secondary,
    marginTop: 6,
    fontSize: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tick: {
    color: COLORS.text.tertiary,
    fontSize: 10,
    minWidth: 28,
  },
  tickRight: {
    textAlign: 'right',
  },
  tooltipWrap: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: 8,
    backgroundColor: COLORS.text.primary,
    padding: 8,
    borderRadius: 6,
    zIndex: 1000,
    maxWidth: 280,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: COLORS.neutral.white,
    fontSize: 11,
    lineHeight: 14,
  },
  trackWrapper: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.neutral.gray[200],
    overflow: 'visible',
    position: 'relative',
  },
  rangeSegment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 5,
    backgroundColor: 'rgba(0,102,102,0.5)',
    minWidth: 4,
  },
  marker: {
    position: 'absolute',
    top: -3,
    width: 4,
    height: 16,
    borderRadius: 2,
    marginLeft: -2,
  },
})
