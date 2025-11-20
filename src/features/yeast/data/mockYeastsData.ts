// Importar tipos e interface do módulo de interfaces
import type { Yeast } from '../interfaces/Yeast'
import {
  YeastType,
  YeastFlocculation,
  YeastFormat,
  yeastTypeLabels,
  yeastFlocculationLabels,
  yeastFormatLabels,
} from '../interfaces/Yeast'

// Re-exportar para compatibilidade
export {
  YeastType,
  YeastFlocculation,
  YeastFormat,
  yeastTypeLabels,
  yeastFlocculationLabels,
  yeastFormatLabels,
}

// Função para classificar atenuação
export const getAttenuationLevel = (
  attenuation: number | null,
): { label: string; color: string; bgColor: string } => {
  if (attenuation === null)
    return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }
  if (attenuation < 70)
    return { label: 'Baixa', color: '#10B981', bgColor: '#D1FAE5' }
  if (attenuation < 78)
    return { label: 'Média', color: '#F59E0B', bgColor: '#FEF3C7' }
  return { label: 'Alta', color: '#F97316', bgColor: '#FFEDD5' }
}

// Função para classificar temperatura
export const getTempLevel = (
  minTemp: number | null,
  maxTemp: number | null,
): { label: string; color: string; bgColor: string } => {
  if (minTemp === null || maxTemp === null)
    return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }

  const avgTemp = (minTemp + maxTemp) / 2

  if (avgTemp < 15)
    return { label: 'Frio', color: '#3B82F6', bgColor: '#DBEAFE' }
  if (avgTemp < 20)
    return { label: 'Médio', color: '#F59E0B', bgColor: '#FEF3C7' }
  return { label: 'Quente', color: '#F97316', bgColor: '#FFEDD5' }
}

// Função para classificar floculação
export const getFlocculationConfig = (
  flocculation: YeastFlocculation,
): { label: string; color: string; bgColor: string } => {
  switch (flocculation) {
    case YeastFlocculation.LOW:
      return { label: 'Baixa', color: '#EF4444', bgColor: '#FEE2E2' }
    case YeastFlocculation.MEDIUM:
      return { label: 'Média', color: '#F59E0B', bgColor: '#FEF3C7' }
    case YeastFlocculation.HIGH:
      return { label: 'Alta', color: '#10B981', bgColor: '#D1FAE5' }
  }
}

// Verificar se é levedura clean/neutra
export const isCleanYeast = (yeast: Yeast): boolean => {
  const cleanKeywords = [
    'clean',
    'neutral',
    'neutro',
    'limpo',
    'us-05',
    'california',
    'chico',
    's-189',
    'w-34/70',
  ]
  const aromaLower = (yeast.aromaFlavor || '').toLowerCase()
  const nameLower = yeast.name.toLowerCase()

  return (
    cleanKeywords.some(
      keyword => aromaLower.includes(keyword) || nameLower.includes(keyword),
    ) ||
    (aromaLower.includes('mínimo') && aromaLower.includes('caráter'))
  )
}

// Verificar se produz perfil característico
export const isCharacteristicYeast = (yeast: Yeast): boolean => {
  const characteristicKeywords = [
    'frutado',
    'fruity',
    'fenólico',
    'phenolic',
    'especiado',
    'spicy',
    'éster',
    'ester',
    'banana',
    'cravo',
    'clove',
    'belgian',
    'weizen',
    'saison',
  ]
  const aromaLower = (yeast.aromaFlavor || '').toLowerCase()

  return characteristicKeywords.some(keyword => aromaLower.includes(keyword))
}

// Verificar alta atenuação
export const isHighAttenuation = (yeast: Yeast): boolean => {
  return (yeast.attenuation || 0) > 80
}

// Verificar alta tolerância ao álcool
export const isHighGravity = (yeast: Yeast): boolean => {
  return (yeast.alcoholTolerance || 0) > 12
}

// Configuração de cores por tipo
export const typeColors: Record<
  YeastType,
  { color: string; bgColor: string; icon: string }
> = {
  [YeastType.ALE]: {
    color: '#F97316',
    bgColor: '#FFEDD5',
    icon: '🧫',
  },
  [YeastType.LAGER]: {
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    icon: '❄️',
  },
  [YeastType.WILD]: {
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    icon: '🦠',
  },
  [YeastType.BACTERIA]: {
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: '🧬',
  },
}

// Função para calcular estatísticas das leveduras
export const calculateYeastStats = (yeasts: Array<Pick<Yeast, 'type'>>) => {
  const totalYeasts = yeasts.length
  const ales = yeasts.filter(y => y.type === YeastType.ALE).length
  const lagers = yeasts.filter(y => y.type === YeastType.LAGER).length
  const wildAndBacteria = yeasts.filter(
    y => y.type === YeastType.WILD || y.type === YeastType.BACTERIA,
  ).length

  return {
    totalYeasts,
    ales,
    lagers,
    wildAndBacteria,
  }
}

// Função para filtrar leveduras por tipo
export const filterYeastsByType = <T extends Pick<Yeast, 'type'>>(
  yeasts: T[],
  type: YeastType | 'all',
): T[] => {
  if (type === 'all') return yeasts
  return yeasts.filter(yeast => yeast.type === type)
}

// Função para buscar leveduras
export const searchYeasts = (yeasts: Yeast[], query: string): Yeast[] => {
  const lowerQuery = query.toLowerCase()
  return yeasts.filter(
    yeast =>
      yeast.name.toLowerCase().includes(lowerQuery) ||
      yeast.supplier?.toLowerCase().includes(lowerQuery) ||
      yeast.aromaFlavor?.toLowerCase().includes(lowerQuery),
  )
}

// Função para ordenar leveduras
export type YeastSortBy = 'name' | 'attenuation' | 'temperature' | 'type'

export const sortYeasts = (yeasts: Yeast[], sortBy: YeastSortBy): Yeast[] => {
  const sorted = [...yeasts]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'attenuation':
      return sorted.sort((a, b) => (b.attenuation || 0) - (a.attenuation || 0))
    case 'temperature':
      return sorted.sort((a, b) => (a.minTemp || 0) - (b.minTemp || 0))
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type))
    default:
      return sorted
  }
}
