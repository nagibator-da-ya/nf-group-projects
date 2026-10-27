import type { Player } from '../../modules/types'
import PlayerCard from '../PlayerCard/PlayerCard'
import './PlayersList.css'

export default function PlayersList({ players }: { players: Player[] }) {
  const max = Math.max(1, ...players.map((p) => p.mentions))
  return (
    <div className="players-grid">
      {players.map((p) => <PlayerCard key={p.id} player={p} max={max} />)}
    </div>
  )
}
