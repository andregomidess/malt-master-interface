export interface Batch {
  id: string
  batchCode?: string | null
  name?: string | null
  brewDate?: string | null
  status: 'planned' | 'fermenting' | 'maturing' | 'packaged' | 'completed'
  recipe?: {
    id: string
    name: string
    style?: string
  }
}

export interface User {
  id: string
  name: string
  email: string
}

export interface TastingNote {
  id: string
  batch: Batch
  user: User
  tastingDate: string
  appearanceScore?: number | null
  aromaScore?: number | null
  flavorScore?: number | null
  mouthfeelScore?: number | null
  overallScore: number
  pros?: string | null
  cons?: string | null
  generalNotes?: string | null
  createdAt: string
  updatedAt: string
}

export interface TastingNoteInput {
  id?: string
  batchId: string
  tastingDate?: string
  appearanceScore?: number
  aromaScore?: number
  flavorScore?: number
  mouthfeelScore?: number
  overallScore: number
  pros?: string
  cons?: string
  generalNotes?: string
}

export interface TastingNoteStatistics {
  totalTastings: number
  averageAppearance: number
  averageAroma: number
  averageFlavor: number
  averageMouthfeel: number
  averageOverall: number
  highestScore: number
  lowestScore: number
}

export interface BatchAverageScores {
  averageAppearance: number
  averageAroma: number
  averageFlavor: number
  averageMouthfeel: number
  averageOverall: number
  totalNotes: number
}

export const BatchStatusLabels: Record<Batch['status'], string> = {
  planned: 'Planejado',
  fermenting: 'Fermentando',
  maturing: 'Maturando',
  packaged: 'Envasado',
  completed: 'Concluído',
}

export const BatchStatusColors: Record<
  Batch['status'],
  { color: string; bgColor: string }
> = {
  planned: { color: '#6B7280', bgColor: '#F3F4F6' },
  fermenting: { color: '#F59E0B', bgColor: '#FEF3C7' },
  maturing: { color: '#3B82F6', bgColor: '#DBEAFE' },
  packaged: { color: '#8B5CF6', bgColor: '#EDE9FE' },
  completed: { color: '#10B981', bgColor: '#D1FAE5' },
}

// Função auxiliar para determinar a cor da nota
export const getScoreColor = (
  score: number,
): { color: string; bgColor: string; label: string } => {
  if (score >= 8) {
    return {
      color: '#10B981',
      bgColor: '#D1FAE5',
      label: 'Excelente',
    }
  } else if (score >= 5) {
    return {
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      label: 'Bom',
    }
  } else {
    return {
      color: '#EF4444',
      bgColor: '#FEE2E2',
      label: 'Regular',
    }
  }
}

// Função para formatar data
export const formatTastingDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Função para truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export enum TastingNoteSortBy {
  TASTING_DATE = 'tastingDate',
  OVERALL_SCORE = 'overallScore',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface TastingNoteQueryParams {
  search?: string
  batchId?: string
  sortBy?: TastingNoteSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedTastingNotes {
  data: TastingNote[]
  total: number
  page: number
  totalPages: number
}
