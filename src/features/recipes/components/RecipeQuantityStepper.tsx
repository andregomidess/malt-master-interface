import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'

/** Passo em kg na lista de maltes (ajuste rápido sem abrir o modal). */
export const FERMENTABLE_AMOUNT_STEP_KG = 0.5
export const FERMENTABLE_AMOUNT_MIN_KG = 0.1

/** Passo em gramas na lista de lúpulos. */
export const HOP_AMOUNT_STEP_G = 5
export const HOP_AMOUNT_MIN_G = 1

function roundKg(n: number): number {
  return Math.round(n * 100) / 100
}

type Unit = 'kg' | 'g'

export interface RecipeQuantityStepperProps {
  value: number
  unit: Unit
  step: number
  min: number
  max?: number
  onChange: (next: number) => void
  /** Texto curto para acessibilidade, ex.: "Malte Pilsner" */
  labelForA11y?: string
}

function formatAmount(value: number, unit: Unit): string {
  if (unit === 'g') {
    return String(Math.round(value))
  }
  const r = roundKg(value)
  return r.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export const RecipeQuantityStepper: React.FC<RecipeQuantityStepperProps> = ({
  value,
  unit,
  step,
  min,
  max,
  onChange,
  labelForA11y,
}) => {
  const raw =
    typeof value === 'number' && !Number.isNaN(value)
      ? value
      : parseFloat(String(value))
  const safe = raw > 0 && !Number.isNaN(raw) ? raw : min

  const canMinus = safe > min + 1e-6
  const canPlus = max == null || safe < max - 1e-6

  const apply = (nextRaw: number) => {
    const capped = max != null ? Math.min(nextRaw, max) : nextRaw
    const floored = Math.max(min, capped)
    const next = unit === 'kg' ? roundKg(floored) : Math.round(floored)
    if (next !== safe) {
      onChange(next)
    }
  }

  const handleMinus = () => {
    if (!canMinus) return
    apply(safe - step)
  }

  const handlePlus = () => {
    if (!canPlus) return
    apply(safe + step)
  }

  const unitLabel = unit === 'kg' ? 'kg' : 'g'
  const a11yBase = labelForA11y ? `${labelForA11y}, quantidade` : 'Quantidade'

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={[styles.btn, !canMinus && styles.btnDisabled]}
        onPress={handleMinus}
        disabled={!canMinus}
        accessibilityRole="button"
        accessibilityLabel={`${a11yBase}, diminuir ${step} ${unitLabel}`}
      >
        <BiMinus
          size={18}
          color={canMinus ? COLORS.brand.primary : COLORS.neutral.gray[400]}
        />
      </TouchableOpacity>
      <Text variant="bodySmall" style={styles.valueText}>
        {formatAmount(safe, unit)} {unitLabel}
      </Text>
      <TouchableOpacity
        style={[styles.btn, !canPlus && styles.btnDisabled]}
        onPress={handlePlus}
        disabled={!canPlus}
        accessibilityRole="button"
        accessibilityLabel={`${a11yBase}, aumentar ${step} ${unitLabel}`}
      >
        <BiPlus
          size={18}
          color={canPlus ? COLORS.brand.primary : COLORS.neutral.gray[400]}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  valueText: {
    fontWeight: '600',
    color: COLORS.text.primary,
    minWidth: 72,
    textAlign: 'center',
  },
})
