import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import TarotCard from './TarotCard'
import type { DrawnCard } from '../../lib/drawCard'

const sampleCard: DrawnCard = {
  id: 'major_17',
  name: 'The Star',
  nameLocal: '星星',
  image: '/assets/tarot/maj17.jpg',
  orientation: 'upright',
  keywords: ['希望', '疗愈', '信念'],
  meaning: 'MEANING',
  advice: 'ADVICE',
}

describe('TarotCard', () => {
  it('renders only the back face when flipped is false, even with a card prop', () => {
    render(<TarotCard card={sampleCard} flipped={false} />)
    expect(screen.queryByRole('img', { name: 'The Star' })).not.toBeInTheDocument()
  })

  it('renders the card image and name when flipped is true', () => {
    render(<TarotCard card={sampleCard} flipped />)
    const image = screen.getByRole('img', { name: 'The Star' })
    expect(image).toHaveAttribute('src', '/assets/tarot/maj17.jpg')
    expect(screen.getByText('星星')).toBeInTheDocument()
  })

  it('calls onClick when clicked, and exposes ariaLabel as the accessible name', async () => {
    let clicked = false
    render(<TarotCard flipped={false} onClick={() => (clicked = true)} ariaLabel="点击翻牌" />)
    const button = screen.getByRole('button', { name: '点击翻牌' })
    await userEvent.click(button)
    expect(clicked).toBe(true)
  })

  it('is not a button when no onClick is given (result-page static display)', () => {
    render(<TarotCard card={sampleCard} flipped />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
