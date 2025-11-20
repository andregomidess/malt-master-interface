// Importar tipos e interface do módulo de interfaces
import type { WaterProfile } from '../interfaces/WaterProfile'
import {
  ProfileType,
  WaterHardness,
  profileTypeLabels,
  hardnessLabels,
} from '../interfaces/WaterProfile'

// Re-exportar para compatibilidade
export { ProfileType, WaterHardness, profileTypeLabels, hardnessLabels }

// Função para calcular relação SO4:Cl
export const calculateSO4ClRatio = (profile: WaterProfile): number | null => {
  if (profile.so4 == null || profile.cl == null || profile.cl === 0) return null
  return (profile.so4 ?? 0) / (profile.cl ?? 0)
}

// Função para determinar tipo de perfil baseado em SO4:Cl
export const getProfileType = (profile: WaterProfile): ProfileType | null => {
  const ratio = calculateSO4ClRatio(profile)
  if (ratio === null) return null

  if (ratio > 3.0) return ProfileType.VERY_HOPPY
  if (ratio > 1.5) return ProfileType.HOPPY
  if (ratio >= 0.5) return ProfileType.BALANCED
  return ProfileType.MALTY
}

// Função para calcular dureza total (Ca + Mg)
export const calculateTotalHardness = (profile: WaterProfile): number => {
  return (profile.ca || 0) + (profile.mg || 0)
}

// Função para classificar dureza
export const getHardnessLevel = (profile: WaterProfile): WaterHardness => {
  const hardness = calculateTotalHardness(profile)

  if (hardness < 50) return WaterHardness.VERY_SOFT
  if (hardness < 150) return WaterHardness.SOFT
  if (hardness < 300) return WaterHardness.MODERATE
  return WaterHardness.HARD
}

// Função para calcular Alcalinidade Residual (RA)
// RA = HCO3 - (Ca/1.4 + Mg/1.7)
export const calculateResidualAlkalinity = (
  profile: WaterProfile,
): number | null => {
  if (profile.hco3 == null) return null

  const ca = profile.ca ?? 0
  const mg = profile.mg ?? 0

  return (profile.hco3 ?? 0) - (ca / 1.4 + mg / 1.7)
}

// Função para classificar pH
export const getPhLevel = (
  ph: number | null,
): { label: string; color: string; bgColor: string } => {
  if (ph === null) return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }

  if (ph < 6.5) return { label: 'Ácido', color: '#EF4444', bgColor: '#FEE2E2' }
  if (ph <= 7.5)
    return { label: 'Neutro', color: '#10B981', bgColor: '#D1FAE5' }
  return { label: 'Alcalino', color: '#3B82F6', bgColor: '#DBEAFE' }
}

// Verificar se tem alto sulfato (> 200 ppm)
export const hasHighSulfate = (profile: WaterProfile): boolean => {
  return (profile.so4 || 0) > 200
}

// Verificar se tem alto cloreto (> 150 ppm)
export const hasHighChloride = (profile: WaterProfile): boolean => {
  return (profile.cl || 0) > 150
}

// Verificar se tem alto bicarbonato (> 200 ppm)
export const hasHighBicarbonate = (profile: WaterProfile): boolean => {
  return (profile.hco3 || 0) > 200
}

// Verificar se é água muito macia (< 50 ppm dureza)
export const isVerySoftWater = (profile: WaterProfile): boolean => {
  return calculateTotalHardness(profile) < 50
}

// Configuração de cores por tipo de perfil
export const profileTypeColors: Record<
  ProfileType,
  { color: string; bgColor: string }
> = {
  [ProfileType.MALTY]: {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  [ProfileType.BALANCED]: {
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  [ProfileType.HOPPY]: {
    color: '#F97316',
    bgColor: '#FFEDD5',
  },
  [ProfileType.VERY_HOPPY]: {
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
}

// Cores dos minerais (para gráficos)
export const mineralColors = {
  ca: '#3B82F6', // azul
  mg: '#8B5CF6', // roxo
  na: '#F59E0B', // amarelo
  so4: '#EF4444', // vermelho
  cl: '#10B981', // verde
  hco3: '#F97316', // laranja
}

// Função para calcular estatísticas dos perfis
export const calculateWaterStats = (profiles: WaterProfile[]) => {
  const totalProfiles = profiles.length

  const balanced = profiles.filter(p => {
    const type = getProfileType(p)
    return type === ProfileType.BALANCED
  }).length

  const hoppy = profiles.filter(p => {
    const type = getProfileType(p)
    return type === ProfileType.HOPPY || type === ProfileType.VERY_HOPPY
  }).length

  const malty = profiles.filter(p => {
    const type = getProfileType(p)
    return type === ProfileType.MALTY
  }).length

  return {
    totalProfiles,
    balanced,
    hoppy,
    malty,
  }
}

// Função para filtrar perfis por tipo
export const filterProfilesByType = <T extends WaterProfile>(
  profiles: T[],
  type: ProfileType | 'all',
): T[] => {
  if (type === 'all') return profiles

  return profiles.filter(profile => {
    const profileType = getProfileType(profile)
    if (type === ProfileType.HOPPY) {
      return (
        profileType === ProfileType.HOPPY ||
        profileType === ProfileType.VERY_HOPPY
      )
    }
    return profileType === type
  })
}

// Função para buscar perfis
export const searchProfiles = (
  profiles: WaterProfile[],
  query: string,
): WaterProfile[] => {
  const lowerQuery = query.toLowerCase()
  return profiles.filter(
    profile =>
      profile.name.toLowerCase().includes(lowerQuery) ||
      profile.origin?.toLowerCase().includes(lowerQuery) ||
      profile.recommendedStyle?.toLowerCase().includes(lowerQuery) ||
      profile.notes?.toLowerCase().includes(lowerQuery),
  )
}

// Função para ordenar perfis
export type WaterSortBy = 'name' | 'hardness' | 'sulfate' | 'ratio'

export const sortProfiles = (
  profiles: WaterProfile[],
  sortBy: WaterSortBy,
): WaterProfile[] => {
  const sorted = [...profiles]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'hardness':
      return sorted.sort(
        (a, b) => calculateTotalHardness(a) - calculateTotalHardness(b),
      )
    case 'sulfate':
      return sorted.sort((a, b) => (a.so4 || 0) - (b.so4 || 0))
    case 'ratio':
      return sorted.sort((a, b) => {
        const ratioA = calculateSO4ClRatio(a) || 0
        const ratioB = calculateSO4ClRatio(b) || 0
        return ratioA - ratioB
      })
    default:
      return sorted
  }
}
