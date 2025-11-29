import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mashProfilesApi, MashProfileInput } from '../api/mashProfilesApi'
import toast from 'react-hot-toast'

export const useSaveMashProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profile: MashProfileInput) => mashProfilesApi.save(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mash-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['mash-profile'] })
      toast.success('Perfil de mostura salvo com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar perfil de mostura')
    },
  })
}

