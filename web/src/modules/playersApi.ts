import { API_BASE } from '../config/target'
import { DEALS_MOCK, PLAYERS_MOCK } from './mock'
import type { Deal, Player } from './types'

// Результат всегда говорит, откуда данные: 'api' или 'mock'.
// Так на защите видно, что изменение в БД пришло с сервера, а не из mock.
export interface Loaded<T> { data: T; source: 'api' | 'mock' }

async function getJson<T>(path: string): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 4000)
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' }, signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

export async function listPlayers(): Promise<Loaded<Player[]>> {
  try {
    const data = await getJson<Player[]>('/api/v1/players')
    if (!Array.isArray(data)) throw new Error('bad payload')
    return { data, source: 'api' }
  } catch {
    return { data: PLAYERS_MOCK, source: 'mock' }
  }
}

export async function listDeals(): Promise<Loaded<Deal[]>> {
  try {
    const data = await getJson<Deal[]>('/api/v1/deals')
    if (!Array.isArray(data)) throw new Error('bad payload')
    return { data, source: 'api' }
  } catch {
    return { data: DEALS_MOCK, source: 'mock' }
  }
}
