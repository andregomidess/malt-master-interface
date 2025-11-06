// Interface do perfil de água
export interface WaterProfile {
  id: string
  name: string
  origin: string | null
  ca: number | null // Cálcio (ppm)
  mg: number | null // Magnésio (ppm)
  na: number | null // Sódio (ppm)
  so4: number | null // Sulfato (ppm)
  cl: number | null // Cloreto (ppm)
  hco3: number | null // Bicarbonato (ppm)
  ph: number | null // pH
  recommendedStyle: string | null
  notes: string | null
  createdAt: Date
}

// Enum para tipo de perfil baseado na relação SO4:Cl
export enum ProfileType {
  MALTY = 'malty', // SO4:Cl < 0.5
  BALANCED = 'balanced', // SO4:Cl 0.5-1.5
  HOPPY = 'hoppy', // SO4:Cl > 1.5
  VERY_HOPPY = 'very_hoppy', // SO4:Cl > 3.0
}

// Enum para dureza
export enum WaterHardness {
  VERY_SOFT = 'very_soft', // < 50 ppm
  SOFT = 'soft', // 50-150 ppm
  MODERATE = 'moderate', // 150-300 ppm
  HARD = 'hard', // > 300 ppm
}

// Traduções
export const profileTypeLabels: Record<ProfileType, string> = {
  [ProfileType.MALTY]: 'Maltado',
  [ProfileType.BALANCED]: 'Balanceado',
  [ProfileType.HOPPY]: 'Lupulado',
  [ProfileType.VERY_HOPPY]: 'Muito Lupulado',
}

export const hardnessLabels: Record<WaterHardness, string> = {
  [WaterHardness.VERY_SOFT]: 'Muito Macia',
  [WaterHardness.SOFT]: 'Macia',
  [WaterHardness.MODERATE]: 'Moderada',
  [WaterHardness.HARD]: 'Dura',
}

