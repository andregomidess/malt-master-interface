export enum MashProfileType {
  INFUSION = 'infusion',
  DECOCTION = 'decoction',
  STEP_MASH = 'step_mash',
  BIAB = 'biab',
}

export interface MashStep {
  id: string
  temperature: number
  time: number
  mashProfileId: string
}

export interface MashProfile {
  id: string
  name: string
  type: MashProfileType
  estimatedEfficiency: number | null
  grainTemperature: number
  tunTemperature: number
  spargeTemperature: number
  tunWeight: number | null
  tunSpecificHeat: number
  mashThickness: number
  observations: string | null
  isPublic: boolean
  steps: MashStep[]
  createdAt: string
  updatedAt: string
}
