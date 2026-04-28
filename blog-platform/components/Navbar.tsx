'use client'

import Link from 'next/link'
import { useUser } from '@/lib/UserContext'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, role, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'

  const isLoggedOut = !loading && !user;

  return (
    <nav style={{ background: 'var(--ink-bg)', borderBottom: '1px solid var(--ink-border)' }} className="sticky top-0 z-50">
      <div className={`container mx-auto px-4 max-w-5xl h-16 flex items-center ${isLoggedOut ? 'justify-center' : 'justify-between'}`}>
        
        {/* Brand */}
        <Link href="/" className="flex items-center" style={{ fontFamily: "Georgia, serif", fontSize: '20px', fontWeight: 700 }}>
          <span style={{ color: 'var(--ink-text)' }}>ink</span>
          <span style={{ color: 'var(--ink-accent)' }}>well</span>
        </Link>

        {!isLoggedOut && !loading && (
          <>
            {/* Center: Links (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-6" style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
              <Link href="/" className="hover:text-[var(--ink-text)] transition-colors">Explore</Link>
              {role && ['author', 'admin'].includes(role) && (
                <Link href="/posts/create" className="hover:text-[var(--ink-text)] transition-colors">Write</Link>
              )}
              {role && (
                <Link href="/profile" className="hover:text-[var(--ink-text)] transition-colors">My Stories</Link>
              )}
              {role === 'admin' && (
                <Link href="/admin" className="hover:text-[var(--ink-text)] transition-colors">Admin</Link>
              )}
            </div>

            {/* Right: User */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex items-center gap-2 group">
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--ink-accent)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {getInitials(displayName)}
                    </div>
                    <span className="hidden md:block group-hover:text-[var(--ink-accent)] transition-colors" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-text)' }}>
                      {displayName}
                    </span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={{ color: 'var(--ink-muted)' }}
                    className="hover:text-[var(--ink-text)] p-1.5 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 hover:text-black cursor-pointer" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </nav>
  )
}
