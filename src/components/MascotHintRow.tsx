import type { GuideKind } from './GuideCharacter'
import { GuideCharacter } from './GuideCharacter'
import { SpeechBubble } from './SpeechBubble'

export function MascotHintRow({
  guide = 'owl',
  message,
  bounce = false,
}: {
  guide?: GuideKind
  message: string
  bounce?: boolean
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <GuideCharacter kind={guide} bounce={bounce} />
      <SpeechBubble className="flex-1">{message}</SpeechBubble>
    </div>
  )
}
