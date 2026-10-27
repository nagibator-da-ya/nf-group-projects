import { Link } from 'react-router-dom'
import { ROLE_LABELS, TOTAL_MESSAGES, type Player } from '../../modules/types'
import './PlayerCard.css'

const pct = (x: number) => (x * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%'

export default function PlayerCard({ player, max }: { player: Player; max: number }) {
  return (
    <article className={`pcard${player.nf ? ' pcard--nf' : ''}`}>
      <span className={`pcard__role pcard__role--${player.role}`}>{ROLE_LABELS[player.role]}</span>
      <h2 className="pcard__name">{player.name}</h2>
      <div className="pcard__nums">
        <div><b>{player.mentions}</b><span>упоминаний</span></div>
        <div><b>{pct(player.messages / TOTAL_MESSAGES)}</b><span>доля</span></div>
      </div>
      <div className="pcard__bar"><i style={{ width: `${(player.mentions / max) * 100}%` }} /></div>
      <Link to={`/player/${player.id}`} className="btn pcard__btn">Подробнее</Link>
    </article>
  )
}
