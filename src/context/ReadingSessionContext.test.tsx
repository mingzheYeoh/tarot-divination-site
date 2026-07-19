import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from './ReadingSessionContext'

function Probe() {
  const { activeSpread } = useReadingSession()
  return <span>activeSpread: {activeSpread ?? 'none'}</span>
}

describe('ReadingSessionContext', () => {
  it('defaults to no active spread', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
  })
})