// Função para calcular relação SO4:Cl
export const calculateSO4ClRatio = (profile: WaterProfile): number | null => {
  if (profile.so4 === null || profile.cl === null || profile.cl === 0)
    return null
  return profile.so4 / profile.cl
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
export const getHardnessLevel = (
  profile: WaterProfile
): WaterHardness => {
  const hardness = calculateTotalHardness(profile)

  if (hardness < 50) return WaterHardness.VERY_SOFT
  if (hardness < 150) return WaterHardness.SOFT
  if (hardness < 300) return WaterHardness.MODERATE
  return WaterHardness.HARD
}

// Função para calcular Alcalinidade Residual (RA)
// RA = HCO3 - (Ca/1.4 + Mg/1.7)
export const calculateResidualAlkalinity = (
  profile: WaterProfile
): number | null => {
  if (profile.hco3 === null) return null

  const ca = profile.ca || 0
  const mg = profile.mg || 0

  return profile.hco3 - (ca / 1.4 + mg / 1.7)
}

// Função para classificar pH
export const getPhLevel = (
  ph: number | null
): { label: string; color: string; bgColor: string } => {
  if (ph === null)
    return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }

  if (ph < 6.5)
    return { label: 'Ácido', color: '#EF4444', bgColor: '#FEE2E2' }
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

// Função para criar datas relativas
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Dados mockados - 12 perfis históricos famosos
export const mockWaterProfilesData: WaterProfile[] = [
  // Perfis Clássicos Europeus
  {
    id: '1',
    name: 'Burton-on-Trent',
    origin: '🇬🇧 Inglaterra',
    ca: 270,
    mg: 40,
    na: 25,
    so4: 280,
    cl: 40,
    hco3: 240,
    ph: 7.9,
    recommendedStyle: 'IPA, Pale Ale, Bitter',
    notes:
      'Perfil clássico para IPAs inglesas. Altíssimo sulfato acentua amargor e secura do lúpulo. Água historicamente famosa que definiu o estilo IPA.',
    createdAt: daysAgo(300),
  },
  {
    id: '2',
    name: 'Pilsen',
    origin: '🇨🇿 República Tcheca',
    ca: 7,
    mg: 2,
    na: 2,
    so4: 5,
    cl: 5,
    hco3: 15,
    ph: 7.0,
    recommendedStyle: 'Pilsner, Blonde Ale, Kölsch',
    notes:
      'Água extremamente macia que permite delicado amargor do lúpulo Saaz. Perfil ideal para Pilsners claras e lagers delicadas.',
    createdAt: daysAgo(280),
  },
  {
    id: '3',
    name: 'Dublin',
    origin: '🇮🇪 Irlanda',
    ca: 115,
    mg: 4,
    na: 12,
    so4: 55,
    cl: 19,
    hco3: 280,
    ph: 8.0,
    recommendedStyle: 'Stout, Porter, Brown Ale',
    notes:
      'Alto bicarbonato essencial para cervejas escuras. Compensa acidez dos maltes torrados. Perfil clássico da Guinness.',
    createdAt: daysAgo(270),
  },
  {
    id: '4',
    name: 'Munique',
    origin: '🇩🇪 Alemanha',
    ca: 75,
    mg: 18,
    na: 2,
    so4: 10,
    cl: 2,
    hco3: 250,
    ph: 7.8,
    recommendedStyle: 'Märzen, Bock, Dunkel',
    notes:
      'Água moderadamente dura com alta alcalinidade. Ideal para cervejas maltadas bávaras. Baixo sulfato não interfere com dulçor do malte.',
    createdAt: daysAgo(260),
  },
  {
    id: '5',
    name: 'Viena',
    origin: '🇦🇹 Áustria',
    ca: 200,
    mg: 60,
    na: 8,
    so4: 125,
    cl: 12,
    hco3: 120,
    ph: 7.3,
    recommendedStyle: 'Vienna Lager, Amber Lager',
    notes:
      'Água moderadamente dura, balanceada. Sulfato moderado realça maltes tostados sem dominar. Perfil histórico das Vienna Lagers.',
    createdAt: daysAgo(250),
  },
  {
    id: '6',
    name: 'Dortmund',
    origin: '🇩🇪 Alemanha',
    ca: 250,
    mg: 25,
    na: 60,
    so4: 280,
    cl: 100,
    hco3: 180,
    ph: 7.5,
    recommendedStyle: 'Dortmunder Export, Helles',
    notes:
      'Água dura com alto sulfato e cloreto. Perfil complexo que equilibra amargor e corpo. Característica das Export Lagers alemãs.',
    createdAt: daysAgo(240),
  },
  {
    id: '7',
    name: 'Londres',
    origin: '🇬🇧 Inglaterra',
    ca: 90,
    mg: 4,
    na: 86,
    so4: 40,
    cl: 34,
    hco3: 104,
    ph: 7.4,
    recommendedStyle: 'English Pale Ale, Porter, Mild',
    notes:
      'Perfil balanceado com moderada dureza. Alta alcalinidade suporta maltes tostados. Clássico para English Ales tradicionais.',
    createdAt: daysAgo(230),
  },
  {
    id: '8',
    name: 'Edimburgo',
    origin: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escócia',
    ca: 120,
    mg: 25,
    na: 55,
    so4: 140,
    cl: 60,
    hco3: 225,
    ph: 7.6,
    recommendedStyle: 'Scottish Ale, Wee Heavy',
    notes:
      'Alta dureza, sulfato moderado. Suporta perfil maltado das Scottish Ales. Alcalinidade balanceia maltes caramelizados.',
    createdAt: daysAgo(220),
  },

  // Perfis Americanos Modernos
  {
    id: '9',
    name: 'Balanced Profile',
    origin: '🇺🇸 EUA',
    ca: 100,
    mg: 10,
    na: 10,
    so4: 100,
    cl: 100,
    hco3: 50,
    ph: 7.0,
    recommendedStyle: 'Amber Ale, Brown Ale, Pale Ale',
    notes:
      'Perfil versátil moderno. Relação 1:1 entre sulfato e cloreto oferece equilíbrio perfeito entre malte e lúpulo. Ótimo ponto de partida.',
    createdAt: daysAgo(150),
  },
  {
    id: '10',
    name: 'IPA Profile',
    origin: '🇺🇸 EUA',
    ca: 150,
    mg: 10,
    na: 15,
    so4: 300,
    cl: 75,
    hco3: 50,
    ph: 7.2,
    recommendedStyle: 'IPA, DIPA, Pale Ale',
    notes:
      'Alto sulfato para IPAs modernas. Relação 4:1 acentua amargor e secura do lúpulo. Perfeito para West Coast IPAs lupuladas.',
    createdAt: daysAgo(100),
  },
  {
    id: '11',
    name: 'Malty Profile',
    origin: '🇺🇸 EUA',
    ca: 100,
    mg: 10,
    na: 10,
    so4: 50,
    cl: 150,
    hco3: 50,
    ph: 7.0,
    recommendedStyle: 'Stout, Porter, Bock, Oktoberfest',
    notes:
      'Alto cloreto para cervejas maltadas. Relação 1:3 realça dulçor e corpo do malte. Reduz percepção de amargor. Ideal para New England IPAs também.',
    createdAt: daysAgo(90),
  },
  {
    id: '12',
    name: 'Soft Water Profile',
    origin: 'Universal',
    ca: 50,
    mg: 5,
    na: 10,
    so4: 50,
    cl: 50,
    hco3: 25,
    ph: 7.0,
    recommendedStyle: 'Blonde Ale, Cream Ale, Lager',
    notes:
      'Água macia universal. Base neutra ideal para ajustes customizados. Baixa mineralização permite controle total do perfil final.',
    createdAt: daysAgo(50),
  },
]

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
export const filterProfilesByType = (
  profiles: WaterProfile[],
  type: ProfileType | 'all'
): WaterProfile[] => {
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
  query: string
): WaterProfile[] => {
  const lowerQuery = query.toLowerCase()
  return profiles.filter(
    profile =>
      profile.name.toLowerCase().includes(lowerQuery) ||
      profile.origin?.toLowerCase().includes(lowerQuery) ||
      profile.recommendedStyle?.toLowerCase().includes(lowerQuery) ||
      profile.notes?.toLowerCase().includes(lowerQuery)
  )
}

// Função para ordenar perfis
export type WaterSortBy = 'name' | 'hardness' | 'sulfate' | 'ratio'

export const sortProfiles = (
  profiles: WaterProfile[],
  sortBy: WaterSortBy
): WaterProfile[] => {
  const sorted = [...profiles]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'hardness':
      return sorted.sort(
        (a, b) => calculateTotalHardness(a) - calculateTotalHardness(b)
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

