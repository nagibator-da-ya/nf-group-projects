import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setQuery, setRole, setSort, type SortKey } from '../../store/slices/filtersSlice'
import { ROLE_LABELS, type Role } from '../../modules/types'
import './FilterBar.css'

const ROLES: (Role | 'all')[] = ['all', 'seller', 'buyer', 'consultant']

export default function FilterBar() {
  const dispatch = useAppDispatch()
  const { query, role, sort } = useAppSelector((s) => s.filters)
  const onSubmit = (e: FormEvent) => e.preventDefault()

  return (
    <div className="filters">
      <form className="filters__search" onSubmit={onSubmit} role="search">
        <input
          type="search"
          placeholder="Найти игрока"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
      </form>
      <div className="filters__chips" role="group" aria-label="Роль">
        {ROLES.map((r) => (
          <button key={r} type="button" className="chip" aria-pressed={role === r} onClick={() => dispatch(setRole(r))}>
            {r === 'all' ? 'Все' : ROLE_LABELS[r]}
          </button>
        ))}
      </div>
      <label className="filters__sort">
        Сортировка
        <select value={sort} onChange={(e) => dispatch(setSort(e.target.value as SortKey))}>
          <option value="mentions">по упоминаниям</option>
          <option value="messages">по сообщениям</option>
          <option value="name">по названию</option>
        </select>
      </label>
    </div>
  )
}
