import { useState, useEffect } from 'react'
import { TastingNote } from '../interfaces/TastingNote'
import { mockTastingNotes } from '../data/mockTastingNotesData'

interface UseTastingNotesResult {
  tastingNotes: TastingNote[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useTastingNotes = (): UseTastingNotesResult => {
  const [tastingNotes, setTastingNotes] = useState<TastingNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<Error | null>(null)

  const fetchTastingNotes = async () => {
    setIsLoading(true)
    // Simula um delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 500))
    setTastingNotes(mockTastingNotes)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTastingNotes()
  }, [])

  return {
    tastingNotes,
    isLoading,
    error,
    refetch: fetchTastingNotes,
  }
}
