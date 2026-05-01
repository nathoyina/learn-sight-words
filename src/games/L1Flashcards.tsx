import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { Confetti } from '../components/Confetti'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { sightWords } from '../data/sightWords'
import { useProgress } from '../lib/useProgress'
import { speak } from '../lib/speech'

export function L1Flashcards() {
  const { addSticker } = useProgress()
  const [index, setIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const word = sightWords[index]

  const next = () => {
    const nextIndex = index + 1
    if (nextIndex >= 10) {
      addSticker('🃏')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 900)
      setIndex(0)
      return
    }
    setIndex(nextIndex)
  }

  return (
    <PageShell title="Level 1 - Sight Word Flashcards" levelTint={1}>
      <MascotHintRow guide="owl" message="Tap the big card to hear each sight word. Swipe through ten cards!" />
      <Confetti show={showConfetti} />
      <p className="mb-4 text-slate-700">Tap the card to hear the word. Complete 10 cards to earn a sticker.</p>
      <button
        type="button"
        onClick={() => speak(word)}
        className="mb-4 w-full rounded-3xl bg-orange-200 p-12 text-6xl font-bold text-slate-800"
      >
        {word}
      </button>
      <p className="mb-4 text-lg">Card {index + 1} / 10</p>
      <div className="grid gap-3 md:grid-cols-2">
        <BigButton label="Hear Word" onClick={() => speak(word)} />
        <BigButton label="Next Card" className="bg-pink-400 hover:bg-pink-500" onClick={next} />
      </div>
      <Link to="/map" className="mt-4 inline-block text-blue-600 underline">
        Back to Level Map
      </Link>
    </PageShell>
  )
}
