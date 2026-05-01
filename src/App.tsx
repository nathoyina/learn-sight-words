import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { Home } from './screens/Home'
import { PlacementQuiz } from './screens/PlacementQuiz'
import { LevelMap } from './screens/LevelMap'
import { ProgressProvider } from './lib/ProgressContext'
import { useProgress } from './lib/useProgress'
import { L1Flashcards } from './games/L1Flashcards'
import { L1HearAndTap } from './games/L1HearAndTap'
import { L1WordHunt } from './games/L1WordHunt'
import { L2BuildWord } from './games/L2BuildWord'
import { L2MissingLetter } from './games/L2MissingLetter'
import { L3WordFamily } from './games/L3WordFamily'
import { L3RhymeMatch } from './games/L3RhymeMatch'
import { L4PictureMatch } from './games/L4PictureMatch'
import { L4ThemeSort } from './games/L4ThemeSort'
import { L5SentenceBuilder } from './games/L5SentenceBuilder'
import { L5FillBlank } from './games/L5FillBlank'
import { Login } from './screens/Login'
import { TeacherAuth } from './screens/TeacherAuth'
import { TeacherDashboard } from './screens/TeacherDashboard'

function RequireChild({ children }: { children: ReactElement }) {
  const { activeStudentId } = useProgress()
  if (!activeStudentId) {
    return <Navigate to="/login" replace />
  }
  return children
}

function RequireTeacher({ children }: { children: ReactElement }) {
  const { teacher } = useProgress()
  if (!teacher) {
    return <Navigate to="/teacher" replace />
  }
  return children
}

function App() {
  return (
    <ProgressProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<TeacherAuth />} />
        <Route path="/teacher/dashboard" element={<RequireTeacher><TeacherDashboard /></RequireTeacher>} />
        <Route path="/" element={<RequireChild><Home /></RequireChild>} />
        <Route path="/quiz" element={<RequireChild><PlacementQuiz /></RequireChild>} />
        <Route path="/map" element={<RequireChild><LevelMap /></RequireChild>} />

        <Route path="/games/l1/flashcards" element={<RequireChild><L1Flashcards /></RequireChild>} />
        <Route path="/games/l1/hear-and-tap" element={<RequireChild><L1HearAndTap /></RequireChild>} />
        <Route path="/games/l1/word-hunt" element={<RequireChild><L1WordHunt /></RequireChild>} />

        <Route path="/games/l2/build-word" element={<RequireChild><L2BuildWord /></RequireChild>} />
        <Route path="/games/l2/missing-letter" element={<RequireChild><L2MissingLetter /></RequireChild>} />

        <Route path="/games/l3/word-family" element={<RequireChild><L3WordFamily /></RequireChild>} />
        <Route path="/games/l3/rhyme-match" element={<RequireChild><L3RhymeMatch /></RequireChild>} />

        <Route path="/games/l4/picture-match" element={<RequireChild><L4PictureMatch /></RequireChild>} />
        <Route path="/games/l4/theme-sort" element={<RequireChild><L4ThemeSort /></RequireChild>} />

        <Route path="/games/l5/sentence-builder" element={<RequireChild><L5SentenceBuilder /></RequireChild>} />
        <Route path="/games/l5/fill-blank" element={<RequireChild><L5FillBlank /></RequireChild>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProgressProvider>
  )
}

export default App
