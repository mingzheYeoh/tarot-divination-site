import { describe, it, expect } from 'vitest'
import majorStructure from './cards-major.json'
import majorContent from './cards-major.zh.json'
import minorStructure from './cards-minor.json'
import minorContent from './cards-minor.zh.json'

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
  const cards = majorStructure as unknown as CardStructure[]
  const localized = majorContent as unknown as Record<string, CardContent>

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

describe('Minor Arcana card data', () => {
  const cards = minorStructure as unknown as CardStructure[]
  const localized = minorContent as unknown as Record<string, CardContent>

  it('has exactly 56 structural entries across 4 suits', () => {
    expect(cards).toHaveLength(56)
    const suits = ['wands', 'cups', 'swords', 'pentacles']
    const ids = cards.map((c) => c.id).sort()
    const expected = suits
      .flatMap((suit) =>
        Array.from({ length: 14 }, (_, i) => `${suit}_${String(i + 1).padStart(2, '0')}`),
      )
      .sort()
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

  it('has correct suit/element pairing for every card', () => {
    const elementBySuit: Record<string, string> = {
      wands: 'fire',
      cups: 'water',
      swords: 'air',
      pentacles: 'earth',
    }
    for (const card of cards) {
      expect(card.arcana).toBe('minor')
      expect(card.suit).toBeTruthy()
      expect(card.element).toBe(elementBySuit[card.suit as string])
    }
  })
})

describe('Combined 78-card pool', () => {
  it('has 78 total entries with no duplicate ids across both arcana', () => {
    const allIds = [
      ...(majorStructure as unknown as CardStructure[]).map((c) => c.id),
      ...(minorStructure as unknown as CardStructure[]).map((c) => c.id),
    ]
    expect(allIds).toHaveLength(78)
    expect(new Set(allIds).size).toBe(78)
  })
})
