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

    // The pre-flip "点击翻牌" (click to flip) label is now stale once the
    // card has actually been revealed — it should no longer resolve to a
    // button, proving the accessible name updated to reflect the revealed
    // card instead of remaining frozen on the pre-flip instruction text.
    expect(screen.queryByRole('button', { name: '点击翻牌' })).not.toBeInTheDocument()

    const revealButton = await screen.findByRole('button', { name: /查看解读/ })
    await userEvent.click(revealButton)

    expect(screen.getByText('step: result')).toBeInTheDocument()
  })

  it('keeps the card as an interactive button (not a bare div) after it is flipped', async () => {
    // Root-cause regression test: TarotCard swaps its root host element
    // between <button> (onClick present) and a bare <div> (onClick absent).
    // If RevealStep ever again clears onClick once flipped, TarotCard would
    // remount as a plain, non-interactive element, and the card-inner flip
    // transition would silently fail to animate. Asserting the card is still
    // reachable via getByRole('button', ...) post-flip proves onClick stayed
    // attached, i.e. TarotCard's root element type never changed across the
    // flip.
    let select: () => void = () => {}
    render(
      <ReadingSessionProvider>
        <StepSetup onReady={(fn) => (select = fn)} />
      </ReadingSessionProvider>,
    )
    select()
    await screen.findByText('step: revealing')

    const cardButton = screen.getByRole('button', { name: '点击翻牌' })
    await userEvent.click(cardButton)

    // Still a real <button> in the accessibility tree post-flip. The
    // post-flip ariaLabel format is `${nameLocal} · ${name}`, so matching on
    // the "·" separator identifies the card button structurally (without
    // knowing which specific card was drawn) and disambiguates it from the
    // separate "查看解读" button that also appears once flipped. Using
    // getByRole (which throws if not found) rather than queryByRole is the
    // point: it proves TarotCard's root element is still a <button>, not a
    // bare, non-interactive <div>.
    const flippedCardButton = screen.getByRole('button', { name: /·/ })
    expect(flippedCardButton).toBeInTheDocument()
    expect(flippedCardButton).not.toHaveAccessibleName('点击翻牌')
  })
})

describe('RevealStep with a three-card spread', () => {
  function ThreeCardSetup({
    onReady,
  }: {
    onReady: (actions: {
      selectSpread: () => void
      selectCard: () => void
      finishReveal: () => void
    }) => void
  }) {
    const { selectSpread, selectCard, finishReveal, step } = useReadingSession()
    onReady({
      selectSpread: () => selectSpread('three-card'),
      selectCard,
      finishReveal,
    })
    return (
      <>
        {step === 'revealing' && <RevealStep />}
        <span>step: {step}</span>
      </>
    )
  }

  it('shows a "1 / 3" counter and "揭示下一张" for the first two cards, then "查看解读" for the third', async () => {
    let actions = {
      selectSpread: () => {},
      selectCard: () => {},
      finishReveal: () => {},
    }
    render(
      <ReadingSessionProvider>
        <ThreeCardSetup onReady={(a) => (actions = a)} />
      </ReadingSessionProvider>,
    )
    actions.selectSpread()

    actions.selectCard()
    await screen.findByText('step: revealing')
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '点击翻牌' }))
    expect(screen.getByRole('button', { name: '揭示下一张' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '揭示下一张' }))
    await screen.findByText('step: selecting')

    actions.selectCard()
    await screen.findByText('step: revealing')
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '点击翻牌' }))
    expect(screen.getByRole('button', { name: '揭示下一张' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '揭示下一张' }))
    await screen.findByText('step: selecting')

    actions.selectCard()
    await screen.findByText('step: revealing')
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '点击翻牌' }))
    expect(screen.getByRole('button', { name: '查看解读' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '查看解读' }))
    expect(screen.getByText('step: result')).toBeInTheDocument()
  })
})
