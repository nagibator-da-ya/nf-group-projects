export type Role = 'seller' | 'buyer' | 'consultant'

export interface Player {
  id: number
  name: string
  role: Role
  mentions: number // упоминаний
  messages: number // сообщений с упоминанием
  note?: string
  nf?: boolean
}

export interface Deal {
  id: number
  date: string
  buyer: string
  seller: string
  object: string
  sum: string
  status: 'closed' | 'talks' | 'contract' | 'agree'
  players: number[] // id игроков-участников
}

export interface Issue {
  year: number
  month: string
  no?: string
  url: string
}

export const ROLE_LABELS: Record<Role, string> = {
  seller: 'Продавцы',
  buyer: 'Покупатели',
  consultant: 'Консультанты',
}

// Условный объём демо-выборки
export const TOTAL_MESSAGES = 500
