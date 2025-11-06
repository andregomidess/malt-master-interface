import { useEffect, useState } from 'react'
import {
  findBatchById,
  findBatchLogs,
  addBatchLog
} from '../api/batchesApi'
import { BatchDetail, BrewLog } from '../interfaces/Brewing'

export function useBatchDetail(batchId: string) {
  const [detail, setDetail] = useState<BatchDetail | null>(null)
  const [logs, setLogs] = useState<BrewLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([findBatchById(batchId), findBatchLogs(batchId)])
      .then(([batchDetail, batchLogs]) => {
        setDetail(batchDetail)
        setLogs(batchLogs)
      })
      .catch(() => setError('Falha ao carregar detalhes do lote'))
      .finally(() => setLoading(false))
  }, [batchId])

  const addLog = async (payload: Omit<BrewLog, 'id'>) => {
    try {
      const created = await addBatchLog(payload)
      setLogs(prev => [created, ...prev])
      return created
    } catch {
      throw new Error('Falha ao adicionar medição')
    }
  }

  return { detail, logs, loading, error, addLog }
}

