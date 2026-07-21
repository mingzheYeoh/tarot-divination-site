import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReadingSessionProvider } from '../context/ReadingSessionContext'
import DrawPage from './DrawPage'

function renderDrawPage() {
  render(
    <MemoryRouter>
      <ReadingSessionProvider>
        <DrawPage />
      </ReadingSessionProvider>
    </MemoryRouter>,
  )
}

describe('DrawPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at the spread-select step', () => {
    renderDrawPage()
    expect(screen.getByText('选择你的牌阵')).toBeInTheDocument()
  })

  it('walks the full single-card ritual through to a result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDrawPage()

    await user.click(screen.getByText('单张指引'))
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /开始洗牌/ }))
    expect(screen.getByText('命运正在交织...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()

    const fanCards = screen.getAllByRole('button', { name: /选这张牌/ })
    await user.click(fanCards[0])

    const cardButton = screen.getByRole('button', { name: '点击翻牌' })
    await user.click(cardButton)
    const revealButton = await screen.findByRole('button', { name: /查看解读/ })
    await user.click(revealButton)

    expect(screen.getByText('给你的建议')).toBeInTheDocument()
  })

  it('walks the full three-card ritual through to a position-labeled result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDrawPage()

    await user.click(screen.getByText('三牌阵 · 过去现在未来'))
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /开始洗牌/ }))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()

    for (let position = 0; position < 3; position++) {
      const fanCards = screen.getAllByRole('button', { name: /选这张牌/ })
      await user.click(fanCards[0])

      const cardButton = screen.getByRole('button', { name: '点击翻牌' })
      await user.click(cardButton)

      const isLast = position === 2
      const nextButton = await screen.findByRole('button', {
        name: isLast ? '查看解读' : '揭示下一张',
      })
      await user.click(nextButton)

      if (!isLast) {
        expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()
      }
    }

    expect(screen.getByText('整体指引')).toBeInTheDocument()
  })
})
