import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import IntentionStep from './IntentionStep'

function StepProbe() {
  const { step, question } = useReadingSession()
  return (
    <>
      <IntentionStep />
      <span>step: {step}</span>
      <span>question: {question || 'none'}</span>
    </>
  )
}

describe('IntentionStep', () => {
  it('renders the ritual heading and the optional question input', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入你想问的问题(可选)')).toBeInTheDocument()
  })

  it('stores the typed question and advances to shuffling on submit', async () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    const input = screen.getByPlaceholderText('输入你想问的问题(可选)')
    await userEvent.type(input, '我该如何前进？')
    await userEvent.click(screen.getByRole('button', { name: /开始洗牌/ }))

    expect(screen.getByText('question: 我该如何前进？')).toBeInTheDocument()
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()
  })

  it('advances to shuffling even with no question typed', async () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: /开始洗牌/ }))
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()
    expect(screen.getByText('question: none')).toBeInTheDocument()
  })
})
