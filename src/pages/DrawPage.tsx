import { useReadingSession } from '../context/ReadingSessionContext'
import IntentionStep from '../components/draw/IntentionStep'
import ShuffleStep from '../components/draw/ShuffleStep'
import SelectStep from '../components/draw/SelectStep'
import RevealStep from '../components/draw/RevealStep'
import ResultStep from '../components/draw/ResultStep'

export default function DrawPage() {
  const { step } = useReadingSession()

  switch (step) {
    case 'intention':
      return <IntentionStep />
    case 'shuffling':
      return <ShuffleStep />
    case 'selecting':
      return <SelectStep />
    case 'revealing':
      return <RevealStep />
    case 'result':
      return <ResultStep />
    default:
      return null
  }
}
