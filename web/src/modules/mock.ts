import type { Deal, Issue, Player } from './types'

// ДЕМО-ДАННЫЕ: числа упоминаний и сообщений условные, сгенерированы для учебного проекта
// и не являются результатами медиаисследования. Сделки - по открытым публикациям СМИ.
export const PLAYERS_MOCK: Player[] = [
  { id: 1, name: 'Ростелеком / РТК-ЦОД', role: 'seller', mentions: 40, messages: 25, note: 'Выкупил ЦОД в Медведково у NK Group' },
  { id: 2, name: 'Росатом / Атомдата', role: 'seller', mentions: 138, messages: 70 },
  { id: 3, name: 'iKS-Consulting', role: 'consultant', mentions: 36, messages: 19 },
  { id: 4, name: 'Сбер', role: 'buyer', mentions: 117, messages: 78, note: 'Претендует на 6 из 11 ЦОД NK Group' },
  { id: 5, name: 'Google / Alphabet', role: 'buyer', mentions: 150, messages: 67 },
  { id: 6, name: 'Cloud.ru', role: 'seller', mentions: 122, messages: 35 },
  { id: 7, name: 'Nvidia', role: 'buyer', mentions: 10, messages: 9 },
  { id: 8, name: 'Amazon / AWS', role: 'buyer', mentions: 30, messages: 8 },
  { id: 9, name: 'Яндекс', role: 'buyer', mentions: 83, messages: 17 },
  { id: 10, name: 'Selectel', role: 'seller', mentions: 125, messages: 6 },
  { id: 11, name: 'Инкаб холдинг', role: 'buyer', mentions: 135, messages: 45 },
  { id: 12, name: 'МТС', role: 'buyer', mentions: 63, messages: 30 },
  { id: 13, name: 'NK Group', role: 'seller', mentions: 74, messages: 49, note: 'Строит кампус из 11 ЦОД в Домодедово' },
  { id: 14, name: 'SpaceX / xAI', role: 'buyer', mentions: 101, messages: 53 },
  { id: 15, name: 'Microsoft', role: 'buyer', mentions: 141, messages: 14 },
  { id: 16, name: 'NF GROUP', role: 'consultant', mentions: 97, messages: 16, nf: true, note: 'Консультант и брокер на рынке коммерческой недвижимости' },
  { id: 17, name: 'CORE.XP', role: 'consultant', mentions: 147, messages: 42 },
]

export const DEALS_MOCK: Deal[] = [
  { id: 1, date: 'Дек. 2025', buyer: 'Интеррос', seller: 'Владельцы Selectel', object: '25% Selectel', sum: 'не раскрыта', status: 'closed', players: [10] },
  { id: 2, date: 'Янв. 2026', buyer: 'Wildberries & Russ', seller: 'Продавцы 3 юрлиц', object: '3 юрлица под ЦОД', sum: 'не раскрыта', status: 'closed', players: [] },
  { id: 3, date: 'Фев. 2026', buyer: 'Сбер', seller: 'NK Group', object: '6 из 11 ЦОД в Домодедово', sum: '40–60 млрд ₽', status: 'talks', players: [4, 13] },
  { id: 4, date: '2024', buyer: 'Ростелеком', seller: 'NK Group', object: 'ЦОД в Медведково', sum: '26,2 млрд ₽', status: 'closed', players: [1, 13] },
  { id: 5, date: 'Май 2026', buyer: 'Инкаб холдинг', seller: 'Владельцы Альфатек', object: '51% Альфатек', sum: 'не раскрыта', status: 'closed', players: [11] },
  { id: 6, date: '2025', buyer: 'BlackRock, Microsoft, xAI', seller: 'Владельцы Aligned', object: 'Aligned Data Centers', sum: '$40 млрд', status: 'closed', players: [14, 15] },
  { id: 7, date: '2026', buyer: 'Фонд CATL', seller: 'Акционеры VNET', object: '~38% VNET', sum: 'н/д', status: 'agree', players: [] },
  { id: 8, date: 'Сент. 2026', buyer: 'Anthropic, Nvidia', seller: 'Lambda', object: 'Аренда ЦОД в Техасе', sum: '$35 млрд', status: 'contract', players: [7] },
]

const M = 'https://media.kf.expert/lenta_nfmagazine/0'
export const MAGAZINE: Issue[] = [
  { year: 2026, month: 'Июль', no: '21', url: `${M}/12/NF MAGAZINE_21(3).pdf` },
  { year: 2026, month: 'Апрель', no: '20', url: `${M}/11/NF MAGAZINE_20(2) АПРЕЛЬ 2026.pdf` },
  { year: 2026, month: 'Январь', no: '19', url: `${M}/10/NF MAGAZINE_19(1) 01_2026.pdf` },
  { year: 2025, month: 'Октябрь', no: '18', url: `${M}/9/NF MAGAZINE_18(3) 10_2025.pdf` },
  { year: 2025, month: 'Июль', no: '17', url: `${M}/8/NF MAGAZINE_17(2)_июль_2025.pdf` },
  { year: 2025, month: 'Апрель', url: `${M}/7/NF MAGAZINE_april_2025.pdf` },
  { year: 2024, month: 'Октябрь', no: '15', url: `${M}/6/NF_MAGAZINE_15_october.pdf` },
  { year: 2024, month: 'Август', no: '14', url: `${M}/5/NF MAGAZINE_14(3)_август_2024.pdf` },
  { year: 2024, month: 'Май', url: `${M}/4/NF MAGAZINE_май_2024.pdf` },
  { year: 2024, month: 'Февраль', url: `${M}/1/february 2024.pdf` },
]
