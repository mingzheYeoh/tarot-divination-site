import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Nav from './Nav'

describe('Nav', () => {
  it('renders the wordmark and all four nav links', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('MIDNIGHT ORACLE')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '抽牌占卜' })).toHaveAttribute('href', '/draw')
    expect(screen.getByRole('link', { name: '牌意图鉴' })).toHaveAttribute('href', '/encyclopedia')
    expect(screen.getByRole('link', { name: '关于' })).toHaveAttribute('href', '/about')
  })

  it('marks the current route as active', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: '关于' }).className).toContain('text-primary')
    expect(screen.getByRole('link', { name: '首页' }).className).toContain(
      'text-on-surface-variant',
    )
  })
})
