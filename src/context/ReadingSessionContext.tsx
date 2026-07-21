import { createContext, useContext, useState, type ReactNode } from 'react'
import { drawCard, type DrawnCard, type CardStructure, type CardContent } from '../lib/drawCard'
import majorStructure from '../data/cards-major.json'
import majorContent from '../data/cards-major.zh.json'
import minorStructure from '../data/cards-minor.json'
import minorContent from '../data/cards-minor.zh.json'

const allStructure = [...majorStructure, ...minorStructure] as unknown as CardStructure[]
const allContent = {
  ...majorContent,
  ...minorContent,
} as unknown as Record<string, CardContent>

export type SpreadType = 'single' | 'three-card' | 'celtic-cross' | null

export type RitualStep =
  'spread-select' | 'intention' | 'shuffling' | 'selecting' | 'revealing' | 'result'

interface ReadingSessionValue {
  activeSpread: SpreadType
  step: RitualStep
  question: string
  drawnCard: DrawnCard | null
  drawnCards: DrawnCard[]
  setQuestion: (question: string) => void
  selectSpread: (spread: 'single' | 'three-card') => void
  beginShuffle: () => void
  finishShuffle: () => void
  selectCard: () => void
  finishReveal: () => void
  reset: () => void
}

const noop = () => {}

const ReadingSessionContext = createContext<ReadingSessionValue>({
  activeSpread: null,
  step: 'spread-select',
  question: '',
  drawnCard: null,
  drawnCards: [],
  setQuestion: noop,
  selectSpread: noop,
  beginShuffle: noop,
  finishShuffle: noop,
  selectCard: noop,
  finishReveal: noop,
  reset: noop,
})

export function ReadingSessionProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<RitualStep>('spread-select')
  const [activeSpread, setActiveSpread] = useState<SpreadType>(null)
  const [question, setQuestionState] = useState('')
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null)
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])

  const value: ReadingSessionValue = {
    activeSpread,
    step,
    question,
    drawnCard,
    drawnCards,
    setQuestion: (nextQuestion: string) => setQuestionState(nextQuestion),
    selectSpread: (spread) => {
      setActiveSpread(spread)
      setStep('intention')
    },
    beginShuffle: () => setStep('shuffling'),
    finishShuffle: () => setStep('selecting'),
    selectCard: () => {
      const excludedIds = new Set(drawnCards.map((c) => c.id))
      let card = drawCard(allStructure, allContent)
      while (excludedIds.has(card.id)) {
        card = drawCard(allStructure, allContent)
      }
      setDrawnCard(card)
      setDrawnCards((prev) => [...prev, card])
      setStep('revealing')
    },
    finishReveal: () => {
      const totalPositions = activeSpread === 'three-card' ? 3 : 1
      if (drawnCards.length < totalPositions) {
        setStep('selecting')
      } else {
        setStep('result')
      }
    },
    reset: () => {
      setStep('spread-select')
      setQuestionState('')
      setDrawnCard(null)
      setDrawnCards([])
      setActiveSpread(null)
    },
  }

  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>
}

export function useReadingSession() {
  return useContext(ReadingSessionContext)
}
