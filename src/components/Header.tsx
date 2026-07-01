'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Ticket, Search } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>quello</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-sm font-medium transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>
              Events
            </Link>
            <Link href="/events?category=Electronic" className="text-sm font-medium transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>
              Music
            </Link>
            <Link href="/events?category=Comedy" className="text-sm font-medium transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>
              Comedy
            </Link>
            <Link href="/organizer" className="text-sm font-medium transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>
              Organizers
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/events" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: 'var(--muted)' }}>
              <Search className="w-4 h-4" />
            </Link>

            <Link href="/checkout" className="relative p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: 'var(--muted)' }}>
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold" style={{ background: 'var(--primary)' }}>
                  {itemCount}
                </span>
              )}
            </Link>

            <Link href="/auth/login" className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>
              Sign in
            </Link>
            <Link href="/auth/register" className="text-sm font-bold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90" style={{ background: 'var(--primary)' }}>
              Sign up
            </Link>

            <button
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: 'var(--muted)' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
          <Link href="/events" className="block py-2 text-sm font-medium" style={{ color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>Events</Link>
          <Link href="/events?category=Electronic" className="block py-2 text-sm font-medium" style={{ color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>Music</Link>
          <Link href="/events?category=Comedy" className="block py-2 text-sm font-medium" style={{ color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>Comedy</Link>
          <Link href="/organizer" className="block py-2 text-sm font-medium" style={{ color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>Organizers</Link>
          <Link href="/dashboard" className="block py-2 text-sm font-medium" style={{ color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>My Tickets</Link>
          <Link href="/auth/login" className="block py-2 text-sm font-medium" style={{ color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>Sign in</Link>
        </div>
      )}
    </header>
  )
}
