import type { ISODateString } from './common'

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

export interface EquipmentBaseApi {
  id: string
  user: string | null
  name: string
  description: string | null
  totalCapacity: number
  usableVolume: number
  type: EquipmentType
  material: EquipmentMaterial
  createdAt: ISODateString
  updatedAt: ISODateString | null
  deletedAt: ISODateString | null
}

export interface KettleEquipmentApi extends EquipmentBaseApi {
  type: EquipmentType.KETTLE
  kettleLoss: number
  evaporationRate: number
  boilOffRate: number
  heatingPower: number
  heatingSource: HeatingSource
}

export interface FermenterEquipmentApi extends EquipmentBaseApi {
  type: EquipmentType.FERMENTER
  fermenterLoss: number
  coneBottomVolume: number
  hasTemperatureControl: boolean
  maxPressure: number
  coolingType: CoolingType
  minTemperature: number
  maxTemperature: number
}

export interface ChillerEquipmentApi extends EquipmentBaseApi {
  type: EquipmentType.CHILLER
  coolingCapacity: number
  flowRate: number
  inletTemperature: number
  outletTemperature: number
  chillerType: ChillerType
  tubeLength: number
  tubeDiameter: number
}

export type EquipmentApi =
  | KettleEquipmentApi
  | FermenterEquipmentApi
  | ChillerEquipmentApi
