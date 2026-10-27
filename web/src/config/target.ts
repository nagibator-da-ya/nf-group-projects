// Единая точка адресов бэкенда.
// BACKEND_IP = IP машины с API в локальной сети (ipconfig / ip a),
// он же должен стоять в CSP src-tauri/tauri.conf.json.
export const BACKEND_IP: string = import.meta.env.VITE_BACKEND_IP ?? '192.168.1.50'

// Tauri v2 кладёт __TAURI_INTERNALS__ в window
export const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

// Tauri ходит к API напрямую по IP; браузер - относительным путём через proxy vite.
// На GitHub Pages /api отдаёт 404 -> приложение переходит на mock и показывает плашку.
export const API_BASE = IS_TAURI ? `http://${BACKEND_IP}:8080` : ''
