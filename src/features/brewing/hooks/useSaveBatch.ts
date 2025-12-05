import { useMutation, useQueryClient } from '@tanstack/react-query'
import { batchesApi } from '../api/batchesApi'
import toast from 'react-hot-toast'
import { Batch } from '../interfaces/Brewing'

export interface MashStepInput {
  id?: string
  stepOrder: number
  name: string
  stepType: 'infusion' | 'temperature' | 'decoction'
  temperature: number
  duration: number
  infusionAmount?: number | null
  infusionTemp?: number | null
  decoctionAmount?: number | null
  rampTime?: number | null
  description?: string | null
}

export interface BatchInput {
  id?: string
  user: string
  recipe: string
  equipment?: string | null
  name?: string | null
  batchCode?: string | null
  brewDate?: string | null
  packagingDate?: string | null
  readyDate?: string | null
  status: 'planned' | 'fermenting' | 'maturing' | 'packaged' | 'completed'
  plannedVolume?: number | null
  finalVolume?: number | null
  actualOriginalGravity?: number | null
  actualFinalGravity?: number | null
  actualIbu?: number | null
  actualColor?: number | null
  actualAbv?: number | null
  actualEfficiency?: number | null
  fermentationTemperature?: number | null
  fermentationTime?: number | null
  actualCarbonation?: number | null
  observations?: string | null
  mashSteps?: MashStepInput[]
}

export const useSaveBatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (batch: BatchInput) => {
      return batchesApi.save(batch as unknown as Batch)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['batch'] })
      toast.success('Brassagem salva com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar brassagem')
    },
  })
}
