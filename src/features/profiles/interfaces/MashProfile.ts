export enum MashProfileType {
  INFUSION = 'infusion',
  DECOCTION = 'decoction',
  STEP_MASH = 'step_mash',
  BIAB = 'biab',
}

export enum MashStepType {
  INFUSION = 'infusion',
  TEMPERATURE = 'temperature',
  DECOCTION = 'decoction',
}

export interface MashStep {
  id: string
  stepOrder: number
  name: string
  stepType: MashStepType
  temperature: number
  duration: number
  infusionAmount?: number | null
  infusionTemp?: number | null
  decoctionAmount?: number | null
  rampTime?: number | null
  description?: string | null
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
