export enum CarbonationType {
  NATURAL_PRIMING = 'natural_priming',
  FORCED_CO2 = 'forced_co2',
  BOTTLE_CONDITIONING = 'bottle_conditioning',
}

export enum PrimingSugarType {
  TABLE_SUGAR = 'table_sugar',
  CORN_SUGAR = 'corn_sugar',
  DME = 'dme',
  HONEY = 'honey',
  MAPLE_SYRUP = 'maple_syrup',
}

export interface CarbonationProfile {
  id: string
  name: string
  type: CarbonationType
  targetCO2Volumes: number
  servingTemperature: number
  primingSugarType: PrimingSugarType | null
  primingSugarAmount: number | null
  kegPressure: number | null
  carbonationTime: number | null
  carbonationMethod: string | null
  observations: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}
