import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { cvcWords } from '../data/cvcWords'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'

const vowels = ['a', 'e', 'i', 'o', 'u']
const rounds = 5
const FEEDBACK_DELAY_MS = 1600

function makeQuestion() {
  const item = cvcWords[Math.floor(Math.random() * cvcWords.length)]
  const missing = item.word[1]
  return { ...item, missing, prompt: `${item.word[0]} _ ${item.word[2]}` }
}

export function L2MissingLetter() {
  const { awardStars, addSticker } = useProgress()
  const [question, setQuestion] = useState(makeQuestion)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrectPick, setIsCorrectPick] = useState<boolean | null>(null)
  const stars = useMemo(() => toStars(correct, rounds), [correct])

  const choose = (vowel: string) => {
    if (selected !== null) return
    const isCorrect = vowel === question.missing
    setSelected(vowel)
    setIsCorrectPick(isCorrect)
    const next = correct + (vowel === question.missing ? 1 : 0)
    window.setTimeout(() => {
      if (round >= rounds) {
        const earned = toStars(next, rounds)
        awardStars('l2-missing-letter', earned)
        if (earned >= 2) addSticker('🔤')
        setCorrect(next)
        setDone(true)
        setSelected(null)
        setIsCorrectPick(null)
        return
      }
      setCorrect(next)
      setRound((v) => v + 1)
      setQuestion(makeQuestion())
      setSelected(null)
      setIsCorrectPick(null)
    }, FEEDBACK_DELAY_MS)
  }

  return (
    <PageShell title="Level 2 - Missing Letter" levelTint={2}>
      <MascotHintRow guide="owl" message="Look at the picture and the blanks. Tap the vowel that finishes the word!" />
      {!done ? (
        <>
          <p className="text-lg">Round {round}/{rounds}</p>
          <p className="my-3 text-5xl">{question.emoji}</p>
          <p className="mb-3 text-3xl font-bold">{question.prompt}</p>
          <div className="mb-3 min-h-14">
            {selected !== null ? (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-xl border px-3 py-2 text-base font-semibold md:text-lg ${
                  isCorrectPick
                    ? 'border-green-300 bg-green-50 text-green-800'
                    : 'border-amber-300 bg-amber-50 text-amber-800'
                }`}
              >
                {isCorrectPick ? 'Great job!' : `Not quite. Correct answer: ${question.missing}`}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {vowels.map((vowel) => (
              <button
                key={vowel}
                className={`rounded-xl p-3 text-2xl shadow ${
                  selected === null
                    ? 'bg-white'
                    : vowel === question.missing
                      ? 'bg-green-200'
                      : vowel === selected
                        ? 'bg-rose-200'
                        : 'bg-white'
                }`}
                disabled={selected !== null}
                onClick={() => choose(vowel)}
              >
                {vowel}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl">You earned {stars} stars!</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
