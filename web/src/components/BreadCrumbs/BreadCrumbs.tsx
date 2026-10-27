import { Link } from 'react-router-dom'
import './BreadCrumbs.css'

export interface Crumb { label: string; path?: string }

export function BreadCrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Навигация">
      <Link to="/">Главная</Link>
      {crumbs.map((c) => (
        <span key={c.label}>
          <span className="crumbs__sep">/</span>
          {c.path ? <Link to={c.path}>{c.label}</Link> : <b>{c.label}</b>}
        </span>
      ))}
    </nav>
  )
}
