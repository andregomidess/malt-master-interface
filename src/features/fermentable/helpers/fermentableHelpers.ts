import { Fermentable, FermentableType } from '../interfaces/Fermentable'

export const ebcToColor = (ebc: number | null): string => {
  if (ebc === null || ebc === 0) return '#F9E89F'

  if (ebc <= 4) return '#F9E89F'
  if (ebc <= 10) return '#F5D76E'
  if (ebc <= 25) return '#E0B040'
  if (ebc <= 60) return '#C07020'
  if (ebc <= 100) return '#8B4513'
  if (ebc <= 200) return '#6B3410'
  if (ebc <= 300) return '#3D2210'
  return '#1A0A00'
}

export const getColorClassification = (
  ebc: number | null,
): { label: string; color: string } => {
  if (ebc === null || ebc === 0)
    return { label: 'Muito Claro', color: '#10B981' }
  if (ebc <= 10) return { label: 'Muito Claro', color: '#10B981' }
  if (ebc <= 40) return { label: 'Claro', color: '#F59E0B' }
  if (ebc <= 100) return { label: 'Âmbar', color: '#F97316' }
  if (ebc <= 300) return { label: 'Escuro', color: '#B45309' }
  return { label: 'Muito Escuro', color: '#78350F' }
}

export const getYieldLevel = (
  yieldValue: number | null,
): { label: string; color: string; bgColor: string } => {
  if (yieldValue === null)
    return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }
  if (yieldValue > 80)
    return { label: 'Alto', color: '#10B981', bgColor: '#D1FAE5' }
  if (yieldValue > 70)
    return { label: 'Médio', color: '#F59E0B', bgColor: '#FEF3C7' }
  return { label: 'Baixo', color: '#F97316', bgColor: '#FFEDD5' }
}

export const isEssentialBaseMalt = (fermentable: Fermentable): boolean => {
  const essentialNames = [
    'pilsen',
    'pale ale',
    'pale malt',
    'munich',
    'vienna',
    'maris otter',
  ]
  return (
    fermentable.type === FermentableType.BASE &&
    essentialNames.some(name => fermentable.name.toLowerCase().includes(name))
  )
}

export const isRoastedMalt = (fermentable: Fermentable): boolean => {
  return (
    fermentable.type === FermentableType.SPECIALTY &&
    (fermentable.color || 0) > 300
  )
}

export const typeColors: Record<
  FermentableType,
  { color: string; bgColor: string; icon: string }
> = {
  [FermentableType.BASE]: {
    color: '#92400E',
    bgColor: '#FEF3C7',
    icon: '🌾',
  },
  [FermentableType.SPECIALTY]: {
    color: '#F97316',
    bgColor: '#FFEDD5',
    icon: '🔥',
  },
  [FermentableType.SUGAR]: {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: '🍯',
  },
  [FermentableType.ADJUNCT]: {
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: '🌽',
  },
}
