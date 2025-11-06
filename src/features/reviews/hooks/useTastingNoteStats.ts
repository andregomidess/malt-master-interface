import { useState, useEffect } from 'react'
import { TastingNoteStatistics } from '../interfaces/TastingNote'
import { mockStatistics } from '../data/mockTastingNotesData'

interface UseTastingNoteStatsResult {
  statistics: TastingNoteStatistics | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useTastingNoteStats = (): UseTastingNoteStatsResult => {
  const [statistics, setStatistics] = useState<TastingNoteStatistics | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<Error | null>(null)

  const fetchStatistics = async () => {
    setIsLoading(true)
    // Simula um delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 500))
    setStatistics(mockStatistics)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics,
  }
}
