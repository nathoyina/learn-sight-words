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
const FEEDBACK_DELAY_MS = 1600

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
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrectPick, setIsCorrectPick] = useState<boolean | null>(null)
  const stars = useMemo(() => toStars(correct, totalRounds), [correct])

  const pick = (word: string) => {
    if (selected !== null) return
    const isCorrect = word === current.answer
    setSelected(word)
    setIsCorrectPick(isCorrect)
    if (isCorrect) setCorrect((v) => v + 1)

    window.setTimeout(() => {
      if (round >= totalRounds) {
        const earned = toStars(correct + (isCorrect ? 1 : 0), totalRounds)
        awardStars('l1-hear-tap', earned)
        if (earned >= 2) addSticker('👂')
        setDone(true)
        setSelected(null)
        setIsCorrectPick(null)
        return
      }
      setRound((v) => v + 1)
      setCurrent(makeRound())
      setSelected(null)
      setIsCorrectPick(null)
    }, FEEDBACK_DELAY_MS)
  }

  return (
    <PageShell title="Level 1 - Hear and Tap" levelTint={1}>
      <MascotHintRow guide="fox" message="Tap Hear the Word first, then choose the word you heard." />
      <Confetti show={done && stars > 0} />
      {!done ? (
        <>
          <p className="mb-3 text-lg">Round {round} / {totalRounds}</p>
          <BigButton label="Hear the Word" onClick={() => speak(current.answer)} />
          {selected !== null ? (
            <p className={`mt-3 text-lg font-semibold ${isCorrectPick ? 'text-green-700' : 'text-amber-700'}`}>
              {isCorrectPick ? 'Great job!' : `Not quite. Correct answer: ${current.answer}`}
            </p>
          ) : null}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {current.options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={selected !== null}
                onClick={() => pick(option)}
                className={`rounded-2xl p-4 text-2xl shadow ${
                  selected === null
                    ? 'bg-white'
                    : option === current.answer
                      ? 'bg-green-200'
                      : option === selected
                        ? 'bg-rose-200'
                        : 'bg-white'
                }`}
              >
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
