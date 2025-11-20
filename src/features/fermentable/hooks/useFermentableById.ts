import { useQuery } from '@tanstack/react-query'
import { fermentablesApi } from '../api/fermentablesApi'
import { addPublicFlag } from '../interfaces/Fermentable'
import type { FermentableWithPublicFlag } from '../interfaces/Fermentable'

export const useFermentableById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['fermentable', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do fermentável não fornecido')
      const fermentable = await fermentablesApi.findById(id)
      return addPublicFlag(fermentable) as FermentableWithPublicFlag
    },
    enabled: !!id,
  })
}
