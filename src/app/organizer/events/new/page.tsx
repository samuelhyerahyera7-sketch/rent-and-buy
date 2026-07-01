'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, CheckCircle } from 'lucide-react'
import { CATEGORIES, CITIES } from '@/lib/mock-data'

interface TicketTier {
  id: string
  name: string
  price: string
  quantity: string
  description: string
}

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', end_time: '',
    venue: '', address: '', city: '', category: '',
  })
  const [tickets, setTickets] = useState<TicketTier[]>([
    { id: '1', name: 'General Admission', price: '', quantity: '', description: '' },
  ])

  function addTicketTier() {
    setTickets(prev => [...prev, { id: Date.now().toString(), name: '', price: '', quantity: '', description: '' }])
  }

  function removeTicketTier(id: string) {
    setTickets(prev => prev.filter(t => t.id !== id))
  }

  function updateTicket(id: string, field: keyof TicketTier, value: string) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(34,197,94,0.15)' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#22c55e' }} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Event Created!</h2>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>Your event "{form.title}" is now live and ready for ticket sales.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/organizer" className="px-6 py-3 rounded-xl font-bold text-white" style={{ background: 'var(--primary)' }}>
            Go to Dashboard
          </Link>
          <button onClick={() => { setSuccess(false); setForm({ title: '', description: '', date: '', time: '', end_time: '', venue: '', address: '', city: '', category: '' }); setTickets([{ id: '1', name: 'General Admission', price: '', quantity: '', description: '' }]) }}
            className="px-6 py-3 rounded-xl font-bold border transition-colors hover:bg-white/5" style={{ borderColor: 'var(--border)', color: 'white' }}>
            Create Another
          </button>
        </div>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border text-white outline-none transition-colors focus:border-orange-500 text-sm"
  const inputStyle = { background: 'var(--surface-2)', borderColor: 'var(--border)', colorScheme: 'dark' as const }
  const labelStyle = { color: 'var(--muted)' }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/organizer" className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: 'var(--muted)' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">Create New Event</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Fill in the details to publish your event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-white text-base mb-2">Event Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Event Title *</label>
            <input
              type="text" required value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Afrojack Live in Cape Town"
              className={inputClass} style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Description *</label>
            <textarea
              required rows={4} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Tell people what to expect at your event..."
              className={`${inputClass} resize-none`} style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Category *</label>
              <select
                required value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}
              >
                <option value="">Select category</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>City *</label>
              <select
                required value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}
              >
                <option value="">Select city</option>
                {CITIES.filter(c => c !== 'All Cities').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-white text-base mb-2">Date & Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Date *</label>
              <input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Start Time *</label>
              <input type="time" required value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>End Time</label>
              <input type="time" value={form.end_time} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))} className={inputClass} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-white text-base mb-2">Venue</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Venue Name *</label>
            <input type="text" required value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} placeholder="e.g. Cape Town International Convention Centre" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Street Address *</label>
            <input type="text" required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="e.g. 1 Lower Long Street, Cape Town" className={inputClass} style={inputStyle} />
          </div>
        </div>

        {/* Ticket Types */}
        <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Ticket Types</h2>
            <button
              type="button"
              onClick={addTicketTier}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--primary)' }}
            >
              <Plus className="w-4 h-4" /> Add Tier
            </button>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket, idx) => (
              <div key={ticket.id} className="rounded-xl border p-4 space-y-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Ticket Tier {idx + 1}</span>
                  {tickets.length > 1 && (
                    <button type="button" onClick={() => removeTicketTier(ticket.id)} className="text-xs transition-colors hover:text-red-400" style={{ color: 'var(--muted)' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={labelStyle}>Name *</label>
                    <input type="text" required value={ticket.name} onChange={e => updateTicket(ticket.id, 'name', e.target.value)} placeholder="General Admission" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={labelStyle}>Price (R) *</label>
                    <input type="number" required min="0" value={ticket.price} onChange={e => updateTicket(ticket.id, 'price', e.target.value)} placeholder="350" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={labelStyle}>Quantity *</label>
                    <input type="number" required min="1" value={ticket.quantity} onChange={e => updateTicket(ticket.id, 'quantity', e.target.value)} placeholder="500" className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={labelStyle}>Description (optional)</label>
                  <input type="text" value={ticket.description} onChange={e => updateTicket(ticket.id, 'description', e.target.value)} placeholder="What's included with this ticket?" className={inputClass} style={inputStyle} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/organizer" className="px-6 py-3 rounded-xl font-bold border transition-colors hover:bg-white/5 text-sm" style={{ borderColor: 'var(--border)', color: 'white' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)' }}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
            ) : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
