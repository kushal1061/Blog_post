'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', padding: '48px 40px', borderRadius: '12px' }}>
        
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 700, color: 'var(--ink-text)', textAlign: 'center', marginBottom: '8px', marginTop: 0 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', textAlign: 'center', marginBottom: '32px' }}>
          Sign in to your account
        </p>
        
        {error && (
          <div style={{ background: 'var(--ink-warm-light)', color: 'var(--ink-warm)', padding: '12px', borderRadius: '6px', border: '1px solid var(--ink-warm)', marginBottom: '24px', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-text)', marginBottom: '6px' }}>Email</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--ink-bg)',
              border: '1px solid var(--ink-border)',
              borderRadius: '6px',
              padding: '12px 14px',
              fontSize: '14px',
              color: 'var(--ink-text)',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-text)', marginBottom: '6px' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--ink-bg)',
              border: '1px solid var(--ink-border)',
              borderRadius: '6px',
              padding: '12px 14px',
              fontSize: '14px',
              color: 'var(--ink-text)',
              outline: 'none'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            background: 'var(--ink-text)',
            color: 'var(--ink-bg)',
            borderRadius: '6px',
            padding: '14px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '24px'
          }}
          className="hover:opacity-90 transition-opacity"
        >
          {loading ? 'Logging in...' : 'Sign in'}
        </button>
        
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', textAlign: 'center', margin: 0 }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--ink-text)', fontWeight: 600, textDecoration: 'underline' }}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
