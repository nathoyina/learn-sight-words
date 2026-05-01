import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { vocabulary } from '../data/vocabulary'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'
import { sample, shuffle } from '../lib/shuffle'

const rounds = 5

function makeQuestion() {
  const answer = vocabulary[Math.floor(Math.random() * vocabulary.length)]
  const distractors = sample(vocabulary.filter((v) => v.word !== answer.word), 3)
  const options = shuffle([answer.word, ...distractors.map((v) => v.word)])
  return { answer, options }
}

export function L4PictureMatch() {
  const { awardStars, addSticker } = useProgress()
  const [q, setQ] = useState(makeQuestion)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const choose = (word: string) => {
    const next = correct + (word === q.answer.word ? 1 : 0)
    if (round >= rounds) {
      const stars = toStars(next, rounds)
      awardStars('l4-picture-match', stars)
      if (stars >= 2) addSticker('🖼️')
      setCorrect(next)
      setDone(true)
      return
    }
    setCorrect(next)
    setRound((v) => v + 1)
    setQ(makeQuestion())
  }

  return (
    <PageShell title="Level 4 - Picture Match" levelTint={4}>
      <MascotHintRow guide="fox" message="Which word matches the picture? Tap your best guess." />
      {!done ? (
        <>
          <p className="text-7xl">{q.answer.emoji}</p>
          <p className="mb-3 text-lg">Round {round}/{rounds}</p>
          <div className="grid gap-2 md:grid-cols-2">
            {q.options.map((opt) => (
              <button key={opt} className="rounded-xl bg-white p-4 text-2xl shadow" onClick={() => choose(opt)}>{opt}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl">Nice! You scored {correct}/{rounds}</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
