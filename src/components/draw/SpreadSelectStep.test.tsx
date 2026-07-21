import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import SpreadSelectStep from './SpreadSelectStep'

function StateProbe() {
  const { activeSpread, step } = useReadingSession()
  return (
    <span>
      activeSpread: {activeSpread ?? 'none'}, step: {step}
    </span>
  )
}

describe('SpreadSelectStep', () => {
  it('renders both spread options', () => {
    render(
      <ReadingSessionProvider>
        <SpreadSelectStep />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('单张指引')).toBeInTheDocument()
    expect(screen.getByText('三牌阵 · 过去现在未来')).toBeInTheDocument()
  })

  it('choosing 单张指引 sets activeSpread to single and advances to intention', async () => {
    render(
      <ReadingSessionProvider>
        <SpreadSelectStep />
        <StateProbe />
      </ReadingSessionProvider>,
    )
    await userEvent.click(screen.getByText('单张指引'))
    expect(screen.getByText('activeSpread: single, step: intention')).toBeInTheDocument()
  })

  it('choosing 三牌阵 sets activeSpread to three-card and advances to intention', async () => {
    render(
      <ReadingSessionProvider>
        <SpreadSelectStep />
        <StateProbe />
      </ReadingSessionProvider>,
    )
    await userEvent.click(screen.getByText('三牌阵 · 过去现在未来'))
    expect(screen.getByText('activeSpread: three-card, step: intention')).toBeInTheDocument()
  })
})
