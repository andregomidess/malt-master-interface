import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import toast from 'react-hot-toast'
import { CreateAccountFormData } from '../components/CreateAccountForm'
import { useNavigate } from 'react-router'

export const useCreateAccount = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (body: CreateAccountFormData) => {
      const response = await maltMasterApi.post('/auth/register', body)
      return response.data
    },
    onSuccess: data => {
      toast.success('Conta criada com sucesso')
      navigate(`/verify-email?email=${encodeURIComponent(data.user.email)}`)
    },
    onError: () => {
      toast.error('Erro ao criar conta')
    },
  })
}
