import { createContext, useContext, useState, type ReactNode } from 'react'

type SpreadType = 'single' | 'three-card' | 'celtic-cross' | null

interface ReadingSessionValue {
  activeSpread: SpreadType
}

const ReadingSessionContext = createContext<ReadingSessionValue>({
  activeSpread: null,
})

export function ReadingSessionProvider({ children }: { children: ReactNode }) {
  const [value] = useState<ReadingSessionValue>({ activeSpread: null })
  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>
}

export function useReadingSession() {
  return useContext(ReadingSessionContext)
}
