import Link from 'next/link'
import { Ticket } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>quello</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              South Africa's premier event ticketing platform. Discover, book, and experience the best events near you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--foreground)' }}>Discover</h3>
            <ul className="space-y-3">
              {['Browse Events', 'Upcoming Shows', 'Featured Artists', 'Venues'].map(item => (
                <li key={item}>
                  <Link href="/events" className="text-sm transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--foreground)' }}>Organize</h3>
            <ul className="space-y-3">
              {['Create an Event', 'Organizer Dashboard', 'Pricing', 'Help Center'].map(item => (
                <li key={item}>
                  <Link href="/organizer" className="text-sm transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--foreground)' }}>Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm transition-colors hover:text-black" style={{ color: 'var(--muted)' }}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            © 2026 Quello. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Made with ❤️ in South Africa
          </p>
        </div>
      </div>
    </footer>
  )
}
