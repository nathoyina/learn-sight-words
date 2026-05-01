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
const FEEDBACK_DELAY_MS = 1600

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
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrectPick, setIsCorrectPick] = useState<boolean | null>(null)

  const choose = (word: string) => {
    if (selected !== null) return
    const isCorrect = word === q.rhyme
    setSelected(word)
    setIsCorrectPick(isCorrect)
    const next = correct + (word === q.rhyme ? 1 : 0)
    window.setTimeout(() => {
      if (round >= rounds) {
        const stars = toStars(next, rounds)
        awardStars('l3-rhyme-match', stars)
        if (stars >= 2) addSticker('🎵')
        setCorrect(next)
        setDone(true)
        setSelected(null)
        setIsCorrectPick(null)
        return
      }
      setCorrect(next)
      setRound((v) => v + 1)
      setQ(getQuestion())
      setSelected(null)
      setIsCorrectPick(null)
    }, FEEDBACK_DELAY_MS)
  }

  return (
    <PageShell title="Level 3 - Rhyme Match" levelTint={3}>
      <MascotHintRow guide="owl" message="Two words rhyme when they sound alike at the end. Tap the rhyming word!" />
      {!done ? (
        <>
          <p className="mb-3 text-xl">Which word rhymes with <strong>{q.word}</strong>?</p>
          {selected !== null ? (
            <p className={`mb-3 text-lg font-semibold ${isCorrectPick ? 'text-green-700' : 'text-amber-700'}`}>
              {isCorrectPick ? 'Great job!' : `Not quite. Correct answer: ${q.rhyme}`}
            </p>
          ) : null}
          <div className="grid gap-2 md:grid-cols-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                className={`rounded-xl p-4 text-2xl shadow ${
                  selected === null
                    ? 'bg-white'
                    : opt === q.rhyme
                      ? 'bg-green-200'
                      : opt === selected
                        ? 'bg-rose-200'
                        : 'bg-white'
                }`}
                disabled={selected !== null}
                onClick={() => choose(opt)}
              >
                {opt}
              </button>
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
