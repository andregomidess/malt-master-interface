import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import toast from 'react-hot-toast'

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (body: { token: string; newPassword: string }) => {
      await maltMasterApi.post('/auth/reset-password', body)
    },
    onSuccess: () => {
      toast.success('Senha alterada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao alterar senha')
    },
  })
}
