import { describe, it, expect, vi, afterEach } from 'vitest'
import { drawCard, type DrawnCard } from './drawCard'

const structure = [
  {
    id: 'major_00',
    name: 'The Fool',
    number: 0,
    arcana: 'major',
    suit: null,
    element: null,
    image: '/assets/tarot/maj00.jpg',
  },
  {
    id: 'major_01',
    name: 'The Magician',
    number: 1,
    arcana: 'major',
    suit: null,
    element: null,
    image: '/assets/tarot/maj01.jpg',
  },
]

const content = {
  major_00: {
    name_local: '愚人',
    keywords: ['新的开始', '冒险', '天真信任'],
    upright_meaning: 'UPRIGHT_FOOL_MEANING',
    upright_advice: 'UPRIGHT_FOOL_ADVICE',
    reversed_meaning: 'REVERSED_FOOL_MEANING',
    reversed_advice: 'REVERSED_FOOL_ADVICE',
  },
  major_01: {
    name_local: '魔术师',
    keywords: ['创造力', '意志力', '资源整合'],
    upright_meaning: 'UPRIGHT_MAGICIAN_MEANING',
    upright_advice: 'UPRIGHT_MAGICIAN_ADVICE',
    reversed_meaning: 'REVERSED_MAGICIAN_MEANING',
    reversed_advice: 'REVERSED_MAGICIAN_ADVICE',
  },
}

describe('drawCard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('picks the first structure entry and upright content when Math.random returns low values', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // card index selection -> index 0
      .mockReturnValueOnce(0) // orientation roll -> upright

    const result: DrawnCard = drawCard(structure, content)

    expect(result.id).toBe('major_00')
    expect(result.name).toBe('The Fool')
    expect(result.nameLocal).toBe('愚人')
    expect(result.image).toBe('/assets/tarot/maj00.jpg')
    expect(result.orientation).toBe('upright')
    expect(result.keywords).toEqual(['新的开始', '冒险', '天真信任'])
    expect(result.meaning).toBe('UPRIGHT_FOOL_MEANING')
    expect(result.advice).toBe('UPRIGHT_FOOL_ADVICE')
  })

  it('picks the last structure entry and reversed content when Math.random returns high values', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.999) // card index selection -> last index
      .mockReturnValueOnce(0.999) // orientation roll -> reversed

    const result: DrawnCard = drawCard(structure, content)

    expect(result.id).toBe('major_01')
    expect(result.orientation).toBe('reversed')
    expect(result.meaning).toBe('REVERSED_MAGICIAN_MEANING')
    expect(result.advice).toBe('REVERSED_MAGICIAN_ADVICE')
  })

  it('always returns an id present in the structure array, across many draws', () => {
    const validIds = new Set(structure.map((c) => c.id))
    for (let i = 0; i < 50; i++) {
      const result = drawCard(structure, content)
      expect(validIds.has(result.id)).toBe(true)
      expect(['upright', 'reversed']).toContain(result.orientation)
    }
  })
})
