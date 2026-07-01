'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Download, Calendar, MapPin } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { formatDate, formatPrice } from '@/lib/utils'

interface TicketData {
  id: string
  event_title: string
  event_date: string
  event_venue: string
  ticket_type_name: string
  price: number
  qr_code: string
}

export default function SuccessPage() {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [orderInfo, setOrderInfo] = useState<{ email: string; total: number } | null>(null)
  const [expandedQR, setExpandedQR] = useState<string | null>(null)

  useEffect(() => {
    const lastOrder = localStorage.getItem('quello_last_order')
    if (lastOrder) {
      const { tickets: t, email, total } = JSON.parse(lastOrder)
      setTickets(t)
      setOrderInfo({ email, total })
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(34,197,94,0.15)' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#22c55e' }} />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
        <p style={{ color: 'var(--muted)' }}>
          {orderInfo ? `Your tickets have been sent to ${orderInfo.email}` : 'Your tickets are ready below'}
        </p>
        {orderInfo && (
          <p className="mt-2 font-bold" style={{ color: 'var(--primary)' }}>
            Total paid: {formatPrice(orderInfo.total)}
          </p>
        )}
      </div>

      {/* Tickets */}
      <div className="space-y-4 mb-10">
        <h2 className="font-bold text-white text-lg">Your Tickets</h2>
        {tickets.length === 0 && (
          <div className="text-center py-8 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
            No tickets found
          </div>
        )}
        {tickets.map((ticket, idx) => (
          <div key={ticket.id} className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {/* Ticket header */}
            <div className="p-5 border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(255,87,34,0.1) 0%, transparent 100%)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--primary)' }}>
                    TICKET #{idx + 1} — {ticket.ticket_type_name}
                  </p>
                  <h3 className="font-black text-white text-lg leading-tight">{ticket.event_title}</h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white">{formatPrice(ticket.price)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: 'var(--muted)' }}>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(ticket.event_date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {ticket.event_venue}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-5 flex flex-col items-center gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'white' }}>
                <QRCodeSVG
                  value={ticket.qr_code}
                  size={expandedQR === ticket.id ? 240 : 140}
                  level="H"
                />
              </div>
              <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                Show this QR code at the entrance
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setExpandedQR(expandedQR === ticket.id ? null : ticket.id)}
                  className="px-4 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  {expandedQR === ticket.id ? 'Shrink' : 'Expand QR'}
                </button>
              </div>

              {/* Ticket ID */}
              <p className="text-xs font-mono px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                ID: {ticket.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="flex-1 py-3 rounded-xl font-bold text-white text-center transition-all hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          View All My Tickets
        </Link>
        <Link
          href="/events"
          className="flex-1 py-3 rounded-xl font-bold text-center border transition-all hover:bg-white/5"
          style={{ borderColor: 'var(--border)', color: 'white' }}
        >
          Browse More Events
        </Link>
      </div>
    </div>
  )
}
