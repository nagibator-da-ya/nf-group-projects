import { useMemo } from 'react'
import Header from '../../components/Header/Header'
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs'
import FilterBar from '../../components/FilterBar/FilterBar'
import PlayersList from '../../components/PlayersList/PlayersList'
import MockBanner from '../../components/MockBanner/MockBanner'
import { ROUTE_LABELS } from '../../Routes'
import { useAppSelector } from '../../store/hooks'

export default function PlayersPage() {
  const { players, loading } = useAppSelector((s) => s.players)
  const { query, role, sort } = useAppSelector((s) => s.filters)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return players
      .filter((p) => (role === 'all' || p.role === role) && (!q || p.name.toLowerCase().includes(q)))
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name, 'ru') : b[sort] - a[sort]))
  }, [players, query, role, sort])

  return (
    <>
      <Header />
      <main className="page-main">
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.PLAYERS }]} />
        <MockBanner />
        <FilterBar />
        {loading ? (
          <p className="muted">Загрузка...</p>
        ) : visible.length ? (
          <PlayersList players={visible} />
        ) : (
          <p className="muted">{query ? `По запросу «${query}» игроков не найдено` : 'Игроки не найдены'}</p>
        )}
      </main>
    </>
  )
}
