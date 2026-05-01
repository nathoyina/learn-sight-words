import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { themes, vocabulary } from '../data/vocabulary'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'

const rounds = 5

function makeQuestion() {
  return vocabulary[Math.floor(Math.random() * vocabulary.length)]
}

export function L4ThemeSort() {
  const { awardStars, addSticker } = useProgress()
  const [item, setItem] = useState(makeQuestion)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const choose = (theme: string) => {
    const next = correct + (theme === item.theme ? 1 : 0)
    if (round >= rounds) {
      const stars = toStars(next, rounds)
      awardStars('l4-theme-sort', stars)
      if (stars >= 2) addSticker('🗂️')
      setCorrect(next)
      setDone(true)
      return
    }
    setCorrect(next)
    setRound((v) => v + 1)
    setItem(makeQuestion())
  }

  return (
    <PageShell title="Level 4 - Theme Sort" levelTint={4}>
      <MascotHintRow guide="owl" message="Tap the group each word belongs to — animals, food, school, and more!" />
      {!done ? (
        <>
          <p className="text-6xl">{item.emoji}</p>
          <p className="mb-2 text-2xl font-semibold">{item.word}</p>
          <p className="mb-3">Round {round}/{rounds}</p>
          <div className="grid gap-2 md:grid-cols-3">
            {themes.map((theme) => (
              <button key={theme} className="rounded-xl bg-white p-3 text-xl shadow" onClick={() => choose(theme)}>{theme}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl">You scored {correct}/{rounds}</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
