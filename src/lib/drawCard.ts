export interface CardStructure {
  id: string
  name: string
  number: number
  arcana: string
  suit: string | null
  element: string | null
  image: string
}

export interface CardContent {
  name_local: string
  keywords: string[]
  upright_meaning: string
  upright_advice: string
  reversed_meaning: string
  reversed_advice: string
}

export type Orientation = 'upright' | 'reversed'

export interface DrawnCard {
  id: string
  name: string
  nameLocal: string
  image: string
  orientation: Orientation
  keywords: string[]
  meaning: string
  advice: string
}

export function drawCard(
  structure: CardStructure[],
  content: Record<string, CardContent>,
): DrawnCard {
  const index = Math.floor(Math.random() * structure.length)
  const picked = structure[index]
  const orientation: Orientation = Math.random() < 0.5 ? 'upright' : 'reversed'
  const localized = content[picked.id]

  return {
    id: picked.id,
    name: picked.name,
    nameLocal: localized.name_local,
    image: picked.image,
    orientation,
    keywords: localized.keywords,
    meaning: orientation === 'upright' ? localized.upright_meaning : localized.reversed_meaning,
    advice: orientation === 'upright' ? localized.upright_advice : localized.reversed_advice,
  }
}
