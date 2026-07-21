import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from './ReadingSessionContext'

function Probe() {
  const session = useReadingSession()
  return (
    <div>
      <span>step: {session.step}</span>
      <span>question: {session.question || 'none'}</span>
      <span>activeSpread: {session.activeSpread ?? 'none'}</span>
      <span>drawnCard: {session.drawnCard ? session.drawnCard.id : 'none'}</span>
      <span>drawnCards: {session.drawnCards.length}</span>
      <button onClick={() => session.setQuestion('我该如何前进？')}>setQuestion</button>
      <button onClick={() => session.selectSpread('single')}>selectSpread:single</button>
      <button onClick={() => session.selectSpread('three-card')}>selectSpread:three-card</button>
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
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
  })

  it('selectSpread sets activeSpread and advances to the intention step', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    expect(screen.getByText('activeSpread: three-card')).toBeInTheDocument()
    expect(screen.getByText('step: intention')).toBeInTheDocument()
  })

  it('reset also clears drawnCards and activeSpread', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())
    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCards: 1')).toBeInTheDocument()

    act(() => screen.getByText('reset').click())
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
    expect(screen.getByText('drawnCards: 0')).toBeInTheDocument()
  })

  it('a three-card spread draws three cards and only reaches result after the third reveal', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('step: revealing')).toBeInTheDocument()
    expect(screen.getByText('drawnCards: 1')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: selecting')).toBeInTheDocument()

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCards: 2')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: selecting')).toBeInTheDocument()

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCards: 3')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: result')).toBeInTheDocument()
  })

  it('never draws a duplicate card id across 200 repeated three-card readings', () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const { unmount } = render(
        <ReadingSessionProvider>
          <Probe />
        </ReadingSessionProvider>,
      )
      act(() => screen.getByText('selectSpread:three-card').click())
      act(() => screen.getByText('beginShuffle').click())
      act(() => screen.getByText('finishShuffle').click())

      const ids: string[] = []
      for (let position = 0; position < 3; position++) {
        act(() => screen.getByText('selectCard').click())
        const text = screen.getByText(/^drawnCard: /).textContent ?? ''
        ids.push(text.replace('drawnCard: ', ''))
        act(() => screen.getByText('finishReveal').click())
      }
      expect(new Set(ids).size).toBe(3)
      unmount()
    }
  })

  it('forces a same-index collision on the second draw and proves the retry loop skips the duplicate', () => {
    // drawCard() calls Math.random() twice per invocation (index, then
    // orientation) -- a REJECTED attempt still consumes both calls before
    // the retry loop tries again, so the mock sequence below has 8 values
    // for what ends up being 3 accepted cards (2 + 2 + 2 + 2, since the
    // second position's first attempt collides and is discarded).
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy
      .mockReturnValueOnce(22.5 / 78) // draw 1 index -> wands_01
      .mockReturnValueOnce(0.1) // draw 1 orientation -> upright
      .mockReturnValueOnce(22.5 / 78) // draw 2 attempt 1 index -> wands_01 (collision, rejected)
      .mockReturnValueOnce(0.1) // draw 2 attempt 1 orientation (discarded along with the rejected card)
      .mockReturnValueOnce(23.5 / 78) // draw 2 attempt 2 (retry) index -> wands_02
      .mockReturnValueOnce(0.1) // draw 2 attempt 2 orientation -> upright
      .mockReturnValueOnce(24.5 / 78) // draw 3 index -> wands_03
      .mockReturnValueOnce(0.1) // draw 3 orientation -> upright

    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_01')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_02')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_03')).toBeInTheDocument()

    randomSpy.mockRestore()
  })
})
