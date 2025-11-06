import { useState, useEffect } from 'react'
import { BeerStyle } from '../interfaces/BeerStyle'
import { mockBeerStyles } from '../data/mockBeerStylesData'

interface UseBeerStylesResult {
  beerStyles: BeerStyle[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useBeerStyles = (): UseBeerStylesResult => {
  const [beerStyles, setBeerStyles] = useState<BeerStyle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<Error | null>(null)

  const fetchBeerStyles = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setBeerStyles(mockBeerStyles)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBeerStyles()
  }, [])

  return {
    beerStyles,
    isLoading,
    error,
    refetch: fetchBeerStyles,
  }
}
