import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight, Zap, Shield, Smartphone, Music, Laugh, Utensils, Film, Dumbbell, Theater, Headphones, Flame, Star, Users, Globe } from 'lucide-react'
import EventCard from '@/components/EventCard'
import { CATEGORIES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types'

const CATEGORY_STYLES: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
  Electronic:    { bg: 'rgba(255,87,34,0.12)', color: '#ff5722', icon: Headphones },
  Jazz:          { bg: 'rgba(59,91,219,0.12)', color: '#3b5bdb', icon: Music },
  Comedy:        { bg: 'rgba(245,159,0,0.12)',  color: '#e67700', icon: Laugh },
  Music:         { bg: 'rgba(112,72,232,0.12)', color: '#7048e8', icon: Music },
  'Food & Wine': { bg: 'rgba(47,158,68,0.12)',  color: '#2f9e44', icon: Utensils },
  Film:          { bg: 'rgba(201,42,42,0.12)',  color: '#c92a2a', icon: Film },
  Sports:        { bg: 'rgba(0,120,212,0.12)',  color: '#0078d4', icon: Dumbbell },
  Theatre:       { bg: 'rgba(194,24,91,0.12)',  color: '#c2185b', icon: Theater },
}

const CITY_IMAGES: Record<string, string> = {
  'Cape Town':    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80',
  'Johannesburg': 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&q=80',
  'Durban':       'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',
  'Stellenbosch': 'https://images.unsplash.com/photo-1598449426314-8b02525e8733?w=600&q=80',
  'Pretoria':     'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&q=80',
}

