import { Batch, BatchDetail, BrewLog } from '../interfaces/Brewing'
import { mockBatches, mockDetails, mockLogs } from '../data/mockBatchesData'

export async function findAllBatches(): Promise<Batch[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockBatches
}

export async function findBatchById(id: string): Promise<BatchDetail | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockDetails[id] || null
}

export async function findBatchLogs(id: string): Promise<BrewLog[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockLogs.filter(log => log.batchId === id)
}

export async function addBatchLog(
  log: Omit<BrewLog, 'id'>
): Promise<BrewLog> {
  await new Promise(resolve => setTimeout(resolve, 150))
  const created: BrewLog = {
    ...log,
    id: `l${Date.now()}`
  }
  mockLogs.push(created)
  return created
}

export async function deleteBatch(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 150))
  const index = mockBatches.findIndex(b => b.id === id)
  if (index !== -1) {
    mockBatches.splice(index, 1)
  }
}

