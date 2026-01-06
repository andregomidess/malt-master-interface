import { BeerStyle } from '../../beer-style/interfaces/BeerStyle'

export interface StyleValidationResult {
  isValid: boolean | null
  range: string
  value?: number | null
  min?: number | null
  max?: number | null
  label: string
}

export const validateStyleRange = (
  value: number | null | undefined,
  min: number | null | undefined,
  max: number | null | undefined,
  label: string,
): StyleValidationResult => {
  if (value === null || value === undefined) {
    return {
      isValid: null,
      range:
        min !== null && min !== undefined && max !== null && max !== undefined
          ? `${min}-${max}`
          : min !== null && min !== undefined
            ? `${min}+`
            : max !== null && max !== undefined
              ? `até ${max}`
              : '—',
      value,
      min,
      max,
      label,
    }
  }

  if (min !== null && min !== undefined && max !== null && max !== undefined) {
    const isValid = value >= min && value <= max
    return {
      isValid,
      range: `${min}-${max}`,
      value,
      min,
      max,
      label,
    }
  }

  if (min !== null && min !== undefined) {
    const isValid = value >= min
    return {
      isValid,
      range: `${min}+`,
      value,
      min,
      max,
      label,
    }
  }

  if (max !== null && max !== undefined) {
    const isValid = value <= max
    return {
      isValid,
      range: `até ${max}`,
      value,
      min,
      max,
      label,
    }
  }

  return {
    isValid: null,
    range: '—',
    value,
    min,
    max,
    label,
  }
}

export const validateRecipeStyleRanges = (
  beerStyle: BeerStyle | null,
  calculations: {
    originalGravity: number | null
    finalGravity: number | null
    estimatedAbv: number | null
    estimatedIbu: number | null
    estimatedEbc: number | null
  },
): { isValid: boolean; errors: string[] } => {
  if (!beerStyle) {
    return { isValid: true, errors: [] }
  }

  const errors: string[] = []

  const og = validateStyleRange(
    calculations.originalGravity,
    beerStyle.minOg,
    beerStyle.maxOg,
    'OG (Original Gravity)',
  )
  if (og.isValid === false) {
    errors.push(
      `OG está fora do range do estilo (${og.range}). Valor atual: ${calculations.originalGravity?.toFixed(3) || '—'}`,
    )
  }

  const fg = validateStyleRange(
    calculations.finalGravity,
    beerStyle.minFg,
    beerStyle.maxFg,
    'FG (Final Gravity)',
  )
  if (fg.isValid === false) {
    errors.push(
      `FG está fora do range do estilo (${fg.range}). Valor atual: ${calculations.finalGravity?.toFixed(3) || '—'}`,
    )
  }

  const abv = validateStyleRange(
    calculations.estimatedAbv,
    beerStyle.minAbv,
    beerStyle.maxAbv,
    'ABV (Álcool por Volume)',
  )
  if (abv.isValid === false) {
    errors.push(
      `ABV está fora do range do estilo (${abv.range}). Valor atual: ${calculations.estimatedAbv?.toFixed(1) || '—'}%`,
    )
  }

  const ibu = validateStyleRange(
    calculations.estimatedIbu,
    beerStyle.minIbu,
    beerStyle.maxIbu,
    'IBU (Unidades de Amargor)',
  )
  if (ibu.isValid === false) {
    errors.push(
      `IBU está fora do range do estilo (${ibu.range}). Valor atual: ${calculations.estimatedIbu?.toFixed(1) || '—'}`,
    )
  }

  const ebc = validateStyleRange(
    calculations.estimatedEbc,
    beerStyle.minColorEbc,
    beerStyle.maxColorEbc,
    'EBC (Cor)',
  )
  if (ebc.isValid === false) {
    errors.push(
      `EBC está fora do range do estilo (${ebc.range}). Valor atual: ${calculations.estimatedEbc || '—'}`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const getValidationTooltip = (
  validation: StyleValidationResult,
): string => {
  if (validation.isValid === null || validation.isValid === true) {
    return ''
  }

  const { value, min, max, label, range } = validation

  if (value === null || value === undefined) {
    return ''
  }

  if (min !== null && min !== undefined && max !== null && max !== undefined) {
    if (value < min) {
      return `${label} está ${(min - value).toFixed(2)} abaixo do mínimo (${range}). O valor atual é ${value.toFixed(2)}.`
    }
    if (value > max) {
      return `${label} está ${(value - max).toFixed(2)} acima do máximo (${range}). O valor atual é ${value.toFixed(2)}.`
    }
  }

  if (min !== null && min !== undefined && value < min) {
    return `${label} está ${(min - value).toFixed(2)} abaixo do mínimo (${range}). O valor atual é ${value.toFixed(2)}.`
  }

  if (max !== null && max !== undefined && value > max) {
    return `${label} está ${(value - max).toFixed(2)} acima do máximo (${range}). O valor atual é ${value.toFixed(2)}.`
  }

  return ''
}
