export const ROUTES = {
  HOME: '/',
  PLAYERS: '/players',
  PLAYER: '/player/:id',
  MAGAZINE: '/magazine',
}
export type RouteKeyType = keyof typeof ROUTES
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: 'Главная',
  PLAYERS: 'Игроки рынка ЦОД',
  PLAYER: 'Игрок',
  MAGAZINE: 'NF Magazine',
}
