import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import ThreeCardResultStep from './ThreeCardResultStep'

function Harness({ question }: { question: string }) {
  const session = useReadingSession()
  return (
    <div>
      <button onClick={() => session.selectSpread('three-card')}>selectSpread</button>
      <button onClick={() => session.setQuestion(question)}>setQuestion</button>
      <button onClick={() => session.beginShuffle()}>beginShuffle</button>
      <button onClick={() => session.finishShuffle()}>finishShuffle</button>
      <button onClick={() => session.selectCard()}>selectCard</button>
      <button onClick={() => session.finishReveal()}>finishReveal</button>
      {session.step === 'result' ? <ThreeCardResultStep /> : null}
    </div>
  )
}

function renderAtResult(question: string) {
  render(
    <MemoryRouter>
      <ReadingSessionProvider>
        <Harness question={question} />
      </ReadingSessionProvider>
    </MemoryRouter>,
  )
  act(() => screen.getByText('selectSpread').click())
  act(() => screen.getByText('setQuestion').click())
  act(() => screen.getByText('beginShuffle').click())
  act(() => screen.getByText('finishShuffle').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
}

describe('ThreeCardResultStep', () => {
  it('renders all three positions labeled 过去/现在/未来 in order', () => {
    renderAtResult('')
    const labels = screen.getAllByText(/^(过去|现在|未来)$/)
    expect(labels.map((el) => el.textContent)).toEqual(['过去', '现在', '未来'])
  })

  it('renders three cards, each with real card art, and the synthesis panel', () => {
    renderAtResult('')
    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(screen.getByText('整体指引')).toBeInTheDocument()
  })

  it('shows a synthesis paragraph built from a deterministic three-card draw', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    // Card 1: major_00 (The Fool), upright -- keywords: 新的开始/冒险/天真信任
    randomSpy.mockReturnValueOnce(0.5 / 78).mockReturnValueOnce(0.1)
    // Card 2: major_01 (The Magician), upright -- keywords: 创造力/意志力/资源整合
    randomSpy.mockReturnValueOnce(1.5 / 78).mockReturnValueOnce(0.1)
    // Card 3: major_02 (The High Priestess), upright -- keywords: 直觉/潜意识/隐藏的智慧
    randomSpy.mockReturnValueOnce(2.5 / 78).mockReturnValueOnce(0.1)

    renderAtResult('')

    expect(
      screen.getByText('过去的新的开始，与现在的创造力交织，指向未来的直觉。'),
    ).toBeInTheDocument()

    randomSpy.mockRestore()
  })

  it('references the question when one was given', () => {
    renderAtResult('我该如何前进？')
    expect(screen.getByText(/我该如何前进？/)).toBeInTheDocument()
  })

  it('does not reference a question when none was given', () => {
    renderAtResult('')
    expect(screen.queryByText(/关于「/)).not.toBeInTheDocument()
  })

  it('"保存此次占卜" links to /login', () => {
    renderAtResult('')
    expect(screen.getByRole('link', { name: '保存此次占卜' })).toHaveAttribute('href', '/login')
  })

  it('"再抽一张" resets the session away from the result step', async () => {
    renderAtResult('')
    await userEvent.click(screen.getByRole('button', { name: /再抽一张/ }))
    expect(screen.queryByText('整体指引')).not.toBeInTheDocument()
  })
})
