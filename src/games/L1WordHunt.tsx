import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { Confetti } from '../components/Confetti'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { sightWords } from '../data/sightWords'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'
import { sample, shuffle } from '../lib/shuffle'
import { speak } from '../lib/speech'

const rounds = 5

function makeGrid() {
  const words = sample(sightWords, 12)
  return { target: words[0], words: shuffle(words) }
}

export function L1WordHunt() {
  const { awardStars, addSticker } = useProgress()
  const [step, setStep] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [grid, setGrid] = useState(makeGrid)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!done) {
      speak(grid.target)
    }
  }, [grid.target, done])

  const choose = (word: string) => {
    const nextCorrect = correct + (word === grid.target ? 1 : 0)
    if (step >= rounds) {
      const stars = toStars(nextCorrect, rounds)
      awardStars('l1-word-hunt', stars)
      if (stars === 3) addSticker('🔍')
      setCorrect(nextCorrect)
      setDone(true)
      return
    }
    setCorrect(nextCorrect)
    setStep((v) => v + 1)
    setGrid(makeGrid())
  }

  const stars = toStars(correct, rounds)

  return (
    <PageShell title="Level 1 - Word Hunt" levelTint={1}>
      <MascotHintRow guide="owl" message="Listen to the word, then tap it in the grid. Use Hear it again anytime!" />
      <Confetti show={done && stars > 0} />
      {!done ? (
        <>
          <p className="mb-2 text-lg">Round {step}/{rounds}</p>
          <p className="mb-3 text-xl">Listen and tap the word you hear.</p>
          <BigButton label="Hear it again" onClick={() => speak(grid.target)} />
          <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4">
            {grid.words.map((word) => (
              <button key={word} type="button" className="rounded-xl bg-white p-3 text-xl shadow" onClick={() => choose(word)}>{word}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl">Score: {correct}/{rounds} ({stars} stars)</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-3" /></Link>
        </>
      )}
    </PageShell>
  )
}
