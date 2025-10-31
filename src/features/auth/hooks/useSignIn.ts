import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export const useSignIn = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const response = await maltMasterApi.post('/auth/login', body)
      return response.data
    },
    onSuccess: data => {
      localStorage.setItem('token', data)

      toast.success('Login realizado com sucesso')
      navigate('/')
    },
    onError: () => {
      toast.error('Credenciais inválidas')
    },
  })
}
