import { describe, it, expect } from 'vitest'
import structure from './cards-major.json'
import content from './cards-major.zh.json'

interface CardStructure {
  id: string
  name: string
  number: number
  arcana: string
  suit: string | null
  element: string | null
  image: string
}

interface CardContent {
  name_local: string
  keywords: string[]
  upright_meaning: string
  upright_advice: string
  reversed_meaning: string
  reversed_advice: string
}

describe('Major Arcana card data', () => {
  const cards = structure as unknown as CardStructure[]
  const localized = content as unknown as Record<string, CardContent>

  it('has exactly 22 structural entries numbered 0-21', () => {
    expect(cards).toHaveLength(22)
    const ids = cards.map((c) => c.id).sort()
    const expected = Array.from(
      { length: 22 },
      (_, i) => `major_${String(i).padStart(2, '0')}`,
    ).sort()
    expect(ids).toEqual(expected)
  })

  it('has matching Chinese content for every structural entry', () => {
    for (const card of cards) {
      const entry = localized[card.id]
      expect(entry, `missing content for ${card.id}`).toBeDefined()
      expect(entry.name_local).toBeTruthy()
      expect(entry.keywords).toHaveLength(3)
      expect(entry.upright_meaning).toBeTruthy()
      expect(entry.upright_advice).toBeTruthy()
      expect(entry.reversed_meaning).toBeTruthy()
      expect(entry.reversed_advice).toBeTruthy()
    }
  })
})
