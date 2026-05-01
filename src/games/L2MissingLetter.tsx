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
  const stars = useMemo(() => toStars(correct, rounds), [correct])

  const choose = (vowel: string) => {
    const next = correct + (vowel === question.missing ? 1 : 0)
    if (round >= rounds) {
      const earned = toStars(next, rounds)
      awardStars('l2-missing-letter', earned)
      if (earned >= 2) addSticker('🔤')
      setCorrect(next)
      setDone(true)
      return
    }
    setCorrect(next)
    setRound((v) => v + 1)
    setQuestion(makeQuestion())
  }

  return (
    <PageShell title="Level 2 - Missing Letter" levelTint={2}>
      <MascotHintRow guide="owl" message="Look at the picture and the blanks. Tap the vowel that finishes the word!" />
      {!done ? (
        <>
          <p className="text-lg">Round {round}/{rounds}</p>
          <p className="my-3 text-5xl">{question.emoji}</p>
          <p className="mb-3 text-3xl font-bold">{question.prompt}</p>
          <div className="grid grid-cols-5 gap-2">
            {vowels.map((vowel) => (
              <button key={vowel} className="rounded-xl bg-white p-3 text-2xl shadow" onClick={() => choose(vowel)}>{vowel}</button>
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
