import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import ShuffleStep from './ShuffleStep'

function StepProbe() {
  const { step } = useReadingSession()
  return (
    <>
      <ShuffleStep />
      <span>step: {step}</span>
    </>
  )
}

describe('ShuffleStep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the shuffling caption', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('命运正在交织...')).toBeInTheDocument()
    expect(screen.getByText('静候星辰的指引，牌阵正在苏醒')).toBeInTheDocument()
  })

  it('advances to selecting after 2 seconds, not before', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1999)
    })
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByText('step: selecting')).toBeInTheDocument()
  })
})
