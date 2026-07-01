import { SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import { CATEGORIES, CITIES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string }>
}) {
  const { q, category, city } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('events')
    .select('*, ticket_types(*)')
    .eq('status', 'published')
    .order('date', { ascending: true })

  if (q) {
    query = query.or(`title.ilike.%${q}%,venue.ilike.%${q}%,city.ilike.%${q}%,category.ilike.%${q}%`)
  }
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  if (city && city !== 'All Cities') {
    query = query.eq('city', city)
  }

  const { data } = await query
  const events = (data ?? []) as Event[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">
          {q ? `Results for "${q}"` : category && category !== 'All' ? category : 'All Events'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {events.length} event{events.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 rounded-xl border p-5 space-y-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="font-semibold text-white text-sm">Filters</span>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Search</label>
              <form action="/events" method="GET">
                {category && <input type="hidden" name="category" value={category} />}
                {city && <input type="hidden" name="city" value={city} />}
                <input
                  name="q"
                  type="text"
                  defaultValue={q}
                  placeholder="Artists, events, venues..."
                  className="w-full px-3 py-2 rounded-lg text-sm text-white border outline-none"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', colorScheme: 'dark' }}
                />
              </form>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Category</label>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat}
                    href={`/events?${q ? `q=${q}&` : ''}${city ? `city=${city}&` : ''}category=${cat}`}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      background: (category === cat || (!category && cat === 'All')) ? 'rgba(255,87,34,0.15)' : 'transparent',
                      color: (category === cat || (!category && cat === 'All')) ? 'var(--primary)' : 'var(--muted)',
                    }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>City</label>
              <div className="space-y-1">
                {CITIES.map(c => (
                  <Link
                    key={c}
                    href={`/events?${q ? `q=${q}&` : ''}${category ? `category=${category}&` : ''}city=${c}`}
                    className="block px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      background: city === c ? 'rgba(255,87,34,0.15)' : 'transparent',
                      color: city === c ? 'var(--primary)' : 'var(--muted)',
                    }}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            {(q || category || city) && (
              <Link
                href="/events"
                className="block w-full text-center py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Clear Filters
              </Link>
            )}
          </div>
        </aside>

        {/* Events grid */}
        <div className="flex-1">
          {events.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🎭</p>
              <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                {q || category || city ? 'Try adjusting your search or filters' : 'No events have been published yet'}
              </p>
              <Link href="/events" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                Browse all events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
