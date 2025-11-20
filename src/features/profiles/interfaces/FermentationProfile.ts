export enum FermentationProfileType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LAGERING = 'lagering',
  CONDITIONING = 'conditioning',
  BOTTLE_CONDITIONING = 'bottle_conditioning',
  KEG_CONDITIONING = 'keg_conditioning',
}

export interface FermentationStep {
  id: string
  temperature: number
  time: number
  fermentationProfileId: string
}

export interface FermentationProfile {
  id: string
  name: string
  type: FermentationProfileType
  yeastStrain: string | null
  targetFinalGravity: number | null
  estimatedAttenuation: number | null
  isMultiStage: boolean
  observations: string | null
  isPublic: boolean
  steps: FermentationStep[]
  createdAt: string
  updatedAt: string
}
