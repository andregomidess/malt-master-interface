// Tipos de leveduras baseados no backend
export enum YeastType {
  ALE = 'ale',
  LAGER = 'lager',
  WILD = 'wild',
  BACTERIA = 'bacteria',
}

export enum YeastFlocculation {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum YeastFormat {
  DRY = 'dry',
  LIQUID = 'liquid',
  SLURRY = 'slurry',
}

// Traduções
export const yeastTypeLabels: Record<YeastType, string> = {
  [YeastType.ALE]: 'Ale',
  [YeastType.LAGER]: 'Lager',
  [YeastType.WILD]: 'Selvagem',
  [YeastType.BACTERIA]: 'Bactéria',
}

export const yeastFlocculationLabels: Record<YeastFlocculation, string> = {
  [YeastFlocculation.LOW]: 'Baixa',
  [YeastFlocculation.MEDIUM]: 'Média',
  [YeastFlocculation.HIGH]: 'Alta',
}

export const yeastFormatLabels: Record<YeastFormat, string> = {
  [YeastFormat.DRY]: 'Seca',
  [YeastFormat.LIQUID]: 'Líquida',
  [YeastFormat.SLURRY]: 'Slurry',
}

// Interface da levedura
export interface Yeast {
  id: string
  name: string
  type: YeastType
  attenuation: number | null // % (min-max ou média)
  attenuationMax: number | null // % máximo
  flocculation: YeastFlocculation
  minTemp: number | null // °C
  maxTemp: number | null // °C
  format: YeastFormat
  alcoholTolerance: number | null // % ABV
  origin: string | null
  supplier: string | null
  aromaFlavor: string | null
  rehydrationNotes: string | null
  starterNotes: string | null
  notes: string | null
  isPublic: boolean
  createdAt: Date
}

// Função para classificar atenuação
export const getAttenuationLevel = (
  attenuation: number | null
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
  maxTemp: number | null
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
  flocculation: YeastFlocculation
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
      keyword => aromaLower.includes(keyword) || nameLower.includes(keyword)
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
  return (yeast.attenuationMax || yeast.attenuation || 0) > 80
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

// Função para criar datas relativas
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Dados mockados - 18 leveduras variadas
export const mockYeastsData: Yeast[] = [
  // LEVEDURAS ALE (7 itens)
  {
    id: '1',
    name: 'SafAle US-05',
    type: YeastType.ALE,
    attenuation: 78,
    attenuationMax: 82,
    flocculation: YeastFlocculation.MEDIUM,
    minTemp: 18,
    maxTemp: 24,
    format: YeastFormat.DRY,
    alcoholTolerance: 11,
    origin: '🇺🇸 EUA',
    supplier: 'Fermentis',
    aromaFlavor: 'Neutro e limpo, permite destacar lúpulo e malte',
    rehydrationNotes: 'Reidratar em água a 25-29°C por 15 minutos antes de inocular',
    starterNotes: null,
    notes: 'Levedura americana clássica, ideal para IPAs e American Ales',
    isPublic: true,
    createdAt: daysAgo(200),
  },
  {
    id: '2',
    name: 'WLP001 California Ale',
    type: YeastType.ALE,
    attenuation: 73,
    attenuationMax: 80,
    flocculation: YeastFlocculation.MEDIUM,
    minTemp: 20,
    maxTemp: 24,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 12,
    origin: '🇺🇸 EUA',
    supplier: 'White Labs',
    aromaFlavor: 'Clean, leve frutado de ésteres quando quente',
    rehydrationNotes: null,
    starterNotes: 'Recomendado fazer starter de 1-2L para 20L de cerveja',
    notes: 'A famosa cepa Chico, versátil para diversos estilos americanos',
    isPublic: true,
    createdAt: daysAgo(180),
  },
  {
    id: '3',
    name: 'SafAle S-04',
    type: YeastType.ALE,
    attenuation: 75,
    attenuationMax: 79,
    flocculation: YeastFlocculation.HIGH,
    minTemp: 15,
    maxTemp: 20,
    format: YeastFormat.DRY,
    alcoholTolerance: 9,
    origin: '🇬🇧 Inglaterra',
    supplier: 'Fermentis',
    aromaFlavor: 'Ésteres frutados sutis, caráter maltado',
    rehydrationNotes: 'Reidratar em água a 25-29°C por 15 minutos',
    starterNotes: null,
    notes: 'Levedura inglesa clássica, alta floculação para clarificação rápida',
    isPublic: true,
    createdAt: daysAgo(160),
  },
  {
    id: '4',
    name: 'Nottingham Ale',
    type: YeastType.ALE,
    attenuation: 77,
    attenuationMax: 82,
    flocculation: YeastFlocculation.HIGH,
    minTemp: 14,
    maxTemp: 21,
    format: YeastFormat.DRY,
    alcoholTolerance: 14,
    origin: '🇬🇧 Inglaterra',
    supplier: 'Lallemand',
    aromaFlavor: 'Neutro, leve frutado, baixo diacetil',
    rehydrationNotes: 'Polvilhar direto no mosto ou reidratar',
    starterNotes: null,
    notes: 'Alta tolerância ao álcool, excelente para Strong Ales',
    isPublic: true,
    createdAt: daysAgo(140),
  },
  {
    id: '5',
    name: 'Belle Saison',
    type: YeastType.ALE,
    attenuation: 82,
    attenuationMax: 87,
    flocculation: YeastFlocculation.LOW,
    minTemp: 18,
    maxTemp: 28,
    format: YeastFormat.DRY,
    alcoholTolerance: 15,
    origin: '🇧🇪 Bélgica',
    supplier: 'Lallemand',
    aromaFlavor: 'Frutado, especiado, pimenta e frutas cítricas',
    rehydrationNotes: 'Reidratar em água a 30-35°C',
    starterNotes: null,
    notes: 'Super atenuação, ideal para Saison com final muito seco',
    isPublic: false,
    createdAt: daysAgo(120),
  },
  {
    id: '6',
    name: 'Weihenstephan Weizen (WY3068)',
    type: YeastType.ALE,
    attenuation: 73,
    attenuationMax: 77,
    flocculation: YeastFlocculation.LOW,
    minTemp: 18,
    maxTemp: 24,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 10,
    origin: '🇩🇪 Alemanha',
    supplier: 'Wyeast',
    aromaFlavor: 'Banana e cravo, ésteres e fenóis característicos',
    rehydrationNotes: null,
    starterNotes: 'Starter obrigatório, propagar bem para perfil completo',
    notes: 'Clássica levedura bávara para Hefeweizen',
    isPublic: true,
    createdAt: daysAgo(100),
  },
  {
    id: '7',
    name: 'M21 Belgian Wit',
    type: YeastType.ALE,
    attenuation: 74,
    attenuationMax: 78,
    flocculation: YeastFlocculation.MEDIUM,
    minTemp: 18,
    maxTemp: 25,
    format: YeastFormat.DRY,
    alcoholTolerance: 10,
    origin: '🇧🇪 Bélgica',
    supplier: 'Mangrove Jack',
    aromaFlavor: 'Especiado, frutas cítricas, levemente fenólico',
    rehydrationNotes: 'Reidratar em água a 25-29°C',
    starterNotes: null,
    notes: 'Perfeita para Witbier, produz perfil belga autêntico',
    isPublic: true,
    createdAt: daysAgo(90),
  },

  // LEVEDURAS LAGER (5 itens)
  {
    id: '8',
    name: 'SafLager W-34/70',
    type: YeastType.LAGER,
    attenuation: 80,
    attenuationMax: 84,
    flocculation: YeastFlocculation.HIGH,
    minTemp: 9,
    maxTemp: 15,
    format: YeastFormat.DRY,
    alcoholTolerance: 12,
    origin: '🇩🇪 Alemanha',
    supplier: 'Fermentis',
    aromaFlavor: 'Muito limpo e neutro, perfil lager clássico',
    rehydrationNotes: 'Reidratar em água a 23-27°C',
    starterNotes: null,
    notes: 'A levedura lager mais popular do mundo',
    isPublic: true,
    createdAt: daysAgo(170),
  },
  {
    id: '9',
    name: 'WLP833 German Bock Lager',
    type: YeastType.LAGER,
    attenuation: 71,
    attenuationMax: 75,
    flocculation: YeastFlocculation.MEDIUM,
    minTemp: 10,
    maxTemp: 15,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 11,
    origin: '🇩🇪 Alemanha',
    supplier: 'White Labs',
    aromaFlavor: 'Maltado, limpo, leve caráter de éster',
    rehydrationNotes: null,
    starterNotes: 'Starter grande recomendado para lagers',
    notes: 'Ideal para Bock, Doppelbock e outras lagers maltadas',
    isPublic: true,
    createdAt: daysAgo(150),
  },
  {
    id: '10',
    name: 'Diamond Lager',
    type: YeastType.LAGER,
    attenuation: 78,
    attenuationMax: 82,
    flocculation: YeastFlocculation.HIGH,
    minTemp: 10,
    maxTemp: 20,
    format: YeastFormat.DRY,
    alcoholTolerance: 13,
    origin: '🇨🇦 Canadá',
    supplier: 'Lallemand',
    aromaFlavor: 'Clean, neutro, pode fermentar em temperaturas mais altas',
    rehydrationNotes: 'Reidratar em água morna',
    starterNotes: null,
    notes: 'Versatilidade única: lager que fermenta até 20°C',
    isPublic: false,
    createdAt: daysAgo(80),
  },
  {
    id: '11',
    name: 'SafLager S-23',
    type: YeastType.LAGER,
    attenuation: 78,
    attenuationMax: 82,
    flocculation: YeastFlocculation.HIGH,
    minTemp: 12,
    maxTemp: 15,
    format: YeastFormat.DRY,
    alcoholTolerance: 11,
    origin: '🇪🇺 Europa',
    supplier: 'Fermentis',
    aromaFlavor: 'Frutado leve quando em temperaturas mais altas, clean quando frio',
    rehydrationNotes: 'Reidratar em água a 23-27°C',
    starterNotes: null,
    notes: 'Levedura lager europeia tradicional',
    isPublic: true,
    createdAt: daysAgo(130),
  },
  {
    id: '12',
    name: 'S-189 SafLager',
    type: YeastType.LAGER,
    attenuation: 80,
    attenuationMax: 84,
    flocculation: YeastFlocculation.HIGH,
    minTemp: 9,
    maxTemp: 15,
    format: YeastFormat.DRY,
    alcoholTolerance: 13,
    origin: '🇩🇪 Alemanha',
    supplier: 'Fermentis',
    aromaFlavor: 'Extremamente limpo e neutro',
    rehydrationNotes: 'Reidratar em água a 23-27°C',
    starterNotes: null,
    notes: 'Perfil ultra-clean, ideal para Pilsners',
    isPublic: true,
    createdAt: daysAgo(110),
  },

  // SELVAGENS (3 itens)
  {
    id: '13',
    name: 'WLP650 Brett Bruxellensis',
    type: YeastType.WILD,
    attenuation: 85,
    attenuationMax: 100,
    flocculation: YeastFlocculation.LOW,
    minTemp: 18,
    maxTemp: 28,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 12,
    origin: '🇧🇪 Bélgica',
    supplier: 'White Labs',
    aromaFlavor: 'Funky, terroso, frutado complexo, couro, estábulo',
    rehydrationNotes: null,
    starterNotes: 'Starter opcional, Brett é resistente',
    notes: 'Brettanomyces clássica, super atenuação, paciência necessária',
    isPublic: true,
    createdAt: daysAgo(60),
  },
  {
    id: '14',
    name: 'WY5526 Brett Lambicus',
    type: YeastType.WILD,
    attenuation: 80,
    attenuationMax: 100,
    flocculation: YeastFlocculation.LOW,
    minTemp: 18,
    maxTemp: 25,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 12,
    origin: '🇧🇪 Bélgica',
    supplier: 'Wyeast',
    aromaFlavor: 'Intenso caráter funky, frutado intenso, pêssego',
    rehydrationNotes: null,
    starterNotes: 'Starter pequeno suficiente',
    notes: 'Brett agressiva, ideal para Lambics e sours',
    isPublic: true,
    createdAt: daysAgo(70),
  },
  {
    id: '15',
    name: 'Brett Trois (WLP644)',
    type: YeastType.WILD,
    attenuation: 85,
    attenuationMax: 100,
    flocculation: YeastFlocculation.MEDIUM,
    minTemp: 20,
    maxTemp: 28,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 12,
    origin: '🇺🇸 EUA',
    supplier: 'White Labs',
    aromaFlavor: 'Frutas tropicais, manga, abacaxi, menos funky',
    rehydrationNotes: null,
    starterNotes: 'Starter recomendado',
    notes: 'Brett "amigável", pode ser usada como ale principal',
    isPublic: false,
    createdAt: daysAgo(50),
  },

  // BACTÉRIAS (3 itens)
  {
    id: '16',
    name: 'Lactobacillus Plantarum',
    type: YeastType.BACTERIA,
    attenuation: null,
    attenuationMax: null,
    flocculation: YeastFlocculation.LOW,
    minTemp: 30,
    maxTemp: 40,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 0,
    origin: null,
    supplier: 'White Labs',
    aromaFlavor: 'Acidez lática limpa, sem funky',
    rehydrationNotes: null,
    starterNotes: 'Propagar em mosto não lupulado',
    notes: 'Produz acidez rápida em 24-48h, ideal para kettle souring',
    isPublic: true,
    createdAt: daysAgo(40),
  },
  {
    id: '17',
    name: 'Pediococcus',
    type: YeastType.BACTERIA,
    attenuation: null,
    attenuationMax: null,
    flocculation: YeastFlocculation.LOW,
    minTemp: 18,
    maxTemp: 28,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 0,
    origin: null,
    supplier: 'Wyeast',
    aromaFlavor: 'Acidez suave, diacetil, caráter amanteigado',
    rehydrationNotes: null,
    starterNotes: 'Propagar com cuidado',
    notes: 'Produz acidez lenta, usado em Flanders e Lambics',
    isPublic: true,
    createdAt: daysAgo(35),
  },
  {
    id: '18',
    name: 'Lactobacillus Brevis',
    type: YeastType.BACTERIA,
    attenuation: null,
    attenuationMax: null,
    flocculation: YeastFlocculation.LOW,
    minTemp: 25,
    maxTemp: 35,
    format: YeastFormat.LIQUID,
    alcoholTolerance: 0,
    origin: null,
    supplier: 'White Labs',
    aromaFlavor: 'Acidez lática, leve funky, complexo',
    rehydrationNotes: null,
    starterNotes: 'Propagar em mosto',
    notes: 'Produz acidez moderada, tolera melhor lúpulo que Plantarum',
    isPublic: true,
    createdAt: daysAgo(30),
  },
]

// Função para calcular estatísticas das leveduras
export const calculateYeastStats = (yeasts: Yeast[]) => {
  const totalYeasts = yeasts.length
  const ales = yeasts.filter(y => y.type === YeastType.ALE).length
  const lagers = yeasts.filter(y => y.type === YeastType.LAGER).length
  const wildAndBacteria = yeasts.filter(
    y => y.type === YeastType.WILD || y.type === YeastType.BACTERIA
  ).length

  return {
    totalYeasts,
    ales,
    lagers,
    wildAndBacteria,
  }
}

// Função para filtrar leveduras por tipo
export const filterYeastsByType = (
  yeasts: Yeast[],
  type: YeastType | 'all'
): Yeast[] => {
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
      yeast.aromaFlavor?.toLowerCase().includes(lowerQuery)
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
      return sorted.sort(
        (a, b) =>
          (b.attenuationMax || b.attenuation || 0) -
          (a.attenuationMax || a.attenuation || 0)
      )
    case 'temperature':
      return sorted.sort((a, b) => (a.minTemp || 0) - (b.minTemp || 0))
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type))
    default:
      return sorted
  }
}

