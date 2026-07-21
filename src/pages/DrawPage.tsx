import { useReadingSession } from '../context/ReadingSessionContext'
import SpreadSelectStep from '../components/draw/SpreadSelectStep'
import IntentionStep from '../components/draw/IntentionStep'
import ShuffleStep from '../components/draw/ShuffleStep'
import SelectStep from '../components/draw/SelectStep'
import RevealStep from '../components/draw/RevealStep'
import ResultStep from '../components/draw/ResultStep'
import ThreeCardResultStep from '../components/draw/ThreeCardResultStep'

export default function DrawPage() {
  const { step, activeSpread } = useReadingSession()

  switch (step) {
    case 'spread-select':
      return <SpreadSelectStep />
    case 'intention':
      return <IntentionStep />
    case 'shuffling':
      return <ShuffleStep />
    case 'selecting':
      return <SelectStep />
    case 'revealing':
      return <RevealStep />
    case 'result':
      return activeSpread === 'three-card' ? <ThreeCardResultStep /> : <ResultStep />
    default:
      return null
  }
}
