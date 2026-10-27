import { configureStore } from '@reduxjs/toolkit'
import playersReducer from './slices/playersSlice'
import filtersReducer from './slices/filtersSlice'

export const store = configureStore({
  reducer: {
    players: playersReducer,
    filters: filtersReducer,
  },
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
