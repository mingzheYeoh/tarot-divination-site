import { createContext, useContext, useState, type ReactNode } from 'react'
import { drawCard, type DrawnCard, type CardStructure, type CardContent } from '../lib/drawCard'
import cardsStructure from '../data/cards-major.json'
import cardsContent from '../data/cards-major.zh.json'

type SpreadType = 'single' | 'three-card' | 'celtic-cross' | null

export type RitualStep = 'intention' | 'shuffling' | 'selecting' | 'revealing' | 'result'

interface ReadingSessionValue {
  activeSpread: SpreadType
  step: RitualStep
  question: string
  drawnCard: DrawnCard | null
  setQuestion: (question: string) => void
  beginShuffle: () => void
  finishShuffle: () => void
  selectCard: () => void
  finishReveal: () => void
  reset: () => void
}

const noop = () => {}

const ReadingSessionContext = createContext<ReadingSessionValue>({
  activeSpread: null,
  step: 'intention',
  question: '',
  drawnCard: null,
  setQuestion: noop,
  beginShuffle: noop,
  finishShuffle: noop,
  selectCard: noop,
  finishReveal: noop,
  reset: noop,
})

export function ReadingSessionProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<RitualStep>('intention')
  const [question, setQuestionState] = useState('')
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null)

  const value: ReadingSessionValue = {
    activeSpread: null,
    step,
    question,
    drawnCard,
    setQuestion: (nextQuestion: string) => setQuestionState(nextQuestion),
    beginShuffle: () => setStep('shuffling'),
    finishShuffle: () => setStep('selecting'),
    selectCard: () => {
      const card = drawCard(
        cardsStructure as unknown as CardStructure[],
        cardsContent as unknown as Record<string, CardContent>,
      )
      setDrawnCard(card)
      setStep('revealing')
    },
    finishReveal: () => setStep('result'),
    reset: () => {
      setStep('intention')
      setQuestionState('')
      setDrawnCard(null)
    },
  }

  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>
}

export function useReadingSession() {
  return useContext(ReadingSessionContext)
}
