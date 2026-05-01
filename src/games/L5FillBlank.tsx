import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { fillBlankItems } from '../data/sentences'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'
import { shuffle } from '../lib/shuffle'

const rounds = 5

function makeQuestion() {
  const item = fillBlankItems[Math.floor(Math.random() * fillBlankItems.length)]
  return { ...item, options: shuffle([...(item.options ?? [])]) }
}

export function L5FillBlank() {
  const { awardStars, addSticker } = useProgress()
  const [item, setItem] = useState(makeQuestion)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const choose = (option: string) => {
    const next = correct + (option === item.missing ? 1 : 0)
    if (round >= rounds) {
      const stars = toStars(next, rounds)
      awardStars('l5-fill-blank', stars)
      if (stars >= 2) addSticker('📖')
      setCorrect(next)
      setDone(true)
      return
    }
    setCorrect(next)
    setRound((v) => v + 1)
    setItem(makeQuestion())
  }

  return (
    <PageShell title="Level 5 - Fill the Blank" levelTint={5}>
      <MascotHintRow guide="owl" message="Read the sentence, then tap the word that fits the blank." />
      {!done ? (
        <>
          <p className="text-6xl">{item.emoji}</p>
          <p className="mb-3 text-2xl">{item.sentence}</p>
          <div className="grid gap-2 md:grid-cols-3">
            {item.options?.map((option) => (
              <button key={option} className="rounded-xl bg-white p-3 text-xl shadow" onClick={() => choose(option)}>{option}</button>
            ))}
          </div>
          <p className="mt-4">Round {round}/{rounds}</p>
        </>
      ) : (
        <>
          <p className="text-2xl">You got {correct}/{rounds}</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
