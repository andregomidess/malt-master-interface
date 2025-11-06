// Tipos de lúpulos baseados no backend
export enum HopForm {
  PELLET = 'pellet',
  LEAF = 'leaf',
  CRYO = 'cryo',
  EXTRACT = 'extract',
}

export enum HopUse {
  BITTERING = 'bittering',
  AROMA = 'aroma',
  DRY_HOPPING = 'dry_hopping',
  DUAL_PURPOSE = 'dual_purpose',
}

// Traduções
export const hopFormLabels: Record<HopForm, string> = {
  [HopForm.PELLET]: 'Pellets',
  [HopForm.LEAF]: 'Flor',
  [HopForm.CRYO]: 'Cryo',
  [HopForm.EXTRACT]: 'Extrato',
}

export const hopUseLabels: Record<HopUse, string> = {
  [HopUse.BITTERING]: 'Amargor',
  [HopUse.AROMA]: 'Aroma',
  [HopUse.DRY_HOPPING]: 'Dry Hopping',
  [HopUse.DUAL_PURPOSE]: 'Duplo Propósito',
}

// Interface do lúpulo
export interface Hop {
  id: string
  name: string
  alphaAcids: number // %
  betaAcids: number // %
  cohumulone: number | null // %
  totalOils: number | null // ml/100g
  form: HopForm
  uses: HopUse[]
  aromaFlavor: string | null
  harvestYear: number | null
  storageCondition: string | null
  hsi: number | null // 0-1
  costPerKilogram: number | null // R$
  notes: string | null
  origin: string | null
  supplier: string | null
  isPublic: boolean // se é do catálogo público ou do usuário
  createdAt: Date
}

