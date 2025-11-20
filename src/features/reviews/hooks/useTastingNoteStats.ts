import { useQuery } from '@tanstack/react-query'
import { tastingNotesApi } from '../api/tastingNotesApi'
import { TastingNoteStatistics } from '../interfaces/TastingNote'

interface UseTastingNoteStatsResult {
  statistics: TastingNoteStatistics | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useTastingNoteStats = (): UseTastingNoteStatsResult => {
  const {
    data: statistics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasting-notes-statistics'] as const,
    queryFn: async () => {
      return await tastingNotesApi.getStatistics()
    },
  })

  return {
    statistics: statistics ?? null,
    isLoading,
    error: error as Error | null,
    refetch: async () => {
      await refetch()
    },
  }
}
