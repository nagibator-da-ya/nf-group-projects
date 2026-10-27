import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './Routes'
import HomePage from './pages/HomePage/HomePage'
import PlayersPage from './pages/PlayersPage/PlayersPage'
import PlayerPage from './pages/PlayerPage/PlayerPage'
import MagazinePage from './pages/MagazinePage/MagazinePage'
import { useAppDispatch } from './store/hooks'
import { fetchMarket } from './store/slices/playersSlice'

export default function App() {
  const dispatch = useAppDispatch()
  // Данные грузятся один раз на всё приложение и лежат в store
  useEffect(() => { dispatch(fetchMarket()) }, [dispatch])

  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PLAYERS} element={<PlayersPage />} />
        <Route path={ROUTES.PLAYER} element={<PlayerPage />} />
        <Route path={ROUTES.MAGAZINE} element={<MagazinePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  )
}
