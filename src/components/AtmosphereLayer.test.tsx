import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import AtmosphereLayer from './AtmosphereLayer'

describe('AtmosphereLayer', () => {
  it('renders the audio toggle in its default muted state', () => {
    render(<AtmosphereLayer />)
    const toggle = screen.getByRole('button', { name: '氛围音乐' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveTextContent('brightness_3')
  })

  it('switches to playing state on click', async () => {
    render(<AtmosphereLayer />)
    const toggle = screen.getByRole('button', { name: '氛围音乐' })
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(toggle).toHaveTextContent('volume_up')
  })
})
