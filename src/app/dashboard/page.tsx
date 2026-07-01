'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Ticket, Calendar, MapPin, QrCode, ArrowRight } from 'lucide-react'
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
  used: boolean
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [showQR, setShowQR] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('quello_user')
    if (savedUser) setUser(JSON.parse(savedUser))

    const savedTickets = localStorage.getItem('quello_tickets')
    if (savedTickets) setTickets(JSON.parse(savedTickets))
  }, [])

  const upcoming = tickets.filter(t => new Date(t.event_date) >= new Date())
  const past = tickets.filter(t => new Date(t.event_date) < new Date())

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-1">
          {user ? `Hey, ${user.name} 👋` : 'My Dashboard'}
        </h1>
        {user && <p className="text-sm" style={{ color: 'var(--muted)' }}>{user.email}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Tickets', value: tickets.length },
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Past Events', value: past.length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border p-4 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <Ticket className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
          <h3 className="text-xl font-bold text-white mb-2">No tickets yet</h3>
          <p className="mb-6 text-sm" style={{ color: 'var(--muted)' }}>Book tickets to your first event to see them here</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: 'var(--primary)' }}
          >
            Browse Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-bold text-white text-xl mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {upcoming.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} showQR={showQR} onToggleQR={setShowQR} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="font-bold text-white text-xl mb-4">Past Events</h2>
              <div className="space-y-4 opacity-60">
                {past.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} showQR={showQR} onToggleQR={setShowQR} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/events" className="flex items-center gap-4 p-5 rounded-xl border transition-all hover:border-white/20 hover:-translate-y-0.5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,87,34,0.15)' }}>
            <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p className="font-semibold text-white">Browse Events</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Discover what's happening near you</p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto" style={{ color: 'var(--muted)' }} />
        </Link>
        <Link href="/organizer" className="flex items-center gap-4 p-5 rounded-xl border transition-all hover:border-white/20 hover:-translate-y-0.5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,87,34,0.15)' }}>
            <Ticket className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p className="font-semibold text-white">Create an Event</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Start selling tickets today</p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto" style={{ color: 'var(--muted)' }} />
        </Link>
      </div>
    </div>
  )
}

function TicketCard({
  ticket,
  showQR,
  onToggleQR,
}: {
  ticket: TicketData
  showQR: string | null
  onToggleQR: (id: string | null) => void
}) {
  const isShowing = showQR === ticket.id

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,87,34,0.15)' }}>
          <Ticket className="w-6 h-6" style={{ color: 'var(--primary)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white truncate">{ticket.event_title}</p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--primary)' }}>{ticket.ticket_type_name}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: 'var(--muted)' }}>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(ticket.event_date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {ticket.event_venue}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-bold text-white">{formatPrice(ticket.price)}</p>
          <button
            onClick={() => onToggleQR(isShowing ? null : ticket.id)}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
            style={{ color: 'var(--primary)' }}
          >
            <QrCode className="w-3.5 h-3.5" />
            {isShowing ? 'Hide QR' : 'View QR'}
          </button>
        </div>
      </div>

      {isShowing && (
        <div className="border-t px-5 pb-5 pt-4 flex flex-col items-center gap-3" style={{ borderColor: 'var(--border)' }}>
          <div className="p-4 rounded-xl" style={{ background: 'white' }}>
            <QRCodeSVG value={ticket.qr_code} size={180} level="H" />
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Ticket ID: <span className="font-mono">{ticket.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>
      )}
    </div>
  )
}
