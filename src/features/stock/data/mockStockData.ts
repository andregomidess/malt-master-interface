// Tipos de itens de estoque baseados no backend
export enum InventoryItemType {
  FERMENTABLE = 'fermentable',
  HOP = 'hop',
  YEAST = 'yeast',
}

export enum FermentableInventoryUnit {
  G = 'g',
  KG = 'kg',
  LB = 'lb',
  SACK = 'sack',
}

export enum HopInventoryUnit {
  G = 'g',
  KG = 'kg',
  OZ = 'oz',
}

export enum YeastInventoryUnit {
  PACK = 'pack',
  VIAL = 'vial',
  SLURRY_ML = 'slurry_ml',
  CELLS_BILLION = 'cells_billion',
}

// Interface base
interface BaseInventoryItem {
  id: string
  type: InventoryItemType
  name: string
  quantity: number
  purchaseDate: Date
  bestBeforeDate: Date | null
  costPerUnit: number
  notes?: string
  imageUrl?: string
  totalValue: number
  isExpired: boolean
  isNearExpiry: boolean
  daysUntilExpiry: number | null
}

// Interface para Fermentáveis
export interface FermentableInventoryItem extends BaseInventoryItem {
  type: InventoryItemType.FERMENTABLE
  unit: FermentableInventoryUnit
  extractPotential: number | null
  lotNumber: string | null
  moisture: number | null
  protein: number | null
  isQualityAcceptable: boolean
}

// Interface para Lúpulos
export interface HopInventoryItem extends BaseInventoryItem {
  type: InventoryItemType.HOP
  unit: HopInventoryUnit
  alphaAcidsAtPurchase: number | null
  currentAlphaAcids: number | null
  harvestYear: number | null
  storageCondition: string | null
  isStillFresh: boolean
}

// Interface para Leveduras
export interface YeastInventoryItem extends BaseInventoryItem {
  type: InventoryItemType.YEAST
  unit: YeastInventoryUnit
  productionDate: Date | null
  viability: number | null
  currentViability: number | null
  cellCount: number | null
  needsStarter: boolean
}

export type StockItem =
  | FermentableInventoryItem
  | HopInventoryItem
  | YeastInventoryItem

// Funções auxiliares para cálculos
const calculateTotalValue = (quantity: number, costPerUnit: number): number => {
  return quantity * costPerUnit
}

