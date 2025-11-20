// Importar tipos e interface do módulo de interfaces
import type { Hop } from '../interfaces/Hop'
import { HopForm, HopUse, hopFormLabels, hopUseLabels } from '../interfaces/Hop'

export { HopForm, HopUse, hopFormLabels, hopUseLabels }

export const getAlphaAcidsLevel = (
  alphaAcids: number,
): { level: string; color: string; bgColor: string } => {
  if (alphaAcids < 5) {
    return { level: 'Baixo', color: '#10B981', bgColor: '#D1FAE5' }
  } else if (alphaAcids < 10) {
    return { level: 'Médio', color: '#F59E0B', bgColor: '#FEF3C7' }
  } else if (alphaAcids < 15) {
    return { level: 'Alto', color: '#F97316', bgColor: '#FFEDD5' }
  } else {
    return { level: 'Muito Alto', color: '#EF4444', bgColor: '#FEE2E2' }
  }
}

export const isNobleHop = (hop: Hop): boolean => {
  return hop.alphaAcids < 6 && (hop.cohumulone || 100) < 25
}

export const isModernHop = (hop: Hop): boolean => {
  return hop.alphaAcids > 11 && (hop.totalOils || 0) > 1.5
}

export const useColors: Record<
  HopUse,
  { color: string; bgColor: string; icon: string }
> = {
  [HopUse.BITTERING]: {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: '💧',
  },
  [HopUse.AROMA]: {
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: '🌸',
  },
  [HopUse.DRY_HOPPING]: {
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    icon: '🌿',
  },
  [HopUse.DUAL_PURPOSE]: {
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    icon: '⚡',
  },
}

export const calculateHopStats = (hops: Hop[]) => {
  const totalHops = hops.length

  const bitteringCount = hops.filter(
    h => h.uses && h.uses[0] === HopUse.BITTERING,
  ).length
  const aromaCount = hops.filter(
    h => h.uses && h.uses[0] === HopUse.AROMA,
  ).length
  const dryHoppingCount = hops.filter(
    h => h.uses && h.uses[0] === HopUse.DRY_HOPPING,
  ).length
  const dualPurposeCount = hops.filter(
    h => h.uses && h.uses[0] === HopUse.DUAL_PURPOSE,
  ).length

  return {
    totalHops,
    bitteringCount,
    aromaCount,
    dryHoppingCount,
    dualPurposeCount,
  }
}

export const filterHopsByUse = (hops: Hop[], use: HopUse | 'all'): Hop[] => {
  if (use === 'all') return hops
  return hops.filter(hop => hop.uses?.includes(use))
}

export const searchHops = (hops: Hop[], query: string): Hop[] => {
  const lowerQuery = query.toLowerCase()
  return hops.filter(
    hop =>
      hop.name.toLowerCase().includes(lowerQuery) ||
      hop.origin?.toLowerCase().includes(lowerQuery) ||
      hop.aromaFlavor?.toLowerCase().includes(lowerQuery),
  )
}

export type HopSortBy = 'name' | 'alphaAcids' | 'cost' | 'origin'

export const sortHops = (hops: Hop[], sortBy: HopSortBy): Hop[] => {
  const sorted = [...hops]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'alphaAcids':
      return sorted.sort((a, b) => b.alphaAcids - a.alphaAcids)
    case 'cost':
      return sorted.sort(
        (a, b) => (a.costPerKilogram || 0) - (b.costPerKilogram || 0),
      )
    case 'origin':
      return sorted.sort((a, b) =>
        (a.origin || '').localeCompare(b.origin || ''),
      )
    default:
      return sorted
  }
}
