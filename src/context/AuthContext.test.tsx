import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function Probe() {
  const { userId, isAuthenticated } = useAuth()
  return (
    <div>
      <span>userId: {userId ?? 'none'}</span>
      <span>isAuthenticated: {String(isAuthenticated)}</span>
    </div>
  )
}

describe('AuthContext', () => {
  it('defaults to an unauthenticated, userId-less session', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    )
    expect(screen.getByText('userId: none')).toBeInTheDocument()
    expect(screen.getByText('isAuthenticated: false')).toBeInTheDocument()
  })
})