const calculateDaysUntilExpiry = (bestBeforeDate: Date | null): number | null => {
  if (!bestBeforeDate) return null
  const today = new Date()
  const diffTime = bestBeforeDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const calculateIsExpired = (bestBeforeDate: Date | null): boolean => {
  if (!bestBeforeDate) return false
  return bestBeforeDate < new Date()
}

const calculateIsNearExpiry = (bestBeforeDate: Date | null): boolean => {
  if (!bestBeforeDate) return false
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  return bestBeforeDate <= thirtyDaysFromNow && !calculateIsExpired(bestBeforeDate)
}

const calculateCurrentAlphaAcids = (
  alphaAcidsAtPurchase: number,
  purchaseDate: Date,
  storageCondition: string | null
): number => {
  const monthsStored =
    (new Date().getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

  let degradationRate = 0.05 // 5% ao mês para condições normais

  if (storageCondition?.toLowerCase().includes('freezer')) {
    degradationRate = 0.01 // 1% ao mês no freezer
  } else if (storageCondition?.toLowerCase().includes('geladeira')) {
    degradationRate = 0.02 // 2% ao mês na geladeira
  }

  const degradationFactor = Math.pow(1 - degradationRate, monthsStored)
  return alphaAcidsAtPurchase * degradationFactor
}

const calculateIsStillFresh = (
  purchaseDate: Date,
  storageCondition: string | null
): boolean => {
  const monthsStored =
    (new Date().getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

  if (storageCondition?.toLowerCase().includes('freezer')) {
    return monthsStored <= 36 // 3 anos no freezer
  } else if (storageCondition?.toLowerCase().includes('geladeira')) {
    return monthsStored <= 24 // 2 anos na geladeira
  }

  return monthsStored <= 12 // 1 ano em temperatura ambiente
}

const calculateCurrentViability = (
  viability: number,
  productionDate: Date,
  unit: YeastInventoryUnit
): number => {
  const monthsOld =
    (new Date().getTime() - productionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

  const degradationRate = unit === YeastInventoryUnit.VIAL ? 0.2 : 0.1
  const degradationFactor = Math.pow(1 - degradationRate, monthsOld)

  return Math.max(0, viability * degradationFactor)
}

const calculateIsQualityAcceptable = (
  moisture: number | null,
  protein: number | null
): boolean => {
  if (moisture && moisture > 15) return false
  if (protein && protein > 13) return false
  return true
}

// Função para criar datas relativas
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const daysFromNow = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

// Dados mockados
export const mockStockData: StockItem[] = [
  // FERMENTÁVEIS (4 itens)
  {
    id: '1',
    type: InventoryItemType.FERMENTABLE,
    name: 'Malte Pilsen',
    quantity: 25,
    unit: FermentableInventoryUnit.KG,
    purchaseDate: daysAgo(15),
    bestBeforeDate: daysFromNow(350),
    costPerUnit: 8.5,
    extractPotential: 81,
    lotNumber: 'LOT2024-001',
    moisture: 4.5,
    protein: 11.2,
    notes: 'Malte base para cervejas lager',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get isQualityAcceptable() {
      return calculateIsQualityAcceptable(this.moisture, this.protein)
    },
  },
  {
    id: '2',
    type: InventoryItemType.FERMENTABLE,
    name: 'Malte Munich',
    quantity: 10,
    unit: FermentableInventoryUnit.KG,
    purchaseDate: daysAgo(60),
    bestBeforeDate: daysFromNow(20),
    costPerUnit: 9.8,
    extractPotential: 77,
    lotNumber: 'LOT2024-045',
    moisture: 16.5,
    protein: 12.8,
    notes: 'Malte especial - próximo ao vencimento e com umidade alta',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get isQualityAcceptable() {
      return calculateIsQualityAcceptable(this.moisture, this.protein)
    },
  },
  {
    id: '3',
    type: InventoryItemType.FERMENTABLE,
    name: 'Malte Caramelo 60L',
    quantity: 5,
    unit: FermentableInventoryUnit.KG,
    purchaseDate: daysAgo(200),
    bestBeforeDate: daysAgo(10),
    costPerUnit: 12.5,
    extractPotential: 74,
    lotNumber: 'LOT2023-112',
    moisture: 5.2,
    protein: 10.5,
    notes: 'VENCIDO - usar com cautela',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get isQualityAcceptable() {
      return calculateIsQualityAcceptable(this.moisture, this.protein)
    },
  },
  {
    id: '4',
    type: InventoryItemType.FERMENTABLE,
    name: 'Açúcar Cristal',
    quantity: 2,
    unit: FermentableInventoryUnit.KG,
    purchaseDate: daysAgo(5),
    bestBeforeDate: daysFromNow(700),
    costPerUnit: 6.0,
    extractPotential: 100,
    lotNumber: null,
    moisture: 0.5,
    protein: 0,
    notes: 'Açúcar para priming e adjunto',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get isQualityAcceptable() {
      return calculateIsQualityAcceptable(this.moisture, this.protein)
    },
  },

  // LÚPULOS (4 itens)
  {
    id: '5',
    type: InventoryItemType.HOP,
    name: 'Cascade',
    quantity: 500,
    unit: HopInventoryUnit.G,
    purchaseDate: daysAgo(30),
    bestBeforeDate: daysFromNow(335),
    costPerUnit: 0.12,
    alphaAcidsAtPurchase: 7.5,
    harvestYear: 2024,
    storageCondition: 'freezer',
    notes: 'Lúpulo americano clássico para aroma',
    imageUrl: 'https://images.unsplash.com/photo-1597822738124-151f4ffe64a6?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentAlphaAcids() {
      return calculateCurrentAlphaAcids(
        this.alphaAcidsAtPurchase!,
        this.purchaseDate,
        this.storageCondition
      )
    },
    get isStillFresh() {
      return calculateIsStillFresh(this.purchaseDate, this.storageCondition)
    },
  },
  {
    id: '6',
    type: InventoryItemType.HOP,
    name: 'Amarillo',
    quantity: 250,
    unit: HopInventoryUnit.G,
    purchaseDate: daysAgo(400),
    bestBeforeDate: daysFromNow(15),
    costPerUnit: 0.15,
    alphaAcidsAtPurchase: 9.2,
    harvestYear: 2023,
    storageCondition: 'geladeira',
    notes: 'Lúpulo envelhecido - usar logo',
    imageUrl: 'https://images.unsplash.com/photo-1597822738124-151f4ffe64a6?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentAlphaAcids() {
      return calculateCurrentAlphaAcids(
        this.alphaAcidsAtPurchase!,
        this.purchaseDate,
        this.storageCondition
      )
    },
    get isStillFresh() {
      return calculateIsStillFresh(this.purchaseDate, this.storageCondition)
    },
  },
  {
    id: '7',
    type: InventoryItemType.HOP,
    name: 'Saaz',
    quantity: 100,
    unit: HopInventoryUnit.G,
    purchaseDate: daysAgo(450),
    bestBeforeDate: daysAgo(5),
    costPerUnit: 0.18,
    alphaAcidsAtPurchase: 3.5,
    harvestYear: 2022,
    storageCondition: 'temperatura ambiente',
    notes: 'VENCIDO - lúpulo tcheco nobre',
    imageUrl: 'https://images.unsplash.com/photo-1597822738124-151f4ffe64a6?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentAlphaAcids() {
      return calculateCurrentAlphaAcids(
        this.alphaAcidsAtPurchase!,
        this.purchaseDate,
        this.storageCondition
      )
    },
    get isStillFresh() {
      return calculateIsStillFresh(this.purchaseDate, this.storageCondition)
    },
  },
  {
    id: '8',
    type: InventoryItemType.HOP,
    name: 'Mosaic',
    quantity: 1,
    unit: HopInventoryUnit.KG,
    purchaseDate: daysAgo(10),
    bestBeforeDate: daysFromNow(710),
    costPerUnit: 180.0,
    alphaAcidsAtPurchase: 12.8,
    harvestYear: 2024,
    storageCondition: 'freezer',
    notes: 'Lúpulo premium recém-comprado',
    imageUrl: 'https://images.unsplash.com/photo-1597822738124-151f4ffe64a6?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentAlphaAcids() {
      return calculateCurrentAlphaAcids(
        this.alphaAcidsAtPurchase!,
        this.purchaseDate,
        this.storageCondition
      )
    },
    get isStillFresh() {
      return calculateIsStillFresh(this.purchaseDate, this.storageCondition)
    },
  },

  // LEVEDURAS (4 itens)
  {
    id: '9',
    type: InventoryItemType.YEAST,
    name: 'Safale US-05',
    quantity: 3,
    unit: YeastInventoryUnit.PACK,
    purchaseDate: daysAgo(20),
    bestBeforeDate: daysFromNow(710),
    costPerUnit: 18.0,
    productionDate: daysAgo(60),
    viability: 97,
    cellCount: 200,
    notes: 'Levedura seca American Ale',
    imageUrl: 'https://images.unsplash.com/photo-1574843715415-47fbd48c829f?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentViability() {
      return calculateCurrentViability(
        this.viability!,
        this.productionDate!,
        this.unit
      )
    },
    get needsStarter() {
      return this.currentViability! < 80
    },
  },
  {
    id: '10',
    type: InventoryItemType.YEAST,
    name: 'Wyeast 1056 American Ale',
    quantity: 2,
    unit: YeastInventoryUnit.VIAL,
    purchaseDate: daysAgo(90),
    bestBeforeDate: daysFromNow(25),
    costPerUnit: 45.0,
    productionDate: daysAgo(120),
    viability: 100,
    cellCount: 100,
    notes: 'Levedura líquida - PRECISA STARTER',
    imageUrl: 'https://images.unsplash.com/photo-1574843715415-47fbd48c829f?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentViability() {
      return calculateCurrentViability(
        this.viability!,
        this.productionDate!,
        this.unit
      )
    },
    get needsStarter() {
      return this.currentViability! < 80
    },
  },
  {
    id: '11',
    type: InventoryItemType.YEAST,
    name: 'Fermentis SafLager W-34/70',
    quantity: 5,
    unit: YeastInventoryUnit.PACK,
    purchaseDate: daysAgo(180),
    bestBeforeDate: daysAgo(15),
    costPerUnit: 22.0,
    productionDate: daysAgo(210),
    viability: 97,
    cellCount: 200,
    notes: 'VENCIDO - Levedura lager',
    imageUrl: 'https://images.unsplash.com/photo-1574843715415-47fbd48c829f?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentViability() {
      return calculateCurrentViability(
        this.viability!,
        this.productionDate!,
        this.unit
      )
    },
    get needsStarter() {
      return this.currentViability! < 80
    },
  },
  {
    id: '12',
    type: InventoryItemType.YEAST,
    name: 'Mangrove Jack M44 US West Coast',
    quantity: 4,
    unit: YeastInventoryUnit.PACK,
    purchaseDate: daysAgo(5),
    bestBeforeDate: daysFromNow(720),
    costPerUnit: 20.0,
    productionDate: daysAgo(30),
    viability: 98,
    cellCount: 200,
    notes: 'Levedura nova para IPAs',
    imageUrl: 'https://images.unsplash.com/photo-1574843715415-47fbd48c829f?w=100&h=100&fit=crop',
    get totalValue() {
      return calculateTotalValue(this.quantity, this.costPerUnit)
    },
    get isExpired() {
      return calculateIsExpired(this.bestBeforeDate)
    },
    get isNearExpiry() {
      return calculateIsNearExpiry(this.bestBeforeDate)
    },
    get daysUntilExpiry() {
      return calculateDaysUntilExpiry(this.bestBeforeDate)
    },
    get currentViability() {
      return calculateCurrentViability(
        this.viability!,
        this.productionDate!,
        this.unit
      )
    },
    get needsStarter() {
      return this.currentViability! < 80
    },
  },
]

// Função para calcular estatísticas do estoque
export const calculateStockStats = (items: StockItem[]) => {
  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0)
  const itemsNearExpiry = items.filter(item => item.isNearExpiry).length
  const itemsExpired = items.filter(item => item.isExpired).length

  return {
    totalItems,
    totalValue,
    itemsNearExpiry,
    itemsExpired,
  }
}

// Função para filtrar itens por tipo
export const filterItemsByType = (
  items: StockItem[],
  type: InventoryItemType | 'all'
): StockItem[] => {
  if (type === 'all') return items
  return items.filter(item => item.type === type)
}

// Função para buscar itens
export const searchItems = (items: StockItem[], query: string): StockItem[] => {
  const lowerQuery = query.toLowerCase()
  return items.filter(item => item.name.toLowerCase().includes(lowerQuery))
}

