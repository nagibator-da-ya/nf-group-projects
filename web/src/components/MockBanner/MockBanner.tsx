import { useAppSelector } from '../../store/hooks'
import { IS_TAURI, BACKEND_IP } from '../../config/target'
import './MockBanner.css'

// Явно показывает, откуда данные: сервер или mock.
export default function MockBanner() {
  const { source, loading } = useAppSelector((s) => s.players)
  if (loading || !source) return null
  return source === 'mock' ? (
    <div className="mock-banner mock-banner--mock" role="status">
      Демо-данные (mock): сервер недоступен. Изменения в БД здесь не отобразятся.
    </div>
  ) : (
    <div className="mock-banner mock-banner--api" role="status">
      Данные с сервера{IS_TAURI ? ` ${BACKEND_IP}:8080` : ' (через proxy /api)'}
    </div>
  )
}
