import Header from '../../components/Header/Header'
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs'
import { ROUTE_LABELS } from '../../Routes'
import { MAGAZINE } from '../../modules/mock'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setYear } from '../../store/slices/filtersSlice'
import './MagazinePage.css'

const YEARS = [...new Set(MAGAZINE.map((m) => m.year))]

export default function MagazinePage() {
  const dispatch = useAppDispatch()
  const year = useAppSelector((s) => s.filters.year)
  const issues = MAGAZINE.filter((m) => year === 'all' || m.year === year)

  return (
    <>
      <Header />
      <main className="page-main">
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.MAGAZINE }]} />
        <div className="filters__chips mag__years" role="group" aria-label="Год">
          <button type="button" className="chip" aria-pressed={year === 'all'} onClick={() => dispatch(setYear('all'))}>Все</button>
          {YEARS.map((y) => (
            <button key={y} type="button" className="chip" aria-pressed={year === y} onClick={() => dispatch(setYear(y))}>{y}</button>
          ))}
        </div>
        <p className="muted">Публичный архив выпусков - на сайте компании: <a href="https://kf.expert/nfmagazine" target="_blank" rel="noopener">kf.expert/nfmagazine</a></p>
        <div className="mag">
          {issues.map((m) => (
            <a key={m.url} className="mag__issue" href={encodeURI(m.url)} target="_blank" rel="noopener">
              <div className="mag__cover">
                <span>NF <em>MAGAZINE</em></span>
                <b>{m.no ? `№${m.no}` : m.year}</b>
                <i>{m.month} {m.year}</i>
              </div>
              <div className="mag__cap">PDF ↗</div>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}
