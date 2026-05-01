import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BigButton } from '../components/BigButton'
import { Confetti } from '../components/Confetti'
import { PageShell } from '../components/PageShell'
import { levelOrder, placementQuiz } from '../data/quiz'
import { speak } from '../lib/speech'
import { useProgress } from '../lib/useProgress'
import type { LevelId } from '../lib/types'

function scoreToLevel(score: number): LevelId {
  if (score <= 2) return 'l1'
  if (score <= 4) return 'l2'
  if (score <= 6) return 'l3'
  if (score <= 8) return 'l4'
  return 'l5'
}

export function PlacementQuiz() {
  const navigate = useNavigate()
  const { setPlacementLevel, progress } = useProgress()
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [finishConfetti, setFinishConfetti] = useState(false)

  const totalStars = useMemo(
    () => Object.values(progress.stars).reduce((sum, s) => sum + (s ?? 0), 0),
    [progress.stars],
  )

  const score = useMemo(
    () => placementQuiz.reduce((sum, q, idx) => sum + (answers[idx] === q.answer ? 1 : 0), 0),
    [answers],
  )

  const canSubmit = Object.keys(answers).length === placementQuiz.length
  const currentQuestionIndex = placementQuiz.findIndex((_, idx) => !answers[idx])

  useEffect(() => {
    if (currentQuestionIndex < 0) return
    const question = placementQuiz[currentQuestionIndex]
    if (question.kind === 'audio' || question.kind === 'rhyme') {
      speak(question.speak)
    }
  }, [currentQuestionIndex])

  const submit = () => {
    const level = scoreToLevel(score)
    setPlacementLevel(level)
    setFinishConfetti(true)
    window.setTimeout(() => {
      setFinishConfetti(false)
      navigate('/map')
    }, 900)
  }

  const streak = progress.streakCount ?? 0

  return (
    <PageShell title="Placement Quiz" levelTint={3} headerStars={totalStars} headerStreak={streak}>
      <Confetti show={finishConfetti} />
      <p className="mb-5 text-lg text-slate-700">Answer all 10 questions. We will suggest your starting level.</p>
      <div className="space-y-4">
        {placementQuiz.map((question, idx) => {
          const unanswered = !answers[idx]

          return (
            <section key={`${question.kind}-${idx}`} className="rounded-2xl bg-purple-50 p-4">
              <p className="mb-3 text-lg font-semibold">
                {idx + 1}. {question.prompt}
              </p>

              {question.kind === 'picture' ? (
                <p className="mb-3 text-6xl" aria-label="question picture">{question.emoji}</p>
              ) : null}

              {question.kind === 'rhyme' ? (
                <p className="mb-3 text-xl">
                  Word: <strong>{question.target}</strong>
                </p>
              ) : null}

              {question.kind === 'audio' || question.kind === 'rhyme' ? (
                <div className="mb-3">
                  <BigButton
                    label={unanswered ? 'Hear the word' : 'Hear it again'}
                    onClick={() => speak(question.speak)}
                  />
                </div>
              ) : null}

              <div className="grid gap-2 md:grid-cols-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [idx]: option }))}
                    className={`rounded-xl border-2 px-4 py-2 text-left text-lg ${
                      answers[idx] === option ? 'border-purple-500 bg-purple-200' : 'border-purple-100 bg-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-6">
        <BigButton label={canSubmit ? 'Finish Quiz' : 'Answer all questions'} disabled={!canSubmit} onClick={submit} />
      </div>

      {canSubmit ? (
        <p className="mt-4 text-lg">
          Current score: <strong>{score}/10</strong>. Suggested level: <strong>{scoreToLevel(score).toUpperCase()}</strong>
        </p>
      ) : null}

      <p className="mt-4 text-sm text-slate-500">Level order: {levelOrder.map((l) => l.toUpperCase()).join(' -> ')}</p>
    </PageShell>
  )
}
