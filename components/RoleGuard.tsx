'use client'

import { useUser, UserRole } from '@/lib/UserContext'
import { ReactNode } from 'react'

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: { 
  children: ReactNode; 
  allowedRoles: UserRole[]; 
  fallback?: ReactNode 
}) {
  const { role, loading } = useUser()

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading permissions...</div>

  if (!role || !allowedRoles.includes(role)) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
