import { Navigate } from 'react-router'
import { ReactNode } from 'react'

interface GuardRouteProps {
  children: ReactNode
}

export const GuardRoute = ({ children }: GuardRouteProps) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}
