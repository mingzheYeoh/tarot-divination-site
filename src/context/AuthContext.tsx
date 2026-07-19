import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  userId: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [value] = useState<AuthContextValue>({ userId: null, isAuthenticated: false })
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
