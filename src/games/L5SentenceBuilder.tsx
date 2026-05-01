import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { sentenceBuilderItems } from '../data/sentences'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'

const rounds = 5

function makeQuestion() {
  return sentenceBuilderItems[Math.floor(Math.random() * sentenceBuilderItems.length)]
}

export function L5SentenceBuilder() {
  const { awardStars, addSticker } = useProgress()
  const [item, setItem] = useState(makeQuestion)
  const [round, setRound] = useState(1)
  const [chosen, setChosen] = useState<string[]>([])
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const submit = () => {
    const guess = chosen.join(' ')
    const next = correct + (guess === item.sentence ? 1 : 0)
    if (round >= rounds) {
      const stars = toStars(next, rounds)
      awardStars('l5-sentence-builder', stars)
      if (stars >= 2) addSticker('📝')
      setCorrect(next)
      setDone(true)
      return
    }
    setCorrect(next)
    setRound((v) => v + 1)
    setChosen([])
    setItem(makeQuestion())
  }

  return (
    <PageShell title="Level 5 - Sentence Builder" levelTint={5}>
      <MascotHintRow guide="fox" message="Tap the words in the right order to match the picture. Clear starts over!" />
      {!done ? (
        <>
          <p className="text-6xl">{item.emoji}</p>
          <p className="mb-2">Tap words in order to build a sentence.</p>
          <div className="mb-3 rounded-xl bg-white p-4 text-xl shadow min-h-16">{chosen.join(' ') || 'Your sentence...'}</div>
          <div className="grid gap-2 md:grid-cols-2">
            {item.words.map((word) => (
              <button key={word} className="rounded-xl bg-purple-100 p-3 text-xl" onClick={() => setChosen((prev) => [...prev, word])}>{word}</button>
            ))}
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <BigButton label="Clear" className="bg-slate-400 hover:bg-slate-500" onClick={() => setChosen([])} />
            <BigButton label="Check Sentence" onClick={submit} />
          </div>
          <p className="mt-3">Round {round}/{rounds}</p>
        </>
      ) : (
        <>
          <p className="text-2xl">Final score: {correct}/{rounds}</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
