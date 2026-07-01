import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, BarChart3, Ticket, Users, TrendingUp, Edit, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Event } from '@/types'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)

export default async function OrganizerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const isAdmin = ADMIN_EMAILS.includes(user.email ?? '')

  // Admins use service role to bypass RLS and see all events
  let myEvents: Event[] = []
  if (isAdmin) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await admin
      .from('events')
      .select('*, ticket_types(*)')
      .order('date', { ascending: true })
    myEvents = (data ?? []) as Event[]
  } else {
    const { data } = await supabase
      .from('events')
      .select('*, ticket_types(*)')
      .eq('organizer_id', user.id)
      .order('date', { ascending: true })
    myEvents = (data ?? []) as Event[]
  }

  const totalTicketsSold = myEvents.reduce((s, e) => s + (e.ticket_types?.reduce((ts, t) => ts + t.quantity_sold, 0) ?? 0), 0)
  const totalRevenue     = myEvents.reduce((s, e) => s + (e.ticket_types?.reduce((ts, t) => ts + t.quantity_sold * t.price, 0) ?? 0), 0)
  const userName = (user.user_metadata?.name as string | undefined) ?? user.email?.split('@')[0] ?? 'there'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-white">
              {isAdmin ? 'Admin Dashboard' : 'Organizer Dashboard'}
            </h1>
            {isAdmin && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'var(--primary)' }}>
                Admin
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Welcome back, {userName}
          </p>
        </div>
        <Link
          href="/organizer/events/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BarChart3,   label: 'Total Events',   value: myEvents.length,                                               color: 'rgba(255,87,34,0.15)',  iconColor: 'var(--primary)' },
          { icon: Ticket,      label: 'Tickets Sold',   value: totalTicketsSold.toLocaleString(),                            color: 'rgba(59,130,246,0.15)', iconColor: '#3b82f6'        },
          { icon: TrendingUp,  label: 'Total Revenue',  value: formatPrice(totalRevenue),                                    color: 'rgba(34,197,94,0.15)',  iconColor: '#22c55e'        },
          { icon: Users,       label: 'Avg. Attendance', value: Math.round(totalTicketsSold / Math.max(myEvents.length, 1)).toLocaleString(), color: 'rgba(168,85,247,0.15)', iconColor: '#a855f7' },
        ].map(({ icon: Icon, label, value, color, iconColor }) => (
          <div key={label} className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: color }}>
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Events table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{isAdmin ? 'All Events' : 'My Events'}</h2>
          <Link href="/organizer/events/new" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            <Plus className="w-4 h-4" /> New Event
          </Link>
        </div>

        {myEvents.length === 0 ? (
          <div className="rounded-2xl border p-12 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-3xl mb-3">🎟️</p>
            <h3 className="text-lg font-bold text-white mb-2">No events yet</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Create your first event to get started</p>
            <Link href="/organizer/events/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: 'var(--primary)' }}>
              <Plus className="w-4 h-4" /> Create Event
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b text-xs font-medium uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
              <div className="col-span-5">Event</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Sold</div>
              <div className="col-span-2 text-right">Revenue</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {myEvents.map((event, idx) => {
              const sold    = event.ticket_types?.reduce((s, t) => s + t.quantity_sold, 0) ?? 0
              const total   = event.ticket_types?.reduce((s, t) => s + t.quantity, 0) ?? 0
              const revenue = event.ticket_types?.reduce((s, t) => s + t.quantity_sold * t.price, 0) ?? 0
              const pct     = total > 0 ? Math.round((sold / total) * 100) : 0

              return (
                <div
                  key={event.id}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 px-5 py-4 items-center ${idx < myEvents.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="sm:col-span-5">
                    <p className="font-semibold text-white">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,87,34,0.15)', color: 'var(--primary)' }}>
                        {event.status}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>{event.city}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 85 ? '#ef4444' : 'var(--primary)' }} />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="sm:col-span-2 text-sm" style={{ color: 'var(--muted)' }}>
                    {formatDate(event.date)}
                  </div>
                  <div className="sm:col-span-2 text-sm text-right font-medium text-white">
                    {sold.toLocaleString()} / {total.toLocaleString()}
                  </div>
                  <div className="sm:col-span-2 text-sm text-right font-bold" style={{ color: '#22c55e' }}>
                    {formatPrice(revenue)}
                  </div>
                  <div className="sm:col-span-1 flex justify-end gap-2">
                    <Link href={`/events/${event.id}`} className="p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--muted)' }}>
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/organizer/events/${event.id}/edit`} className="p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--muted)' }}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,87,34,0.1) 0%, rgba(156,39,176,0.1) 100%)', borderColor: 'rgba(255,87,34,0.2)' }}>
        <h3 className="text-xl font-bold text-white mb-2">Ready to host your next event?</h3>
        <p className="mb-5 text-sm" style={{ color: 'var(--muted)' }}>Create an event in minutes and start selling tickets immediately.</p>
        <Link href="/organizer/events/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white" style={{ background: 'var(--primary)' }}>
          <Plus className="w-5 h-5" />
          Create New Event
        </Link>
      </div>
    </div>
  )
}
