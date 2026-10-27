import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const links = (
    <>
      <NavLink to="/" end className="header__link" onClick={() => setOpen(false)}>Главная</NavLink>
      <NavLink to="/players" className="header__link" onClick={() => setOpen(false)}>Игроки ЦОД</NavLink>
      <NavLink to="/magazine" className="header__link" onClick={() => setOpen(false)}>NF Magazine</NavLink>
    </>
  )
  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__logo">NF <span>HUB</span></NavLink>
        <nav className="header__nav">{links}</nav>
        <button className="header__burger" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
      {open && <nav className="header__mobile">{links}</nav>}
    </header>
  )
}
