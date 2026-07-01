import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Tag } from 'lucide-react'
import { Event } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'

interface EventCardProps {
  event: Event
  featured?: boolean
}

export default function EventCard({ event, featured }: EventCardProps) {
  const minPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map(t => t.price))
    : 0
  const totalSold = event.ticket_types?.reduce((s, t) => s + t.quantity_sold, 0) ?? 0
  const totalQty = event.ticket_types?.reduce((s, t) => s + t.quantity, 0) ?? 0
  const pct = totalQty > 0 ? (totalSold / totalQty) * 100 : 0
  const almostOut = pct > 85

  if (featured) {
    return (
      <Link href={`/events/${event.id}`} className="group relative block rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3" style={{ background: 'var(--primary)', color: 'white' }}>
            {event.category}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">{event.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {event.city}
            </span>
            <span className="font-semibold text-white">
              From {formatPrice(minPrice)}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block rounded-xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.65)', color: 'white', backdropFilter: 'blur(4px)' }}>
            {event.category}
          </span>
        </div>
        {almostOut && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--primary)' }}>
              Almost Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-2 line-clamp-2 leading-tight transition-colors" style={{ color: 'var(--foreground)' }}>
          {event.title}
        </h3>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--muted)' }}>
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatDate(event.date)} • {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--muted)' }}>
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
            <Tag className="w-3.5 h-3.5" />
            From
          </div>
          <span className="font-bold" style={{ color: 'var(--foreground)' }}>{formatPrice(minPrice)}</span>
        </div>
      </div>
    </Link>
  )
}
