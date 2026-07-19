import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the wordmark, policy links, and copyright line', () => {
    render(<Footer />)
    expect(screen.getByText('Midnight Oracle')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '隐私政策' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '服务条款' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '联系我们' })).toBeInTheDocument()
    expect(screen.getByText(/愿星辰指引你的道路/)).toBeInTheDocument()
  })
})
