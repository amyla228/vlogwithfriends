import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import PromptPage from './pages/PromptPage'
import RecordingPage from './pages/RecordingPage'
import GuidedTemplatePage from './pages/GuidedTemplatePage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <div className="mobile-container">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prompt/:id" element={<PromptPage />} />
          <Route path="/record/:promptId" element={<RecordingPage />} />
          <Route path="/guided/:promptId" element={<GuidedTemplatePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
