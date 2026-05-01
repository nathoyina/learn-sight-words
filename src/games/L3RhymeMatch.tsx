import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { rhymePairs } from '../data/wordFamilies'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'
import { sample, shuffle } from '../lib/shuffle'

const rounds = 5

function getQuestion() {
  const [word, rhyme] = rhymePairs[Math.floor(Math.random() * rhymePairs.length)]
  const options = shuffle([rhyme, ...sample(['dog', 'book', 'tree', 'pen'], 2), word]).slice(0, 4)
  return { word, rhyme, options }
}

export function L3RhymeMatch() {
  const { awardStars, addSticker } = useProgress()
  const [q, setQ] = useState(getQuestion)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const choose = (word: string) => {
    const next = correct + (word === q.rhyme ? 1 : 0)
    if (round >= rounds) {
      const stars = toStars(next, rounds)
      awardStars('l3-rhyme-match', stars)
      if (stars >= 2) addSticker('🎵')
      setCorrect(next)
      setDone(true)
      return
    }
    setCorrect(next)
    setRound((v) => v + 1)
    setQ(getQuestion())
  }

  return (
    <PageShell title="Level 3 - Rhyme Match" levelTint={3}>
      <MascotHintRow guide="owl" message="Two words rhyme when they sound alike at the end. Tap the rhyming word!" />
      {!done ? (
        <>
          <p className="mb-3 text-xl">Which word rhymes with <strong>{q.word}</strong>?</p>
          <div className="grid gap-2 md:grid-cols-2">
            {q.options.map((opt) => (
              <button key={opt} className="rounded-xl bg-white p-4 text-2xl shadow" onClick={() => choose(opt)}>{opt}</button>
            ))}
          </div>
          <p className="mt-4">Round {round}/{rounds}</p>
        </>
      ) : (
        <>
          <p className="text-2xl">You got {correct}/{rounds}!</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
