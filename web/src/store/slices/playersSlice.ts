import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { listDeals, listPlayers } from '../../modules/playersApi'
import type { Deal, Player } from '../../modules/types'

interface PlayersState {
  players: Player[]
  deals: Deal[]
  source: 'api' | 'mock' | null
  loading: boolean
}

const initialState: PlayersState = { players: [], deals: [], source: null, loading: false }

export const fetchMarket = createAsyncThunk('players/fetchMarket', async () => {
  const [p, d] = await Promise.all([listPlayers(), listDeals()])
  return { players: p.data, deals: d.data, source: p.source === 'api' ? 'api' as const : 'mock' as const }
})

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarket.pending, (state) => { state.loading = true })
      .addCase(fetchMarket.fulfilled, (state, action) => {
        state.loading = false
        state.players = action.payload.players
        state.deals = action.payload.deals
        state.source = action.payload.source
      })
      .addCase(fetchMarket.rejected, (state) => { state.loading = false })
  },
})

export default playersSlice.reducer
