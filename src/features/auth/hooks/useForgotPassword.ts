import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import toast from 'react-hot-toast'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (body: { email: string }) => {
      await maltMasterApi.post('/auth/forgot-password', body)
    },
    onSuccess: () => {
      toast.success('Email enviado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao enviar email')
    },
  })
}
