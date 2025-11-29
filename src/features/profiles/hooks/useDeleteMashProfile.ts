import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mashProfilesApi } from '../api/mashProfilesApi'
import toast from 'react-hot-toast'

export const useDeleteMashProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => mashProfilesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mash-profiles'] })
      toast.success('Perfil de mostura excluído com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao excluir perfil de mostura')
    },
  })
}

