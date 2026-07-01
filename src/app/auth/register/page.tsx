'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Ticket, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm]        = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/organizer')
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--primary)' }}>
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Create your account</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>Join Quello and never miss an event</p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',  label: 'Full Name', type: 'text',  placeholder: 'Your full name'  },
              { key: 'email', label: 'Email',     type: 'email', placeholder: 'your@email.com' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-white outline-none transition-colors focus:border-orange-500"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', colorScheme: 'dark' }}
                />
              </div>
            ))}

            {['password', 'confirm'].map(key => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                  {key === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-white outline-none transition-colors focus:border-orange-500 pr-12"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', colorScheme: 'dark' }}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-white" style={{ color: 'var(--muted)' }}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: 'var(--primary)' }}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                : 'Create Account'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              By signing up you agree to our{' '}
              <Link href="#" className="underline hover:text-white">Terms</Link> and{' '}
              <Link href="#" className="underline hover:text-white">Privacy Policy</Link>
            </p>
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-white hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
