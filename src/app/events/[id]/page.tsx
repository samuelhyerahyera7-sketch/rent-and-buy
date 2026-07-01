import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPrice, getAvailableTickets } from '@/lib/utils'
import TicketSelector from './TicketSelector'
import type { Event } from '@/types'

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('events')
    .select('*, ticket_types(*)')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!data) notFound()

  const event = data as Event
  const totalAttending = event.ticket_types?.reduce((s, t) => s + t.quantity_sold, 0) ?? 0

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-64 sm:h-96 lg:h-[500px] w-full overflow-hidden">
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link
            href="/events"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:bg-white/20"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column - Event details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: 'var(--primary)' }}>
                  {event.category}
                </span>
                {event.featured && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(255,87,34,0.4)', color: 'var(--primary)' }}>
                    ✦ Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{event.title}</h1>
              {event.organizer_name && (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>By <span className="text-white font-medium">{event.organizer_name}</span></p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Date',      value: formatDate(event.date) },
                { icon: Clock,    label: 'Time',      value: `${event.time}${event.end_time ? ` – ${event.end_time}` : ''}` },
                { icon: MapPin,   label: 'Venue',     value: event.venue },
                { icon: Users,    label: 'Attending', value: `${totalAttending.toLocaleString()}+ people` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,87,34,0.15)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-bold text-white mb-1">Location</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>{event.address}, {event.city}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent((event.address ?? '') + ', ' + event.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">About this event</h3>
              <p className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted)' }}>
                {event.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Share:</span>
              {['Twitter', 'Facebook', 'WhatsApp'].map(platform => (
                <button
                  key={platform}
                  className="px-4 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Right column - Ticket selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TicketSelector event={event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
