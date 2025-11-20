import { maltMasterApi } from '../../../shared/maltMasterApi'
import {
  TastingNote,
  TastingNoteInput,
  TastingNoteStatistics,
  BatchAverageScores,
  TastingNoteQueryParams,
  PaginatedTastingNotes,
} from '../interfaces/TastingNote'

const TASTING_NOTES_BASE_URL = '/tasting-notes'

export const tastingNotesApi = {
  // Lista todas as avaliações do usuário
  findAll: async (): Promise<TastingNote[]> => {
    const response = await maltMasterApi.get<TastingNote[]>(
      TASTING_NOTES_BASE_URL,
    )
    return response.data
  },

  // Lista avaliações do usuário com paginação
  findAllPaginated: async (
    params?: TastingNoteQueryParams,
  ): Promise<PaginatedTastingNotes> => {
    const response = await maltMasterApi.get<PaginatedTastingNotes>(
      TASTING_NOTES_BASE_URL,
      { params },
    )
    return response.data
  },

  // Lista avaliações recentes do usuário
  findRecent: async (limit: number = 5): Promise<TastingNote[]> => {
    const response = await maltMasterApi.get<TastingNote[]>(
      `${TASTING_NOTES_BASE_URL}/recent`,
      {
        params: { limit },
      },
    )
    return response.data
  },

  // Busca estatísticas do usuário
  getStatistics: async (): Promise<TastingNoteStatistics> => {
    const response = await maltMasterApi.get<TastingNoteStatistics>(
      `${TASTING_NOTES_BASE_URL}/statistics`,
    )
    return response.data
  },

  // Lista avaliações de um lote específico
  findByBatch: async (batchId: string): Promise<TastingNote[]> => {
    const response = await maltMasterApi.get<TastingNote[]>(
      `${TASTING_NOTES_BASE_URL}/batch/${batchId}`,
    )
    return response.data
  },

  // Busca médias de um lote
  getBatchAverages: async (
    batchId: string,
  ): Promise<BatchAverageScores | null> => {
    const response = await maltMasterApi.get<BatchAverageScores | null>(
      `${TASTING_NOTES_BASE_URL}/batch/${batchId}/averages`,
    )
    return response.data
  },

  // Busca uma avaliação por ID
  findById: async (id: string): Promise<TastingNote> => {
    const response = await maltMasterApi.get<TastingNote>(
      `${TASTING_NOTES_BASE_URL}/${id}`,
    )
    return response.data
  },

  // Cria ou atualiza uma avaliação
  save: async (input: TastingNoteInput): Promise<TastingNote> => {
    const response = await maltMasterApi.put<TastingNote>(
      TASTING_NOTES_BASE_URL,
      input,
    )
    return response.data
  },

  // Deleta uma avaliação (soft delete)
  delete: async (id: string): Promise<void> => {
    await maltMasterApi.delete(`${TASTING_NOTES_BASE_URL}/${id}`)
  },

  // Recupera uma avaliação deletada
  recovery: async (id: string): Promise<TastingNote> => {
    const response = await maltMasterApi.patch<TastingNote>(
      `${TASTING_NOTES_BASE_URL}/${id}/recovery`,
    )
    return response.data
  },
}
