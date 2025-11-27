import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { AxiosError } from 'axios'

export const useVerifyEmail = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await maltMasterApi.get(`/auth/verify/${token}`)
      return response.data
    },
    onSuccess: data => {
      // Salva o token e usuário automaticamente após verificação
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      toast.success('E-mail verificado com sucesso!')
      navigate('/')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        'Token inválido ou expirado. Solicite um novo link de verificação.'
      toast.error(message)
    },
  })
}
