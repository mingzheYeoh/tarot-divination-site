import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('renders the hero title, tagline, and CTA linking to /draw', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: '夜语塔罗' })).toBeInTheDocument()
    expect(screen.getByText(/在午夜时分，倾听命运的回响/)).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /开始占卜/ })
    expect(cta).toHaveAttribute('href', '/draw')
  })
})
