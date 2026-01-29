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

interface User {
  id: string
  name: string
  email: string
}

interface BaseEquipment {
  id: string
  user: User | null // null = público, não-null = do usuário
  name: string
  description: string | null
  type: EquipmentType
  material: EquipmentMaterial
  totalCapacity: number
  usableVolume: number
  createdAt: string | Date
  updatedAt: string | Date | null
  deletedAt: string | Date | null
}

export interface KettleEquipment extends BaseEquipment {
  type: EquipmentType.KETTLE
  kettleLoss: number
  evaporationRate: number
  boilOffRate: number
  heatingPower: number
  heatingSource: HeatingSource
  /** Contração térmica mosto quente→frio (%). Default 4%. */
  thermalShrinkagePercent?: number
}

export interface FermenterEquipment extends BaseEquipment {
  type: EquipmentType.FERMENTER
  fermenterLoss: number
  coneBottomVolume: number
  hasTemperatureControl: boolean
  maxPressure: number
  coolingType: CoolingType
  minTemperature: number
  maxTemperature: number
}

export interface ChillerEquipment extends BaseEquipment {
  type: EquipmentType.CHILLER
  coolingCapacity: number
  flowRate: number
  inletTemperature: number
  outletTemperature: number
  chillerType: ChillerType
  tubeLength: number
  tubeDiameter: number
}

export type Equipment = KettleEquipment | FermenterEquipment | ChillerEquipment

export interface KettleEquipmentWithPublicFlag
  extends Omit<KettleEquipment, 'user'> {
  user: User | null
  isPublic: boolean
}

export interface FermenterEquipmentWithPublicFlag
  extends Omit<FermenterEquipment, 'user'> {
  user: User | null
  isPublic: boolean
}

export interface ChillerEquipmentWithPublicFlag
  extends Omit<ChillerEquipment, 'user'> {
  user: User | null
  isPublic: boolean
}

export type EquipmentWithPublicFlag =
  | KettleEquipmentWithPublicFlag
  | FermenterEquipmentWithPublicFlag
  | ChillerEquipmentWithPublicFlag

export const addPublicFlag = (
  equipment: Equipment,
): EquipmentWithPublicFlag => {
  const base = {
    ...equipment,
    isPublic: equipment.user === null,
  }

  if (equipment.type === EquipmentType.KETTLE) {
    return base as KettleEquipmentWithPublicFlag
  }
  if (equipment.type === EquipmentType.FERMENTER) {
    return base as FermenterEquipmentWithPublicFlag
  }
  return base as ChillerEquipmentWithPublicFlag
}

export interface BaseEquipmentInput {
  id?: string
  name: string
  description?: string
  type: EquipmentType
  material: EquipmentMaterial
  totalCapacity: number
  usableVolume: number
}

export interface KettleEquipmentInput extends BaseEquipmentInput {
  type: EquipmentType.KETTLE
  kettleLoss: number
  evaporationRate: number
  boilOffRate: number
  heatingPower: number
  heatingSource: HeatingSource
  thermalShrinkagePercent?: number
}

export interface FermenterEquipmentInput extends BaseEquipmentInput {
  type: EquipmentType.FERMENTER
  fermenterLoss: number
  coneBottomVolume: number
  hasTemperatureControl: boolean
  maxPressure: number
  coolingType: CoolingType
  minTemperature: number
  maxTemperature: number
}

export interface ChillerEquipmentInput extends BaseEquipmentInput {
  type: EquipmentType.CHILLER
  coolingCapacity: number
  flowRate: number
  inletTemperature: number
  outletTemperature: number
  chillerType: ChillerType
  tubeLength: number
  tubeDiameter: number
}

export type EquipmentInput =
  | KettleEquipmentInput
  | FermenterEquipmentInput
  | ChillerEquipmentInput

export enum EquipmentSortBy {
  NAME = 'name',
  CAPACITY = 'totalCapacity',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface EquipmentQueryParams {
  type?: EquipmentType
  search?: string
  sortBy?: EquipmentSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedEquipments {
  data: Equipment[]
  total: number
  page: number
  totalPages: number
}

export type FilterType = 'all' | EquipmentType
export type SortBy = 'name' | 'capacity' | 'date'

export interface EquipmentStats {
  totalEquipments: number
  kettles: number
  fermenters: number
  chillers: number
}