const STATS = [
  { icon: Star,  value: '4.9★',   label: 'Average rating'      },
  { icon: Users, value: '500K+',  label: 'Tickets sold'        },
  { icon: Zap,   value: '200+',   label: 'Events every month'  },
  { icon: Globe, value: '50+',    label: 'Cities covered'      },
]

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: allEvents = [] } = await supabase
    .from('events')
    .select('*, ticket_types(*)')
    .eq('status', 'published')
    .order('date', { ascending: true })

  const events = (allEvents ?? []) as Event[]

  const featured    = events.filter(e => e.featured)
  const upcoming    = events.filter(e => !e.featured).slice(0, 4)
  const heroEvent   = featured[0] ?? upcoming[0] ?? null
  const sellingFast = events.filter(e => {
    const sold  = e.ticket_types?.reduce((s, t) => s + t.quantity_sold, 0) ?? 0
    const total = e.ticket_types?.reduce((s, t) => s + t.quantity, 0) ?? 0
    return total > 0 && sold / total > 0.6
  }).slice(0, 3)

  // Build city list dynamically from real events
  const cityMap: Record<string, number> = {}
  events.forEach(e => { cityMap[e.city] = (cityMap[e.city] ?? 0) + 1 })
  const cities = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, count, image: CITY_IMAGES[name] ?? FALLBACK_HERO }))

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroEvent?.image_url ?? FALLBACK_HERO}
            alt={heroEvent?.title ?? 'Quello Events'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,87,34,0.18) 0%, transparent 60%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-24 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold text-white" style={{ background: 'var(--primary)' }}>
            <Zap className="w-4 h-4" />
            SA's #1 Event Ticketing Platform
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6 max-w-4xl">
            Find Your<br />
            Next <span style={{ color: 'var(--primary)' }}>Experience.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
            Concerts, comedy, festivals, food — South Africa's best live events, all in one place.
          </p>

          <form action="/events" method="GET" className="max-w-2xl">
            <div className="flex items-center gap-3 p-2 rounded-2xl border border-white/20 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Search className="w-5 h-5 ml-3 flex-shrink-0 text-white/60" />
              <input
                name="q"
                type="text"
                placeholder="Search events, artists, venues..."
                className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex-shrink-0"
                style={{ background: 'var(--primary)' }}
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.filter(c => c !== 'All').map(cat => {
              const s = CATEGORY_STYLES[cat] ?? { icon: Zap }
              const Icon = s.icon
              return (
                <Link
                  key={cat}
                  href={`/events?category=${cat}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-white/20 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="border-b" style={{ background: 'var(--foreground)', borderColor: '#222' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 py-5 px-6">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,87,34,0.2)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{value}</div>
                  <div className="text-xs text-white/50">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ──────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--foreground)' }}>Featured Events</h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>Handpicked experiences you won't want to miss</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80" style={{ color: 'var(--primary)' }}>
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.slice(0, 2).map(event => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── SELLING FAST ─────────────────────────────────────────── */}
      {sellingFast.length > 0 && (
        <section className="py-12 border-y" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,87,34,0.12)' }}>
                  <Flame className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>Selling Fast</h2>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Don't sleep on these — tickets are going quick</p>
                </div>
              </div>
              <Link href="/events" className="hidden sm:flex items-center gap-2 text-sm font-bold hover:opacity-80" style={{ color: 'var(--primary)' }}>
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {sellingFast.map(event => {
                const sold     = event.ticket_types?.reduce((s, t) => s + t.quantity_sold, 0) ?? 0
                const total    = event.ticket_types?.reduce((s, t) => s + t.quantity, 0) ?? 0
                const pct      = total > 0 ? Math.round((sold / total) * 100) : 0
                const minPrice = Math.min(...(event.ticket_types?.map(t => t.price) ?? [0]))
                const style    = CATEGORY_STYLES[event.category]

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group block rounded-2xl overflow-hidden border hover:shadow-lg transition-all hover:-translate-y-1"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      <Image src={event.image_url} alt={event.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" unoptimized />
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--primary)' }}>
                          🔥 {100 - pct}% left
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: style?.bg ?? '#f5f5f5', color: style?.color ?? '#555' }}>
                          {event.category}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>{event.city}</span>
                      </div>
                      <h3 className="font-bold mb-3 line-clamp-2 leading-tight" style={{ color: 'var(--foreground)' }}>{event.title}</h3>
                      <div className="mb-3">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 85 ? '#ef4444' : 'var(--primary)' }} />
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{sold.toLocaleString()} / {total.toLocaleString()} tickets sold</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--muted)' }}>{event.date}</span>
                        <span className="font-black text-base" style={{ color: 'var(--foreground)' }}>R {minPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--foreground)' }}>Upcoming Events</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>What's coming up across South Africa</p>
          </div>
          <Link href="/events" className="hidden sm:flex items-center gap-2 text-sm font-bold hover:opacity-80" style={{ color: 'var(--primary)' }}>
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-4xl mb-4">🎭</p>
            <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Check back soon or create the first event</p>
            <Link href="/organizer/events/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white" style={{ background: 'var(--primary)' }}>
              Create Event
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {upcoming.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold border transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Browse All Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── EXPLORE BY CITY ──────────────────────────────────────── */}
      {cities.length > 0 && (
        <section className="py-16 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--foreground)' }}>Explore by City</h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>Find events happening near you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cities.map(city => (
                <Link
                  key={city.name}
                  href={`/events?city=${city.name}`}
                  className="group relative block rounded-2xl overflow-hidden hover:-translate-y-1 transition-all hover:shadow-xl"
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-black text-white text-lg leading-tight">{city.name}</h3>
                    <p className="text-white/70 text-sm">{city.count} event{city.count !== 1 ? 's' : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY QUELLO ───────────────────────────────────────────── */}
      <section className="py-20 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: 'var(--foreground)' }}>Why Quello?</h2>
            <p style={{ color: 'var(--muted)' }}>Built for South Africa. Built to be the best.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Zap,        title: 'Instant Booking',  desc: 'Buy tickets in seconds. No hidden fees, no fuss, no friction.',                               accent: '#ff5722', light: 'rgba(255,87,34,0.1)'  },
              { icon: Shield,     title: 'Safe & Secure',    desc: 'Every purchase protected. Digital tickets with tamper-proof QR codes delivered instantly.',    accent: '#3b5bdb', light: 'rgba(59,91,219,0.1)'  },
              { icon: Smartphone, title: 'Mobile First',     desc: 'Your tickets live on your phone. Scan at the door, no printing, no stress.',                  accent: '#2f9e44', light: 'rgba(47,158,68,0.1)'  },
            ].map(({ icon: Icon, title, desc, accent, light }) => (
              <div key={title} className="p-7 rounded-2xl border" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: light }}>
                  <Icon className="w-6 h-6" style={{ color: accent }} />
                </div>
                <h3 className="font-black text-lg mb-2" style={{ color: 'var(--foreground)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORGANIZER CTA ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: 'var(--foreground)' }}>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: 'var(--primary)', filter: 'blur(80px)' }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{ background: '#7048e8', filter: 'blur(60px)' }} />
          <div className="relative px-8 sm:px-16 py-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold" style={{ background: 'rgba(255,87,34,0.2)', color: 'var(--primary)' }}>
              <Zap className="w-4 h-4" />
              For organizers
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Hosting an Event?<br />
              <span style={{ color: 'var(--primary)' }}>We've got you.</span>
            </h2>
            <p className="max-w-lg mx-auto mb-8 text-white/60 text-base leading-relaxed">
              Create, promote, and sell tickets to your events in minutes. Powerful tools, real-time analytics, instant payouts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/organizer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90" style={{ background: 'var(--primary)' }}>
                Start Selling Tickets <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/events" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border border-white/20 text-white transition-all hover:bg-white/10">
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
