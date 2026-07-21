import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import ResultStep from './ResultStep'

// There is no exposed setter for drawnCard (Task 3 deliberately keeps that
// internal to selectCard()), so this test drives the real state machine
// forward via visible buttons, the same proven pattern as
// ReadingSessionContext.test.tsx, rather than calling context setters
// during another component's render (which React does not support safely).
function Harness({ question }: { question: string }) {
  const session = useReadingSession()
  return (
    <div>
      <button onClick={() => session.setQuestion(question)}>setQuestion</button>
      <button onClick={() => session.beginShuffle()}>beginShuffle</button>
      <button onClick={() => session.finishShuffle()}>finishShuffle</button>
      <button onClick={() => session.selectCard()}>selectCard</button>
      <button onClick={() => session.finishReveal()}>finishReveal</button>
      {session.step === 'result' ? <ResultStep /> : null}
    </div>
  )
}

function renderAtResult(question: string) {
  render(
    <MemoryRouter>
      <ReadingSessionProvider>
        <Harness question={question} />
      </ReadingSessionProvider>
    </MemoryRouter>,
  )
  act(() => screen.getByText('setQuestion').click())
  act(() => screen.getByText('beginShuffle').click())
  act(() => screen.getByText('finishShuffle').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
}

describe('ResultStep', () => {
  it('renders the drawn card name, keywords, meaning, and advice', () => {
    renderAtResult('')
    // The actual drawn card is random (real drawCard()), so assert structural
    // presence rather than a specific card's text.
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('给你的建议')).toBeInTheDocument()
    expect(screen.getByText('牌意解读')).toBeInTheDocument()
  })

  it('references the question when one was given', () => {
    renderAtResult('我该如何前进？')
    expect(screen.getByText(/我该如何前进？/)).toBeInTheDocument()
  })

  it('does not reference a question when none was given', () => {
    renderAtResult('')
    expect(screen.queryByText(/关于「/)).not.toBeInTheDocument()
  })

  it('"保存此次占卜" links to /login', () => {
    renderAtResult('')
    expect(screen.getByRole('link', { name: '保存此次占卜' })).toHaveAttribute('href', '/login')
  })

  it('"再抽一张" resets the session back to intention', async () => {
    renderAtResult('')
    await userEvent.click(screen.getByRole('button', { name: /再抽一张/ }))
    expect(screen.queryByText('给你的建议')).not.toBeInTheDocument()
  })

  it('shows a suit-based caption for a Minor Arcana result', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(22.5 / 78) // index 22 = wands_01 (Ace of Wands)
    randomSpy.mockReturnValueOnce(0.1) // upright
    renderAtResult('')
    expect(screen.getByText('WANDS · ACE')).toBeInTheDocument()
    randomSpy.mockRestore()
  })

  it('still shows the Roman-numeral caption for a Major Arcana result', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(7.5 / 78) // index 7 = major_07 (The Chariot)
    randomSpy.mockReturnValueOnce(0.1) // upright
    renderAtResult('')
    expect(screen.getByText('MAJOR ARCANA VII')).toBeInTheDocument()
    randomSpy.mockRestore()
  })
})
