export type BatchStatus =
  | 'planned'
  | 'fermenting'
  | 'maturing'
  | 'packaged'
  | 'completed'

export enum BatchSortBy {
  NAME = 'name',
  BREW_DATE = 'brewDate',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  PACKAGING_DATE = 'packagingDate',
  READY_DATE = 'readyDate',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export interface Batch {
  id: string
  name: string | null
  batchCode: string | null
  status: BatchStatus
  recipe: {
    id: string
    name: string
    styleName?: string | null
    beerStyle?: {
      id: string
      name: string
    } | null
    og?: number | null
    fg?: number | null
    ibu?: number | null
    color?: number | null
    abv?: number | null
  } | null
  equipment?: { id: string; name: string } | null
  brewDate?: string | null
  packagingDate?: string | null
  readyDate?: string | null
  plannedVolume?: number | null
  finalVolume?: number | null
  actualOriginalGravity?: number | null
  actualFinalGravity?: number | null
  actualIbu?: number | null
  actualColor?: number | null
  actualAbv?: number | null
  actualEfficiency?: number | null
  observations?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface BatchQueryParams {
  page?: number
  take?: number
  search?: string
  sortBy?: BatchSortBy
  order?: SortOrder
  status?: BatchStatus
}

export type PaginatedBatches = PaginatedResult<Batch>

export type MashStepType = 'infusion' | 'temperature' | 'decoction'

export interface MashStep {
  id: string
  stepOrder: number
  name: string
  stepType: MashStepType
  temperature: number
  duration: number
  infusionAmount?: number | null
  infusionTemp?: number | null
  rampTime?: number | null
  description?: string | null
}

export interface FermentationStep {
  id: string
  stepOrder: number
  name: string
  temperature: number
  duration: number
}

export interface HopAddition {
  time: number
  name: string
  amount: number
  unit: 'g' | 'oz'
  alphaAcid?: number
}

export interface BrewLog {
  id: string
  batchId: string
  timestamp: string
  gravity?: number | null
  temperature?: number | null
  ph?: number | null
  note?: string | null
  event?: 'dry_hop' | 'cold_crash' | 'diacetyl_rest' | 'transfer' | 'other'
}

export interface BatchDetail {
  batch: Batch
  mashSteps: MashStep[]
  fermentationSteps: FermentationStep[]
  hopSchedule: HopAddition[]
}

export const BatchStatusLabels: Record<BatchStatus, string> = {
  planned: 'Planejada',
  fermenting: 'Fermentando',
  maturing: 'Maturando',
  packaged: 'Envasada',
  completed: 'Finalizada',
}

export const BatchStatusColors: Record<BatchStatus, string> = {
  planned: '#6B7280',
  fermenting: '#10B981',
  maturing: '#3B82F6',
  packaged: '#8B5CF6',
  completed: '#111827',
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatGravity(
  gravity: number | string | null | undefined,
): string {
  if (!gravity) return '—'
  const numGravity = typeof gravity === 'string' ? parseFloat(gravity) : gravity
  if (isNaN(numGravity)) return '—'
  return numGravity.toFixed(3)
}

export function formatPercentage(
  value: number | string | null | undefined,
): string {
  if (!value) return '—'
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return '—'
  return `${numValue.toFixed(1)}%`
}
