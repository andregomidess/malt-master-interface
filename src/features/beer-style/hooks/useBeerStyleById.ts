import { useQuery } from '@tanstack/react-query'
import { beerStylesApi } from '../api/beerStylesApi'
import type { BeerStyle } from '../interfaces/BeerStyle'

export const useBeerStyleById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['beer-style', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do estilo de cerveja não fornecido')
      const beerStyle = await beerStylesApi.findById(id)
      return beerStyle as BeerStyle
    },
    enabled: !!id,
  })
}
