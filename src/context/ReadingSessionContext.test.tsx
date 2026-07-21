import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from './ReadingSessionContext'

function Probe() {
  const session = useReadingSession()
  return (
    <div>
      <span>step: {session.step}</span>
      <span>question: {session.question || 'none'}</span>
      <span>drawnCard: {session.drawnCard ? session.drawnCard.id : 'none'}</span>
      <button onClick={() => session.setQuestion('我该如何前进？')}>setQuestion</button>
      <button onClick={() => session.beginShuffle()}>beginShuffle</button>
      <button onClick={() => session.finishShuffle()}>finishShuffle</button>
      <button onClick={() => session.selectCard()}>selectCard</button>
      <button onClick={() => session.finishReveal()}>finishReveal</button>
      <button onClick={() => session.reset()}>reset</button>
    </div>
  )
}

describe('ReadingSessionContext', () => {
  it('starts at the intention step with no question and no drawn card', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('step: intention')).toBeInTheDocument()
    expect(screen.getByText('question: none')).toBeInTheDocument()
    expect(screen.getByText('drawnCard: none')).toBeInTheDocument()
  })

  it('walks through the full step sequence and produces a valid drawn card', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )

    act(() => screen.getByText('setQuestion').click())
    expect(screen.getByText('question: 我该如何前进？')).toBeInTheDocument()

    act(() => screen.getByText('beginShuffle').click())
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()

    act(() => screen.getByText('finishShuffle').click())
    expect(screen.getByText('step: selecting')).toBeInTheDocument()

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('step: revealing')).toBeInTheDocument()
    expect(
      screen.getByText(/drawnCard: (major|wands|cups|swords|pentacles)_\d{2}/),
    ).toBeInTheDocument()

    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: result')).toBeInTheDocument()
  })

  it('reset returns to intention and clears question and drawn card', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )

    act(() => screen.getByText('setQuestion').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())
    act(() => screen.getByText('selectCard').click())
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: result')).toBeInTheDocument()

    act(() => screen.getByText('reset').click())
    expect(screen.getByText('step: intention')).toBeInTheDocument()
    expect(screen.getByText('question: none')).toBeInTheDocument()
    expect(screen.getByText('drawnCard: none')).toBeInTheDocument()
  })

  it('defaults activeSpread to null, unchanged from the scaffold stub', () => {
    function ActiveSpreadProbe() {
      const { activeSpread } = useReadingSession()
      return <span>activeSpread: {activeSpread ?? 'none'}</span>
    }
    render(
      <ReadingSessionProvider>
        <ActiveSpreadProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
  })

  it('can draw a Minor Arcana card from the combined 78-card pool', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(22.5 / 78) // index 22 = first Minor Arcana entry (wands_01)
    randomSpy.mockReturnValueOnce(0.1) // upright

    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())
    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_01')).toBeInTheDocument()

    randomSpy.mockRestore()
  })
})
