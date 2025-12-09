import { useEffect, useState, useCallback } from 'react'
import { findBatchById, findBatchLogs, addBatchLog } from '../api/batchesApi'
import { BatchDetail, BrewLog } from '../interfaces/Brewing'

export function useBatchDetail(batchId: string) {
  const [detail, setDetail] = useState<BatchDetail | null>(null)
  const [logs, setLogs] = useState<BrewLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [batchDetail, batchLogs] = await Promise.all([
        findBatchById(batchId),
        findBatchLogs(batchId),
      ])
      setDetail(batchDetail)
      setLogs(batchLogs)
    } catch {
      setError('Falha ao carregar detalhes do lote')
    } finally {
      setLoading(false)
    }
  }, [batchId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refetch = () => {
    loadData()
  }

  const addLog = async (payload: Omit<BrewLog, 'id'>) => {
    try {
      const created = await addBatchLog(payload)
      setLogs(prev => [created, ...prev])
      return created
    } catch {
      throw new Error('Falha ao adicionar medição')
    }
  }

  return { detail, logs, loading, error, addLog, refetch }
}
