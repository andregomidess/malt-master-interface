import { useEffect, useMemo, useState } from 'react'
import { findAllBatches } from '../api/batchesApi'
import { Batch, BatchStatus } from '../interfaces/Brewing'

export function useBatches() {
  const [data, setData] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<BatchStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'status'>('recent')

  useEffect(() => {
    setLoading(true)
    findAllBatches()
      .then(setData)
      .catch(() => setError('Falha ao carregar brassagens'))
      .finally(() => setLoading(false))
  }, [])

  const filteredData = useMemo(() => {
    let result = data

    if (statusFilter !== 'all') {
      result = result.filter(batch => batch.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        batch =>
          (batch.name || '').toLowerCase().includes(query) ||
          (batch.batchCode || '').toLowerCase().includes(query) ||
          (batch.recipe?.name || '').toLowerCase().includes(query)
      )
    }

    switch (sortBy) {
      case 'name':
        result = [...result].sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
        )
        break
      case 'status':
        result = [...result].sort((a, b) => a.status.localeCompare(b.status))
        break
      default:
        result = [...result].sort(
          (a, b) =>
            new Date(b.brewDate || '').getTime() -
            new Date(a.brewDate || '').getTime()
        )
    }

    return result
  }, [data, statusFilter, searchQuery, sortBy])

  const refetch = async () => {
    try {
      const batches = await findAllBatches()
      setData(batches)
    } catch {
      setError('Falha ao carregar brassagens')
    }
  }

  return {
    data: filteredData,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refetch
  }
}

