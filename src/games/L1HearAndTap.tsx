import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { Confetti } from '../components/Confetti'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { sightWords } from '../data/sightWords'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'
import { shuffle } from '../lib/shuffle'
import { speak } from '../lib/speech'

const totalRounds = 5

function makeRound() {
  const options = shuffle(sightWords).slice(0, 4)
  return { answer: options[0], options: shuffle(options) }
}

export function L1HearAndTap() {
  const { awardStars, addSticker } = useProgress()
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [current, setCurrent] = useState(makeRound)
  const [done, setDone] = useState(false)
  const stars = useMemo(() => toStars(correct, totalRounds), [correct])

  const pick = (word: string) => {
    const isCorrect = word === current.answer
    if (isCorrect) setCorrect((v) => v + 1)

    if (round >= totalRounds) {
      const earned = toStars(correct + (isCorrect ? 1 : 0), totalRounds)
      awardStars('l1-hear-tap', earned)
      if (earned >= 2) addSticker('👂')
      setDone(true)
      return
    }
    setRound((v) => v + 1)
    setCurrent(makeRound())
  }

  return (
    <PageShell title="Level 1 - Hear and Tap" levelTint={1}>
      <MascotHintRow guide="fox" message="Tap Hear the Word first, then choose the word you heard." />
      <Confetti show={done && stars > 0} />
      {!done ? (
        <>
          <p className="mb-3 text-lg">Round {round} / {totalRounds}</p>
          <BigButton label="Hear the Word" onClick={() => speak(current.answer)} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {current.options.map((option) => (
              <button key={option} type="button" onClick={() => pick(option)} className="rounded-2xl bg-white p-4 text-2xl shadow">
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold">Great try! You got {correct} / {totalRounds}</p>
          <p className="my-3 text-xl">You earned {stars} stars.</p>
          <Link to="/map"><BigButton label="Back to Map" /></Link>
        </>
      )}
    </PageShell>
  )
}
