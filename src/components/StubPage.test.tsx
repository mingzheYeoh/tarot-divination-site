import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StubPage from './StubPage'

describe('StubPage', () => {
  it('renders the given message', () => {
    render(<StubPage message="首页正在筹备中……" />)
    expect(screen.getByText('首页正在筹备中……')).toBeInTheDocument()
  })
})
