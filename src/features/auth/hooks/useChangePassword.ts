import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export const useChangePassword = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (body: { token: string; newPassword: string }) => {
      await maltMasterApi.post('/auth/reset-password', body)
    },
    onSuccess: () => {
      toast.success('Senha alterada com sucesso')
      navigate('/')
    },
    onError: () => {
      toast.error('Erro ao alterar senha')
    },
  })
}
