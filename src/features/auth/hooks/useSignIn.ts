import { useMutation } from '@tanstack/react-query'
import { maltMasterApi } from '../../../shared/maltMasterApi'

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      await maltMasterApi.post('/login', body)
    },
    onSuccess: () => {},
    onError: () => {},
  })
}
