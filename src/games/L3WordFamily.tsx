import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { wordFamilies } from '../data/wordFamilies'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'
import { sample, shuffle } from '../lib/shuffle'
import { speak } from '../lib/speech'

const rounds = 5
const families = Object.entries(wordFamilies)

function question() {
  const [family, words] = families[Math.floor(Math.random() * families.length)]
  const answer = words[Math.floor(Math.random() * words.length)]
  const options = shuffle([answer, ...sample(words.filter((w) => w !== answer), 1), ...sample(['dog', 'pen', 'bus', 'tree'], 2)]).slice(0, 4)
  return { family, answer, options }
}

export function L3WordFamily() {
  const { awardStars, addSticker } = useProgress()
  const [q, setQ] = useState(question)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!done) {
      speak(q.family)
    }
  }, [q.family, done])

  const choose = (word: string) => {
    const next = correct + (word.endsWith(q.family) ? 1 : 0)
    if (round >= rounds) {
      const stars = toStars(next, rounds)
      awardStars('l3-word-family', stars)
      if (stars >= 2) addSticker('🏠')
      setCorrect(next)
      setDone(true)
      return
    }
    setCorrect(next)
    setRound((v) => v + 1)
    setQ(question())
  }

  return (
    <PageShell title="Level 3 - Word Family Builder" levelTint={3}>
      <MascotHintRow guide="fox" message="Listen to the ending sound, then pick a real word that matches it." />
      {!done ? (
        <>
          <p className="mb-3 text-xl">
            Pick a word that ends with the sound <strong>-{q.family}</strong>.
          </p>
          <div className="mb-3">
            <BigButton label="Hear the ending sound" onClick={() => speak(q.family)} />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {q.options.map((opt) => (
              <button key={opt} className="rounded-xl bg-white p-4 text-2xl shadow" onClick={() => choose(opt)}>{opt}</button>
            ))}
          </div>
          <p className="mt-4">Round {round}/{rounds}</p>
        </>
      ) : (
        <>
          <p className="text-2xl">Great work! Score: {correct}/{rounds}</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
