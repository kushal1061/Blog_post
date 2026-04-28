'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './supabase'
import { User } from '@supabase/supabase-js'

export type UserRole = 'author' | 'viewer' | 'admin' | null

interface UserContextType {
  user: User | null
  role: UserRole
  loading: boolean
}

const UserContext = createContext<UserContextType>({ user: null, role: null, loading: true })

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchUser = async (currentUser: User) => {
      setUser(currentUser)
      const { data, error } = await supabase.from('users').select('role').eq('id', currentUser.id).single()
      if (!error && data) {
        setRole(data.role as UserRole)
      } else {
        setRole(null)
      }
      setLoading(false)
    }

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        fetchUser(user)
      } else {
        setUser(null)
        setRole(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUser(session.user)
      } else {
        setUser(null)
        setRole(null)
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
