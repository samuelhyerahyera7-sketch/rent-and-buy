import { format, parseISO } from 'date-fns'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE, d MMM yyyy')
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'd MMM')
}

export function getAvailableTickets(quantity: number, sold: number): number {
  return Math.max(0, quantity - sold)
}

export function isAlmostSoldOut(quantity: number, sold: number): boolean {
  const available = getAvailableTickets(quantity, sold)
  return available > 0 && available / quantity < 0.1
}

export function generateQRData(ticketId: string, eventId: string, userId: string): string {
  return JSON.stringify({ ticketId, eventId, userId, ts: Date.now() })
}
