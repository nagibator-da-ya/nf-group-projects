import { useParams, Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs'
import MockBanner from '../../components/MockBanner/MockBanner'
import { ROUTE_LABELS } from '../../Routes'
import { ROLE_LABELS, TOTAL_MESSAGES } from '../../modules/types'
import { useAppSelector } from '../../store/hooks'
import './PlayerPage.css'

const STATUS = { closed: 'Закрыта', talks: 'Переговоры', contract: 'Контракт', agree: 'Договорённость' } as const

export default function PlayerPage() {
  const { id } = useParams()
  const { players, deals, loading } = useAppSelector((s) => s.players)
  const player = players.find((p) => p.id === Number(id))
  const related = deals.filter((d) => d.players.includes(Number(id)))
  const leader = Math.max(1, ...players.map((p) => p.mentions))

  return (
    <>
      <Header />
      <main className="page-main">
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.PLAYERS, path: '/players' }, { label: player?.name ?? ROUTE_LABELS.PLAYER }]} />
        <MockBanner />
        {loading && <p className="muted">Загрузка...</p>}
        {!loading && !player && <p>Игрок не найден. <Link to="/players">К списку</Link></p>}
        {player && (
          <article className="player">
            <span className="player__role">{ROLE_LABELS[player.role]}</span>
            <h1>{player.name}</h1>
            {player.note && <p className="muted">{player.note}</p>}
            <div className="player__stats">
              <div><b>{player.mentions}</b><span>упоминаний</span></div>
              <div><b>{player.messages}</b><span>сообщений</span></div>
              <div><b>{((player.messages / TOTAL_MESSAGES) * 100).toFixed(1).replace('.', ',')}%</b><span>доля сообщений</span></div>
            </div>
            <p className="muted">Относительно лидера демо-выборки ({leader})</p>
            <div className="player__bar"><i style={{ width: `${(player.mentions / leader) * 100}%` }} /></div>
            <h2>Сделки с участием</h2>
            {related.length ? (
              <ul className="player__deals">
                {related.map((d) => (
                  <li key={d.id}><b>{d.date}</b> · {d.object} · {d.sum} · {STATUS[d.status]}</li>
                ))}
              </ul>
            ) : <p className="muted">В восьми сделках отчёта не участвует.</p>}
          </article>
        )}
      </main>
    </>
  )
}
