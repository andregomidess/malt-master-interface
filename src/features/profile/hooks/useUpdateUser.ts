import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import type { UserInput } from '../interfaces/User'
import toast from 'react-hot-toast'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user: UserInput) => usersApi.update(user),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      // Atualiza o usuário no localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        const currentUser = JSON.parse(userData)
        const updatedUser = {
          ...currentUser,
          id: data.id,
          username: data.username,
          country: data.country,
          gender: data.gender,
          pictureUrl: data.pictureUrl,
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao atualizar perfil'
      toast.error(errorMessage)
    },
  })
}
