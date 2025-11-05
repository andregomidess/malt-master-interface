// Tipos de equipamentos baseados no backend
export enum EquipmentType {
  KETTLE = 'kettle',
  FERMENTER = 'fermenter',
  CHILLER = 'chiller',
}

export enum EquipmentMaterial {
  STAINLESS_STEEL = 'stainless_steel',
  ALUMINUM = 'aluminum',
  PLASTIC = 'plastic',
  GLASS = 'glass',
  COPPER = 'copper',
}

export enum HeatingSource {
  GAS = 'gas',
  ELECTRIC = 'electric',
  INDUCTION = 'induction',
  STEAM = 'steam',
  DIRECT_FIRE = 'direct_fire',
}

export enum CoolingType {
  AIR_CONDITIONING = 'air_conditioning',
  GLYCOL = 'glycol',
  IMMERSION_COIL = 'immersion_coil',
  PLATE_CHILLER = 'plate_chiller',
  NATURAL = 'natural',
}

export enum ChillerType {
  COUNTERFLOW = 'counterflow',
  PLATE = 'plate',
  IMMERSION = 'immersion',
  ICE_BATH = 'ice_bath',
}

// Traduções
export const equipmentTypeLabels: Record<EquipmentType, string> = {
  [EquipmentType.KETTLE]: 'Panela',
  [EquipmentType.FERMENTER]: 'Fermentador',
  [EquipmentType.CHILLER]: 'Resfriador',
}

export const materialLabels: Record<EquipmentMaterial, string> = {
  [EquipmentMaterial.STAINLESS_STEEL]: 'Inox',
  [EquipmentMaterial.ALUMINUM]: 'Alumínio',
  [EquipmentMaterial.PLASTIC]: 'Plástico',
  [EquipmentMaterial.GLASS]: 'Vidro',
  [EquipmentMaterial.COPPER]: 'Cobre',
}

export const heatingSourceLabels: Record<HeatingSource, string> = {
  [HeatingSource.GAS]: 'Gás',
  [HeatingSource.ELECTRIC]: 'Elétrico',
  [HeatingSource.INDUCTION]: 'Indução',
  [HeatingSource.STEAM]: 'Vapor',
  [HeatingSource.DIRECT_FIRE]: 'Fogo Direto',
}

export const coolingTypeLabels: Record<CoolingType, string> = {
  [CoolingType.AIR_CONDITIONING]: 'Ar Condicionado',
  [CoolingType.GLYCOL]: 'Glicol',
  [CoolingType.IMMERSION_COIL]: 'Serpentina de Imersão',
  [CoolingType.PLATE_CHILLER]: 'Plate Chiller',
  [CoolingType.NATURAL]: 'Natural',
}

export const chillerTypeLabels: Record<ChillerType, string> = {
  [ChillerType.COUNTERFLOW]: 'Contracorrente',
  [ChillerType.PLATE]: 'Placas',
  [ChillerType.IMMERSION]: 'Imersão',
  [ChillerType.ICE_BATH]: 'Banho de Gelo',
}

// Interface base
interface BaseEquipment {
  id: string
  name: string
  description: string | null
  type: EquipmentType
  material: EquipmentMaterial
  totalCapacity: number // em litros
  usableVolume: number // em litros
  isPublic: boolean // se é público ou do usuário
  createdAt: Date
}

// Interface para Panela/Caldeira
export interface KettleEquipment extends BaseEquipment {
  type: EquipmentType.KETTLE
  kettleLoss: number // litros
  evaporationRate: number // %
  boilOffRate: number // %
  heatingPower: number // W
  heatingSource: HeatingSource
}

// Interface para Fermentador
export interface FermenterEquipment extends BaseEquipment {
  type: EquipmentType.FERMENTER
  fermenterLoss: number // litros
  coneBottomVolume: number // litros
  hasTemperatureControl: boolean
  maxPressure: number // PSI
  coolingType: CoolingType
  minTemperature: number // °C
  maxTemperature: number // °C
}

// Interface para Resfriador
export interface ChillerEquipment extends BaseEquipment {
  type: EquipmentType.CHILLER
  coolingCapacity: number // W
  flowRate: number // L/min
  inletTemperature: number // °C
  outletTemperature: number // °C
  chillerType: ChillerType
  tubeLength: number // metros
  tubeDiameter: number // mm
}

export type Equipment = KettleEquipment | FermenterEquipment | ChillerEquipment

