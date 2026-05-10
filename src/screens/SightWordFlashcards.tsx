import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { MascotHintRow } from '../components/MascotHintRow'
import { PageShell } from '../components/PageShell'
import { SIGHT_WORD_COUNT, SIGHT_WORDS_100 } from '../data/sightWords'
import { speak } from '../lib/speech'

export function SightWordFlashcards() {
  const [index, setIndex] = useState(0)
  const word = SIGHT_WORDS_100[index]

  const hear = useCallback(() => {
    void speak(word)
  }, [word])

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(SIGHT_WORD_COUNT - 1, i + 1))

  return (
    <PageShell title="100 Sight Word Flashcards" levelTint={1}>
      <MascotHintRow
        guide="owl"
        message="Tap the card to hear the word. Use arrows to practice all one hundred sight words!"
      />
      <p className="mb-4 text-slate-700">
        Practice mode — flip through every word on the list. This path does not affect stars or stickers.
      </p>

      <button
        type="button"
        onClick={hear}
        className="mb-3 w-full rounded-3xl bg-orange-200 p-10 text-5xl font-bold tracking-tight text-slate-800 shadow-inner transition hover:bg-orange-300 md:p-14 md:text-6xl"
      >
        {word}
      </button>

      <p className="mb-1 text-center text-lg text-slate-600">
        Card <span className="font-semibold text-slate-800">{index + 1}</span> of {SIGHT_WORD_COUNT}
      </p>
      <p className="mb-6 text-center text-sm text-slate-500">List order matches your sight-words sheet.</p>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <BigButton label="Hear word" onClick={hear} />
        <BigButton
          label="Previous"
          onClick={goPrev}
          disabled={index === 0}
          className={index === 0 ? 'bg-slate-300 hover:bg-slate-300' : 'bg-sky-400 hover:bg-sky-500'}
        />
        <BigButton
          label="Next"
          onClick={goNext}
          disabled={index >= SIGHT_WORD_COUNT - 1}
          className={index >= SIGHT_WORD_COUNT - 1 ? 'bg-slate-300 hover:bg-slate-300' : 'bg-pink-400 hover:bg-pink-500'}
        />
        <BigButton
          label="Start over"
          onClick={() => setIndex(0)}
          className="bg-violet-400 hover:bg-violet-500"
        />
      </div>

      <Link to="/" className="inline-block text-blue-600 underline">
        Back to home
      </Link>
    </PageShell>
  )
}
