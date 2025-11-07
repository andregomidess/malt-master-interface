import { useSuspenseQuery } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'

export interface UserMetrics {
  totalRecipes: number
  totalBeerProduced: number
  lastBatch: {
    id: string
    name: string
    batchCode: string
    brewDate: string | null
    status: string
  } | null
}

export function useUserMetrics() {
  return useSuspenseQuery({
    queryKey: ['userMetrics'],
    queryFn: async () => {
      return await maltMasterApi.get<UserMetrics>('/users/metrics')
    },
  })
}
