import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import SelectStep from './SelectStep'

function StepProbe() {
  const { step, drawnCard } = useReadingSession()
  return (
    <>
      <SelectStep />
      <span>step: {step}</span>
      <span>drawnCard: {drawnCard ? drawnCard.id : 'none'}</span>
    </>
  )
}

describe('SelectStep', () => {
  it('renders the selection caption and exactly 15 face-down cards', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /选这张牌/ })).toHaveLength(15)
  })

  it('draws a card and advances to revealing when a fan card is clicked', async () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    const cards = screen.getAllByRole('button', { name: /选这张牌/ })
    await userEvent.click(cards[0])

    expect(screen.getByText('step: revealing')).toBeInTheDocument()
    expect(
      screen.getByText(/drawnCard: (major|wands|cups|swords|pentacles)_\d{2}/),
    ).toBeInTheDocument()
  })
})