// Função para criar datas relativas
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Dados mockados
export const mockEquipmentData: Equipment[] = [
  // PANELAS/CALDEIRAS (4 itens)
  {
    id: '1',
    name: 'Panela Inox 50L',
    description: 'Panela de fervura em inox 304, ideal para brassagens de até 40L',
    type: EquipmentType.KETTLE,
    material: EquipmentMaterial.STAINLESS_STEEL,
    totalCapacity: 50,
    usableVolume: 40,
    isPublic: false,
    createdAt: daysAgo(90),
    kettleLoss: 2,
    evaporationRate: 10,
    boilOffRate: 4,
    heatingPower: 5500,
    heatingSource: HeatingSource.ELECTRIC,
  },
  {
    id: '2',
    name: 'Caldeira a Gás 100L',
    description: 'Caldeira profissional em inox 316 com queimador de alta potência',
    type: EquipmentType.KETTLE,
    material: EquipmentMaterial.STAINLESS_STEEL,
    totalCapacity: 100,
    usableVolume: 85,
    isPublic: false,
    createdAt: daysAgo(180),
    kettleLoss: 3.5,
    evaporationRate: 12,
    boilOffRate: 5,
    heatingPower: 15000,
    heatingSource: HeatingSource.GAS,
  },
  {
    id: '3',
    name: 'Panela Alumínio 30L',
    description: 'Panela básica em alumínio para iniciantes',
    type: EquipmentType.KETTLE,
    material: EquipmentMaterial.ALUMINUM,
    totalCapacity: 30,
    usableVolume: 25,
    isPublic: true,
    createdAt: daysAgo(365),
    kettleLoss: 1.5,
    evaporationRate: 8,
    boilOffRate: 3.5,
    heatingPower: 3000,
    heatingSource: HeatingSource.GAS,
  },
  {
    id: '4',
    name: 'Panela Indução 60L',
    description: 'Panela de alta eficiência com aquecimento por indução',
    type: EquipmentType.KETTLE,
    material: EquipmentMaterial.STAINLESS_STEEL,
    totalCapacity: 60,
    usableVolume: 50,
    isPublic: false,
    createdAt: daysAgo(30),
    kettleLoss: 2.5,
    evaporationRate: 9,
    boilOffRate: 4,
    heatingPower: 7000,
    heatingSource: HeatingSource.INDUCTION,
  },

  // FERMENTADORES (4 itens)
  {
    id: '5',
    name: 'Fermentador Cônico 50L',
    description: 'Fermentador cônico em inox com controle de temperatura por glicol',
    type: EquipmentType.FERMENTER,
    material: EquipmentMaterial.STAINLESS_STEEL,
    totalCapacity: 50,
    usableVolume: 45,
    isPublic: false,
    createdAt: daysAgo(120),
    fermenterLoss: 2,
    coneBottomVolume: 3,
    hasTemperatureControl: true,
    maxPressure: 15,
    coolingType: CoolingType.GLYCOL,
    minTemperature: 0,
    maxTemperature: 30,
  },
  {
    id: '6',
    name: 'Fermentador Plástico 30L',
    description: 'Balde fermentador em plástico alimentício com torneira',
    type: EquipmentType.FERMENTER,
    material: EquipmentMaterial.PLASTIC,
    totalCapacity: 30,
    usableVolume: 25,
    isPublic: true,
    createdAt: daysAgo(200),
    fermenterLoss: 1,
    coneBottomVolume: 0,
    hasTemperatureControl: false,
    maxPressure: 0,
    coolingType: CoolingType.NATURAL,
    minTemperature: 15,
    maxTemperature: 35,
  },
  {
    id: '7',
    name: 'Fermentador Unitank 100L',
    description: 'Fermentador unitank profissional com jacket de resfriamento',
    type: EquipmentType.FERMENTER,
    material: EquipmentMaterial.STAINLESS_STEEL,
    totalCapacity: 100,
    usableVolume: 90,
    isPublic: false,
    createdAt: daysAgo(60),
    fermenterLoss: 3,
    coneBottomVolume: 5,
    hasTemperatureControl: true,
    maxPressure: 30,
    coolingType: CoolingType.GLYCOL,
    minTemperature: -2,
    maxTemperature: 35,
  },
  {
    id: '8',
    name: 'Fermentador Vidro 20L',
    description: 'Garrafão de vidro para fermentação, ideal para testes',
    type: EquipmentType.FERMENTER,
    material: EquipmentMaterial.GLASS,
    totalCapacity: 20,
    usableVolume: 18,
    isPublic: true,
    createdAt: daysAgo(300),
    fermenterLoss: 0.5,
    coneBottomVolume: 0,
    hasTemperatureControl: false,
    maxPressure: 0,
    coolingType: CoolingType.NATURAL,
    minTemperature: 10,
    maxTemperature: 30,
  },

  // RESFRIADORES (4 itens)
  {
    id: '9',
    name: 'Chiller Contracorrente 20 Placas',
    description: 'Resfriador de placas em inox de alta eficiência',
    type: EquipmentType.CHILLER,
    material: EquipmentMaterial.STAINLESS_STEEL,
    totalCapacity: 60,
    usableVolume: 60,
    isPublic: false,
    createdAt: daysAgo(150),
    coolingCapacity: 8000,
    flowRate: 12,
    inletTemperature: 95,
    outletTemperature: 20,
    chillerType: ChillerType.COUNTERFLOW,
    tubeLength: 0,
    tubeDiameter: 0,
  },
  {
    id: '10',
    name: 'Serpentina de Imersão 10m',
    description: 'Serpentina de cobre para resfriamento por imersão',
    type: EquipmentType.CHILLER,
    material: EquipmentMaterial.COPPER,
    totalCapacity: 50,
    usableVolume: 50,
    isPublic: true,
    createdAt: daysAgo(250),
    coolingCapacity: 4000,
    flowRate: 8,
    inletTemperature: 95,
    outletTemperature: 25,
    chillerType: ChillerType.IMMERSION,
    tubeLength: 10,
    tubeDiameter: 10,
  },
  {
    id: '11',
    name: 'Plate Chiller 30 Placas',
    description: 'Resfriador de placas profissional para grandes volumes',
    type: EquipmentType.CHILLER,
    material: EquipmentMaterial.STAINLESS_STEEL,
    totalCapacity: 100,
    usableVolume: 100,
    isPublic: false,
    createdAt: daysAgo(45),
    coolingCapacity: 12000,
    flowRate: 20,
    inletTemperature: 98,
    outletTemperature: 18,
    chillerType: ChillerType.PLATE,
    tubeLength: 0,
    tubeDiameter: 0,
  },
  {
    id: '12',
    name: 'Serpentina Básica 6m',
    description: 'Serpentina de cobre básica para iniciantes',
    type: EquipmentType.CHILLER,
    material: EquipmentMaterial.COPPER,
    totalCapacity: 30,
    usableVolume: 30,
    isPublic: true,
    createdAt: daysAgo(400),
    coolingCapacity: 2500,
    flowRate: 6,
    inletTemperature: 95,
    outletTemperature: 30,
    chillerType: ChillerType.IMMERSION,
    tubeLength: 6,
    tubeDiameter: 8,
  },
]

