import { useMutation, useQueryClient } from '@tanstack/react-query'
import { batchesApi } from '../api/batchesApi'

export const useDeleteBatch = () => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: deleteBatch,
    isPending: isDeleting,
    error,
  } = useMutation({
    mutationFn: async (id: string) => {
      await batchesApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })

  return { deleteBatch, isDeleting, error }
}
