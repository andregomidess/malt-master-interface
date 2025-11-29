import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import { User } from '../interfaces/User'

export const useUserById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do usuário não fornecido')
      return await usersApi.findById(id)
    },
    enabled: !!id,
  })
}