// Funções auxiliares para classificação
export const getAlphaAcidsLevel = (
  alphaAcids: number
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

// Verifica se é lúpulo nobre (baixo alfa, baixo cohumulone)
export const isNobleHop = (hop: Hop): boolean => {
  return hop.alphaAcids < 6 && (hop.cohumulone || 100) < 25
}

// Verifica se é lúpulo moderno (alto alfa para IPAs)
export const isModernHop = (hop: Hop): boolean => {
  return hop.alphaAcids > 11 && (hop.totalOils || 0) > 1.5
}

// Configuração de cores por uso principal
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

// Função para criar datas relativas
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Dados mockados - 16 lúpulos variados
export const mockHopsData: Hop[] = [
  // AMARGOR CLÁSSICO
  {
    id: '1',
    name: 'Magnum',
    alphaAcids: 14.5,
    betaAcids: 5.8,
    cohumulone: 25,
    totalOils: 2.5,
    form: HopForm.PELLET,
    uses: [HopUse.BITTERING],
    aromaFlavor: 'Neutro, levemente especiado',
    harvestYear: 2023,
    storageCondition: 'Freezer',
    hsi: 0.42,
    costPerKilogram: 120.0,
    notes: 'Excelente para amargor limpo',
    origin: '🇩🇪 Alemanha',
    supplier: 'HopUnion',
    isPublic: true,
    createdAt: daysAgo(200),
  },
  {
    id: '2',
    name: 'Warrior',
    alphaAcids: 16.2,
    betaAcids: 4.5,
    cohumulone: 28,
    totalOils: 1.8,
    form: HopForm.PELLET,
    uses: [HopUse.BITTERING],
    aromaFlavor: 'Resinoso, levemente herbal',
    harvestYear: 2023,
    storageCondition: 'Freezer',
    hsi: 0.35,
    costPerKilogram: 140.0,
    notes: 'Alto alfa ácido, ideal para IBUs',
    origin: '🇺🇸 EUA',
    supplier: 'Yakima Chief',
    isPublic: true,
    createdAt: daysAgo(180),
  },
  {
    id: '3',
    name: 'Columbus',
    alphaAcids: 15.8,
    betaAcids: 4.2,
    cohumulone: 32,
    totalOils: 2.8,
    form: HopForm.PELLET,
    uses: [HopUse.BITTERING, HopUse.DUAL_PURPOSE],
    aromaFlavor: 'Terroso, pungente, resinoso',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.38,
    costPerKilogram: 150.0,
    notes: 'Também conhecido como CTZ',
    origin: '🇺🇸 EUA',
    supplier: 'Hop Head Farms',
    isPublic: true,
    createdAt: daysAgo(45),
  },

  // AROMA NOBRE
  {
    id: '4',
    name: 'Saaz',
    alphaAcids: 3.5,
    betaAcids: 4.0,
    cohumulone: 22,
    totalOils: 0.8,
    form: HopForm.LEAF,
    uses: [HopUse.AROMA],
    aromaFlavor: 'Especiado, terroso, delicado',
    harvestYear: 2023,
    storageCondition: 'Geladeira',
    hsi: 0.28,
    costPerKilogram: 180.0,
    notes: 'Lúpulo nobre tcheco clássico',
    origin: '🇨🇿 República Tcheca',
    supplier: 'Czech Hops',
    isPublic: true,
    createdAt: daysAgo(250),
  },
  {
    id: '5',
    name: 'Hallertau Mittelfrüh',
    alphaAcids: 4.2,
    betaAcids: 3.8,
    cohumulone: 20,
    totalOils: 0.9,
    form: HopForm.PELLET,
    uses: [HopUse.AROMA],
    aromaFlavor: 'Floral, especiado, levemente frutado',
    harvestYear: 2023,
    storageCondition: 'Freezer',
    hsi: 0.25,
    costPerKilogram: 200.0,
    notes: 'Lúpulo nobre alemão tradicional',
    origin: '🇩🇪 Alemanha',
    supplier: 'German Hop Growers',
    isPublic: true,
    createdAt: daysAgo(220),
  },
  {
    id: '6',
    name: 'Tettnang',
    alphaAcids: 4.5,
    betaAcids: 3.5,
    cohumulone: 23,
    totalOils: 0.7,
    form: HopForm.PELLET,
    uses: [HopUse.AROMA],
    aromaFlavor: 'Herbal, especiado, levemente floral',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.27,
    costPerKilogram: 190.0,
    notes: 'Ideal para lagers alemãs',
    origin: '🇩🇪 Alemanha',
    supplier: 'HopSteiner',
    isPublic: true,
    createdAt: daysAgo(100),
  },

  // CÍTRICO AMERICANO
  {
    id: '7',
    name: 'Cascade',
    alphaAcids: 6.8,
    betaAcids: 5.2,
    cohumulone: 35,
    totalOils: 1.5,
    form: HopForm.PELLET,
    uses: [HopUse.AROMA, HopUse.DRY_HOPPING, HopUse.DUAL_PURPOSE],
    aromaFlavor: 'Cítrico, grapefruit, floral',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.45,
    costPerKilogram: 160.0,
    notes: 'O lúpulo americano clássico',
    origin: '🇺🇸 EUA',
    supplier: 'Hop Union',
    isPublic: true,
    createdAt: daysAgo(90),
  },
  {
    id: '8',
    name: 'Centennial',
    alphaAcids: 10.2,
    betaAcids: 4.8,
    cohumulone: 30,
    totalOils: 2.2,
    form: HopForm.PELLET,
    uses: [HopUse.DUAL_PURPOSE, HopUse.AROMA],
    aromaFlavor: 'Cítrico, limão, floral',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.4,
    costPerKilogram: 170.0,
    notes: 'Super Cascade com mais alfa',
    origin: '🇺🇸 EUA',
    supplier: 'Yakima Chief',
    isPublic: true,
    createdAt: daysAgo(75),
  },
  {
    id: '9',
    name: 'Amarillo',
    alphaAcids: 9.5,
    betaAcids: 6.0,
    cohumulone: 28,
    totalOils: 1.8,
    form: HopForm.PELLET,
    uses: [HopUse.DUAL_PURPOSE, HopUse.AROMA, HopUse.DRY_HOPPING],
    aromaFlavor: 'Laranja, tangerina, flores',
    harvestYear: 2023,
    storageCondition: 'Freezer',
    hsi: 0.42,
    costPerKilogram: 185.0,
    notes: 'Perfil cítrico intenso',
    origin: '🇺🇸 EUA',
    supplier: 'Virgil Gamache Farms',
    isPublic: false,
    createdAt: daysAgo(120),
  },

  // MODERNO/IPA
  {
    id: '10',
    name: 'Mosaic',
    alphaAcids: 12.8,
    betaAcids: 3.9,
    cohumulone: 26,
    totalOils: 2.5,
    form: HopForm.PELLET,
    uses: [HopUse.DUAL_PURPOSE, HopUse.AROMA, HopUse.DRY_HOPPING],
    aromaFlavor: 'Frutas tropicais, manga, mirtilo, tangerina',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.48,
    costPerKilogram: 220.0,
    notes: 'Um dos lúpulos mais populares para IPAs',
    origin: '🇺🇸 EUA',
    supplier: 'Hop Breeding Company',
    isPublic: true,
    createdAt: daysAgo(30),
  },
  {
    id: '11',
    name: 'Citra',
    alphaAcids: 13.2,
    betaAcids: 4.1,
    cohumulone: 24,
    totalOils: 2.8,
    form: HopForm.CRYO,
    uses: [HopUse.DUAL_PURPOSE, HopUse.AROMA, HopUse.DRY_HOPPING],
    aromaFlavor: 'Limão, lima, frutas tropicais, lichia',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.5,
    costPerKilogram: 280.0,
    notes: 'Versão Cryo - mais concentrado',
    origin: '🇺🇸 EUA',
    supplier: 'Yakima Chief',
    isPublic: false,
    createdAt: daysAgo(20),
  },
  {
    id: '12',
    name: 'Simcoe',
    alphaAcids: 13.5,
    betaAcids: 4.5,
    cohumulone: 18,
    totalOils: 2.3,
    form: HopForm.PELLET,
    uses: [HopUse.DUAL_PURPOSE, HopUse.AROMA, HopUse.DRY_HOPPING],
    aromaFlavor: 'Pinho, terroso, cítrico, frutas da paixão',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.46,
    costPerKilogram: 200.0,
    notes: 'Perfil complexo e versátil',
    origin: '🇺🇸 EUA',
    supplier: 'Yakima Chief',
    isPublic: true,
    createdAt: daysAgo(60),
  },
  {
    id: '13',
    name: 'Galaxy',
    alphaAcids: 14.8,
    betaAcids: 5.8,
    cohumulone: 38,
    totalOils: 3.2,
    form: HopForm.PELLET,
    uses: [HopUse.DUAL_PURPOSE, HopUse.AROMA, HopUse.DRY_HOPPING],
    aromaFlavor: 'Maracujá, pêssego, cítrico intenso',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.52,
    costPerKilogram: 250.0,
    notes: 'Lúpulo australiano de destaque',
    origin: '🇦🇺 Austrália',
    supplier: 'Hop Products Australia',
    isPublic: true,
    createdAt: daysAgo(40),
  },

  // FLORAL/ESPECIARIAS
  {
    id: '14',
    name: 'Fuggle',
    alphaAcids: 4.8,
    betaAcids: 2.2,
    cohumulone: 28,
    totalOils: 1.0,
    form: HopForm.LEAF,
    uses: [HopUse.AROMA],
    aromaFlavor: 'Terroso, amadeirado, levemente frutado',
    harvestYear: 2023,
    storageCondition: 'Geladeira',
    hsi: 0.32,
    costPerKilogram: 150.0,
    notes: 'Lúpulo tradicional inglês',
    origin: '🇬🇧 Inglaterra',
    supplier: 'Charles Faram',
    isPublic: true,
    createdAt: daysAgo(280),
  },
  {
    id: '15',
    name: 'East Kent Goldings',
    alphaAcids: 5.2,
    betaAcids: 2.5,
    cohumulone: 25,
    totalOils: 0.9,
    form: HopForm.PELLET,
    uses: [HopUse.AROMA],
    aromaFlavor: 'Floral, especiado, mel, terroso',
    harvestYear: 2023,
    storageCondition: 'Freezer',
    hsi: 0.3,
    costPerKilogram: 175.0,
    notes: 'Clássico inglês para ales',
    origin: '🇬🇧 Inglaterra',
    supplier: 'Charles Faram',
    isPublic: true,
    createdAt: daysAgo(190),
  },

  // FRUTADO/TROPICAL
  {
    id: '16',
    name: 'El Dorado',
    alphaAcids: 15.5,
    betaAcids: 7.2,
    cohumulone: 32,
    totalOils: 3.5,
    form: HopForm.PELLET,
    uses: [HopUse.DUAL_PURPOSE, HopUse.AROMA, HopUse.DRY_HOPPING],
    aromaFlavor: 'Frutas tropicais, pêra, melão, doce de bala',
    harvestYear: 2024,
    storageCondition: 'Freezer',
    hsi: 0.55,
    costPerKilogram: 210.0,
    notes: 'Perfil único e tropical',
    origin: '🇺🇸 EUA',
    supplier: 'CLS Farms',
    isPublic: false,
    createdAt: daysAgo(50),
  },
]

// Função para calcular estatísticas dos lúpulos
export const calculateHopStats = (hops: Hop[]) => {
  const totalHops = hops.length

  // Contar por uso principal (primeiro da lista)
  const bitteringCount = hops.filter(h => h.uses[0] === HopUse.BITTERING).length
  const aromaCount = hops.filter(h => h.uses[0] === HopUse.AROMA).length
  const dryHoppingCount = hops.filter(h => h.uses[0] === HopUse.DRY_HOPPING)
    .length
  const dualPurposeCount = hops.filter(h => h.uses[0] === HopUse.DUAL_PURPOSE)
    .length

  return {
    totalHops,
    bitteringCount,
    aromaCount,
    dryHoppingCount,
    dualPurposeCount,
  }
}

// Função para filtrar lúpulos por uso
export const filterHopsByUse = (
  hops: Hop[],
  use: HopUse | 'all'
): Hop[] => {
  if (use === 'all') return hops
  return hops.filter(hop => hop.uses.includes(use))
}

// Função para buscar lúpulos
export const searchHops = (hops: Hop[], query: string): Hop[] => {
  const lowerQuery = query.toLowerCase()
  return hops.filter(
    hop =>
      hop.name.toLowerCase().includes(lowerQuery) ||
      hop.origin?.toLowerCase().includes(lowerQuery) ||
      hop.aromaFlavor?.toLowerCase().includes(lowerQuery)
  )
}

// Função para ordenar lúpulos
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
        (a, b) => (a.costPerKilogram || 0) - (b.costPerKilogram || 0)
      )
    case 'origin':
      return sorted.sort((a, b) =>
        (a.origin || '').localeCompare(b.origin || '')
      )
    default:
      return sorted
  }
}

