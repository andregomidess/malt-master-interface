// Importar tipos e interface do módulo de interfaces
import type { Fermentable } from '../interfaces/Fermentable'
import {
  FermentableType,
  FermentableForm,
  fermentableTypeLabels,
  fermentableFormLabels,
} from '../interfaces/Fermentable'

export {
  FermentableType,
  FermentableForm,
  fermentableTypeLabels,
  fermentableFormLabels,
}

export const calculateFermentableStats = (
  fermentables: Array<Pick<Fermentable, 'type'>>,
) => {
  const totalFermentables = fermentables.length
  const baseMalts = fermentables.filter(
    f => f.type === FermentableType.BASE,
  ).length
  const specialtyMalts = fermentables.filter(
    f => f.type === FermentableType.SPECIALTY,
  ).length
  const sugarsAndAdjuncts = fermentables.filter(
    f => f.type === FermentableType.SUGAR || f.type === FermentableType.ADJUNCT,
  ).length

  return {
    totalFermentables,
    baseMalts,
    specialtyMalts,
    sugarsAndAdjuncts,
  }
}

export const filterFermentablesByType = <T extends Pick<Fermentable, 'type'>>(
  fermentables: T[],
  type: FermentableType | 'all',
): T[] => {
  if (type === 'all') return fermentables
  return fermentables.filter(fermentable => fermentable.type === type)
}

export const searchFermentables = (
  fermentables: Fermentable[],
  query: string,
): Fermentable[] => {
  const lowerQuery = query.toLowerCase()
  return fermentables.filter(
    fermentable =>
      fermentable.name.toLowerCase().includes(lowerQuery) ||
      fermentable.origin?.toLowerCase().includes(lowerQuery) ||
      fermentable.notes?.toLowerCase().includes(lowerQuery),
  )
}

export type FermentableSortBy = 'name' | 'color' | 'yield' | 'type'

export const sortFermentables = (
  fermentables: Fermentable[],
  sortBy: FermentableSortBy,
): Fermentable[] => {
  const sorted = [...fermentables]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'color':
      return sorted.sort((a, b) => (a.color || 0) - (b.color || 0))
    case 'yield':
      return sorted.sort((a, b) => (b.yield || 0) - (a.yield || 0))
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type))
    default:
      return sorted
  }
}
