import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Role } from '../../modules/types'

export type SortKey = 'mentions' | 'messages' | 'name'

// Значения фильтров живут в Redux store, а не в useState страницы,
// поэтому сохраняются при переходе на главную и обратно.
interface FiltersState {
  query: string
  role: Role | 'all'
  sort: SortKey
  year: number | 'all' // фильтр архива NF Magazine
}

const initialState: FiltersState = { query: '', role: 'all', sort: 'mentions', year: 'all' }

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => { state.query = action.payload },
    setRole: (state, action: PayloadAction<FiltersState['role']>) => { state.role = action.payload },
    setSort: (state, action: PayloadAction<SortKey>) => { state.sort = action.payload },
    setYear: (state, action: PayloadAction<FiltersState['year']>) => { state.year = action.payload },
    resetFilters: () => initialState,
  },
})

export const { setQuery, setRole, setSort, setYear, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
