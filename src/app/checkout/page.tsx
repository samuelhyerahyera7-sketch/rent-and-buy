'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Lock, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice, formatDate } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '' })
  const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart')

  const serviceFee = Math.round(total * 0.025)
  const grandTotal = total + serviceFee

  function handleDetails(e: React.FormEvent) {
    e.preventDefault()
    setStep('payment')
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000))

    // Generate tickets and store in localStorage
    const orderId = uuidv4()
    const tickets = items.flatMap(item =>
      Array.from({ length: item.quantity }, (_, i) => ({
        id: uuidv4(),
        order_id: orderId,
        ticket_type_id: item.ticket_type_id,
        user_id: 'demo-user',
        qr_code: JSON.stringify({ t: uuidv4(), e: item.event_id, ts: Date.now() }),
        used: false,
        created_at: new Date().toISOString(),
        event_title: item.event_title,
        event_date: item.event_date,
        event_venue: item.event_venue,
        ticket_type_name: item.ticket_type_name,
        price: item.price,
      }))
    )

    const existing = JSON.parse(localStorage.getItem('quello_tickets') ?? '[]')
    localStorage.setItem('quello_tickets', JSON.stringify([...existing, ...tickets]))
    localStorage.setItem('quello_last_order', JSON.stringify({ orderId, tickets, email: form.email, total: grandTotal }))

    clearCart()
    router.push('/checkout/success')
  }

  if (items.length === 0 && step === 'cart') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--muted)' }} />
        <h1 className="text-2xl font-black text-white mb-3">Your cart is empty</h1>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>Add tickets to your cart to proceed to checkout</p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: 'var(--primary)' }}
        >
          Browse Events
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {(['cart', 'details', 'payment'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px" style={{ background: 'var(--border)' }} />}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: step === s ? 'var(--primary)' : ['cart', 'details', 'payment'].indexOf(step) > i ? 'rgba(255,87,34,0.3)' : 'var(--surface-2)',
                  color: step === s ? 'white' : ['cart', 'details', 'payment'].indexOf(step) > i ? 'var(--primary)' : 'var(--muted)',
                }}
              >
                {i + 1}
              </div>
              <span className="hidden sm:block text-sm font-medium capitalize" style={{ color: step === s ? 'white' : 'var(--muted)' }}>
                {s === 'cart' ? 'Your Cart' : s === 'details' ? 'Your Details' : 'Payment'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main area */}
        <div className="lg:col-span-2">
          {step === 'cart' && (
            <div>
              <h1 className="text-2xl font-black text-white mb-6">Your Cart</h1>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.ticket_type_id} className="flex items-start gap-4 p-4 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{item.event_title}</p>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{item.ticket_type_name} · {formatDate(item.event_date)}</p>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{item.event_venue}</p>
                      <p className="font-semibold mt-2" style={{ color: 'var(--primary)' }}>{formatPrice(item.price)} each</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <button onClick={() => removeItem(item.ticket_type_id)} className="transition-colors hover:text-white" style={{ color: 'var(--muted)' }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.ticket_type_id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:bg-white/10"
                          style={{ borderColor: 'var(--border)', color: 'white' }}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-white text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.ticket_type_id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:bg-white/10"
                          style={{ borderColor: 'var(--border)', color: 'white' }}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Link href="/events" className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: 'var(--muted)' }}>
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
                <div className="flex-1" />
                <button
                  onClick={() => setStep('details')}
                  className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'var(--primary)' }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleDetails}>
              <h2 className="text-2xl font-black text-white mb-6">Your Details</h2>
              <div className="space-y-4">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+27 82 000 0000' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[name as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border text-white outline-none transition-colors focus:border-orange-500"
                      style={{ background: 'var(--surface)', borderColor: 'var(--border)', colorScheme: 'dark' }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setStep('cart')} className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl border transition-colors hover:bg-white/5" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90" style={{ background: 'var(--primary)' }}>
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePayment}>
              <h2 className="text-2xl font-black text-white mb-6">Payment</h2>
              <div className="rounded-xl border p-5 mb-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium mb-4" style={{ color: 'var(--muted)' }}>Card Details</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={cardForm.number}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                        const formatted = val.match(/.{1,4}/g)?.join(' ') ?? val
                        setCardForm(prev => ({ ...prev, number: formatted }))
                      }}
                      className="w-full px-4 py-3 rounded-xl border text-white outline-none transition-colors focus:border-orange-500"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', colorScheme: 'dark' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Expiry</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardForm.expiry}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                          const formatted = val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val
                          setCardForm(prev => ({ ...prev, expiry: formatted }))
                        }}
                        className="w-full px-4 py-3 rounded-xl border text-white outline-none transition-colors focus:border-orange-500"
                        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', colorScheme: 'dark' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>CVC</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={3}
                        value={cardForm.cvc}
                        onChange={e => setCardForm(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                        className="w-full px-4 py-3 rounded-xl border text-white outline-none transition-colors focus:border-orange-500"
                        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4 mb-5 flex items-center gap-3" style={{ background: 'rgba(255,87,34,0.08)', borderColor: 'rgba(255,87,34,0.3)' }}>
                <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Your payment is secured by 256-bit SSL encryption. We never store your card details.
                </p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('details')} className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl border transition-colors hover:bg-white/5" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ background: 'var(--primary)' }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay {formatPrice(grandTotal)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-5">
              {items.map(item => (
                <div key={item.ticket_type_id} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-white font-medium truncate">{item.ticket_type_name}</p>
                    <p style={{ color: 'var(--muted)' }}>{item.quantity}× {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-semibold text-white flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t text-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between" style={{ color: 'var(--muted)' }}>
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--muted)' }}>
                <span>Service Fee (2.5%)</span>
                <span className="text-white">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-2 border-t text-base" style={{ borderColor: 'var(--border)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