// Função para calcular estatísticas dos equipamentos
export const calculateEquipmentStats = (equipments: Equipment[]) => {
  const totalEquipments = equipments.length
  const kettles = equipments.filter(e => e.type === EquipmentType.KETTLE).length
  const fermenters = equipments.filter(e => e.type === EquipmentType.FERMENTER)
    .length
  const chillers = equipments.filter(e => e.type === EquipmentType.CHILLER).length

  return {
    totalEquipments,
    kettles,
    fermenters,
    chillers,
  }
}

// Função para filtrar equipamentos por tipo
export const filterEquipmentsByType = (
  equipments: Equipment[],
  type: EquipmentType | 'all'
): Equipment[] => {
  if (type === 'all') return equipments
  return equipments.filter(equipment => equipment.type === type)
}

// Função para buscar equipamentos
export const searchEquipments = (
  equipments: Equipment[],
  query: string
): Equipment[] => {
  const lowerQuery = query.toLowerCase()
  return equipments.filter(
    equipment =>
      equipment.name.toLowerCase().includes(lowerQuery) ||
      equipment.description?.toLowerCase().includes(lowerQuery)
  )
}

// Função para ordenar equipamentos
export type SortBy = 'name' | 'capacity' | 'date'

export const sortEquipments = (
  equipments: Equipment[],
  sortBy: SortBy
): Equipment[] => {
  const sorted = [...equipments]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'capacity':
      return sorted.sort((a, b) => b.totalCapacity - a.totalCapacity)
    case 'date':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    default:
      return sorted
  }
}

