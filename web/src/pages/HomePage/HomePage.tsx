import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import './HomePage.css'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="page-main home">
        <section className="home__hero">
          <p className="home__eyebrow">NF GROUP · отдел маркетинга и связей с общественностью</p>
          <h1>Рынок ЦОД России 2026</h1>
          <p className="muted">Учебный проект: игроки рынка и сделки 2024–2026 по открытым публикациям СМИ. Числа упоминаний условные (демо).</p>
          <div className="home__actions">
            <Link to="/players" className="btn">Игроки рынка</Link>
            <Link to="/magazine" className="btn btn--ghost">NF Magazine</Link>
          </div>
        </section>
        <section className="home__kpis">
          <div><b>17</b><span>игроков в демо-выборке</span></div>
          <div><b>8</b><span>сделок из открытых СМИ</span></div>
          <div><b>3</b><span>роли: продавцы, покупатели, консультанты</span></div>
          <div><b>демо</b><span>условные числа упоминаний</span></div>
        </section>
      </main>
    </>
  )
}
