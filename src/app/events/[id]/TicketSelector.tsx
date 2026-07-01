'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Lock } from 'lucide-react'
import { Event, TicketType } from '@/types'
import { formatPrice, getAvailableTickets } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

export default function TicketSelector({ event }: { event: Event }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [added, setAdded] = useState(false)

  const ticketTypes = event.ticket_types ?? []

  function setQty(id: string, qty: number) {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, qty) }))
  }

  const total = ticketTypes.reduce((sum, t) => sum + (quantities[t.id] ?? 0) * t.price, 0)
  const hasSelections = Object.values(quantities).some(q => q > 0)

  function handleAddToCart() {
    ticketTypes.forEach(t => {
      const qty = quantities[t.id] ?? 0
      if (qty > 0) {
        addItem({
          ticket_type_id: t.id,
          ticket_type_name: t.name,
          event_id: event.id,
          event_title: event.title,
          event_date: event.date,
          event_venue: event.venue,
          price: t.price,
          quantity: qty,
        })
      }
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold text-white text-lg">Select Tickets</h3>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Choose your ticket type and quantity</p>
      </div>

      <div className="p-5 space-y-4">
        {ticketTypes.map(ticket => {
          const available = getAvailableTickets(ticket.quantity, ticket.quantity_sold)
          const qty = quantities[ticket.id] ?? 0
          const soldOut = available === 0

          return (
            <div
              key={ticket.id}
              className="rounded-xl p-4 border transition-all"
              style={{
                borderColor: qty > 0 ? 'var(--primary)' : 'var(--border)',
                background: qty > 0 ? 'rgba(255,87,34,0.08)' : 'var(--surface-2)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-semibold text-white text-sm">{ticket.name}</p>
                  {ticket.description && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{ticket.description}</p>
                  )}
                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--primary)' }}>
                    {formatPrice(ticket.price)}
                  </p>
                </div>
                <div>
                  {soldOut ? (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>
                      Sold Out
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(ticket.id, qty - 1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30 hover:bg-white/10"
                        style={{ borderColor: 'var(--border)', color: 'white' }}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-white text-sm">{qty}</span>
                      <button
                        onClick={() => setQty(ticket.id, qty + 1)}
                        disabled={qty >= Math.min(10, available)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30 hover:bg-white/10"
                        style={{ borderColor: 'var(--border)', color: 'white' }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!soldOut && (
                <p className="text-xs" style={{ color: available < ticket.quantity * 0.15 ? '#ff6b6b' : 'var(--muted)' }}>
                  {available < ticket.quantity * 0.15 ? `⚡ Only ${available} left!` : `${available.toLocaleString()} available`}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Total + CTA */}
      <div className="p-5 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
        {hasSelections && (
          <div className="flex items-center justify-between text-sm mb-4">
            <span style={{ color: 'var(--muted)' }}>Subtotal</span>
            <span className="font-bold text-white text-base">{formatPrice(total)}</span>
          </div>
        )}

        <button
          onClick={handleBuyNow}
          disabled={!hasSelections}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--primary)' }}
        >
          {hasSelections ? `Buy Now — ${formatPrice(total)}` : 'Select Tickets'}
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!hasSelections}
          className="w-full py-3 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ borderColor: 'var(--border)', color: added ? 'var(--primary)' : 'white' }}
        >
          <ShoppingCart className="w-4 h-4" />
          {added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
          <Lock className="w-3 h-3" />
          Secure checkout powered by Stripe
        </div>
      </div>
    </div>
  )
}
