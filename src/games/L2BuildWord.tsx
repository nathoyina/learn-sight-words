import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { cvcWords } from '../data/cvcWords'
import { useProgress } from '../lib/useProgress'
import { toStars } from '../lib/scoring'
import { shuffle } from '../lib/shuffle'

const rounds = 5

function getItem() {
  const item = cvcWords[Math.floor(Math.random() * cvcWords.length)]
  return { ...item, letters: shuffle(item.word.split('')) }
}

export function L2BuildWord() {
  const { awardStars, addSticker } = useProgress()
  const [round, setRound] = useState(1)
  const [built, setBuilt] = useState('')
  const [correct, setCorrect] = useState(0)
  const [item, setItem] = useState(getItem)
  const [done, setDone] = useState(false)

  const pick = (letter: string) => {
    if (built.length >= item.word.length) return
    setBuilt((prev) => prev + letter)
  }

  const submit = () => {
    const nextCorrect = correct + (built === item.word ? 1 : 0)
    if (round >= rounds) {
      const stars = toStars(nextCorrect, rounds)
      awardStars('l2-build-word', stars)
      if (stars >= 2) addSticker('🧩')
      setCorrect(nextCorrect)
      setDone(true)
      return
    }
    setCorrect(nextCorrect)
    setRound((r) => r + 1)
    setBuilt('')
    setItem(getItem())
  }

  return (
    <PageShell title="Level 2 - Build the Word" levelTint={2}>
      <MascotHintRow guide="fox" message="Tap the letters in order to spell the word that matches the picture." />
      {!done ? (
        <>
          <p className="text-lg">Round {round}/{rounds}</p>
          <p className="my-2 text-6xl">{item.emoji}</p>
          <p className="mb-3 text-xl">Build: {item.word.length} letters</p>
          <div className="mb-3 rounded-xl bg-white p-4 text-3xl tracking-[0.5em] shadow">{built.padEnd(item.word.length, '_ ')}</div>
          <div className="grid grid-cols-3 gap-2">
            {item.letters.map((letter, idx) => (
              <button key={`${letter}-${idx}`} className="rounded-xl bg-purple-100 p-3 text-2xl" onClick={() => pick(letter)}>{letter}</button>
            ))}
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <BigButton label="Clear" className="bg-slate-400 hover:bg-slate-500" onClick={() => setBuilt('')} />
            <BigButton label="Check" onClick={submit} />
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl">Score: {correct}/{rounds} ({toStars(correct, rounds)} stars)</p>
          <Link to="/map"><BigButton label="Back to Map" className="mt-4" /></Link>
        </>
      )}
    </PageShell>
  )
}
