import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'
import toast from 'react-hot-toast'
import { CreateAccountFormData } from '../components/CreateAccountForm'
import { useNavigate } from 'react-router'
import { getCountryNameByCode } from '../../../shared/utils/countries'

export const useCreateAccount = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (body: CreateAccountFormData) => {
      // Converte o código do país para o nome antes de enviar
      const payload = {
        ...body,
        country: getCountryNameByCode(body.country),
      }
      const response = await maltMasterApi.post('/auth/register', payload)
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
