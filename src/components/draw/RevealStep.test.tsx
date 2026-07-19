import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import RevealStep from './RevealStep'

function StepSetup({ onReady }: { onReady: (selectCard: () => void) => void }) {
  const { selectCard, step } = useReadingSession()
  onReady(selectCard)
  return (
    <>
      {step === 'revealing' && <RevealStep />}
      <span>step: {step}</span>
    </>
  )
}

describe('RevealStep', () => {
  it('shows the card face-down with a "TOUCH TO REVEAL" cue, no "查看解读" button yet', async () => {
    let select: () => void = () => {}
    render(
      <ReadingSessionProvider>
        <StepSetup onReady={(fn) => (select = fn)} />
      </ReadingSessionProvider>,
    )
    // Trigger the card selection which moves to revealing step
    select()
    // Wait for the step text to update to 'revealing'
    await screen.findByText('step: revealing')

    expect(screen.queryByRole('button', { name: /查看解读/ })).not.toBeInTheDocument()
  })

  it('flips the card and reveals the "查看解读" button on click, then advances on that button click', async () => {
    let select: () => void = () => {}
    render(
      <ReadingSessionProvider>
        <StepSetup onReady={(fn) => (select = fn)} />
      </ReadingSessionProvider>,
    )
    select()
    // Wait for the step text to update to 'revealing'
    await screen.findByText('step: revealing')

    const cardButton = screen.getByRole('button', { name: '点击翻牌' })
    await userEvent.click(cardButton)

    const revealButton = await screen.findByRole('button', { name: /查看解读/ })
    await userEvent.click(revealButton)

    expect(screen.getByText('step: result')).toBeInTheDocument()
  })
})
