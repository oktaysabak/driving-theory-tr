import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import ThemeSelector from './components/ThemeSelector'
import CategorySelector from './components/CategorySelector'
import Quiz from './components/Quiz'
import { createQuizSimulation } from './utils/examLogic'

function App() {
  const [questions, setQuestions] = useState([])
  const [themes, setThemes] = useState([])
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [examMode, setExamMode] = useState(false)
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('categories') // 'categories', 'themes', 'quiz'

  useEffect(() => {
    fetch('/data.json')
      .then(res => {
        if (!res.ok) throw new Error('Veri dosyası yüklenemedi (404)')
        return res.json()
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Veri dosyası boş veya hatalı formatta')
        }
        setQuestions(data)
        const uniqueThemes = [...new Set(data.map(q => q.theme_name))].sort()
        setThemes(uniqueThemes)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading data:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'themes') {
      setView('themes')
      setExamMode(false)
    } else if (categoryId === 'exam') {
      const examQuestions = createQuizSimulation(questions)
      setCurrentQuestions(examQuestions)
      setExamMode(true)
      setSelectedTheme('B Sınıfı Ehliyet Sınavı Simülasyonu')
      setView('quiz')
    }
  }

  const handleThemeSelect = (themeName, chapterNumber) => {
    let themeQuestions = questions.filter(q => q.theme_name === themeName)

    if (chapterNumber) {
      themeQuestions = themeQuestions.filter(q => q.chapter_number === chapterNumber)
      const chapterName = themeQuestions[0]?.chapter_name || ''
      const simpleNum = chapterNumber.replace(' Bölüm', '')
      setSelectedTheme(`${chapterName} (${simpleNum})`)
    } else {
      setSelectedTheme(themeName)
    }

    setCurrentQuestions(themeQuestions)
    setExamMode(false)
    setView('quiz')
  }

  const handleBackToHome = () => {
    setView('categories')
    setSelectedTheme(null)
    setExamMode(false)
    setCurrentQuestions([])
  }

  const handleBackToThemes = () => {
    if (examMode) {
      handleBackToHome()
    } else {
      setView('themes')
      setSelectedTheme(null)
      setCurrentQuestions([])
    }
  }

  if (loading) return (
    <div className="loading-container">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="loading-spinner"
      />
      <p>Sorular yükleniyor...</p>
    </div>
  )

  if (error) return (
    <div className="loading-container">
      <div style={{ color: '#ef4444', textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
        <h2>Veri Hatası</h2>
        <p style={{ marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: '#475569',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  )

  return (
    <div className="app-container">
      <header>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          HCS <span style={{ color: '#ef4444' }}>❤️</span> OKITO
        </motion.h1>
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 5 }}
          transition={{ duration: 2 }}
          style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', gap: '1px' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EHLIYET HAZIRLIK
        </motion.h1>

        {view !== 'categories' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={view === 'quiz' && !examMode ? handleBackToThemes : handleBackToHome}
            className="back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {view === 'quiz' && !examMode ? 'Konulara Dön' : 'Ana Menü'}
          </motion.button>
        )}
      </header>

      <main>
        <AnimatePresence mode="wait">
          {view === 'categories' && (
            <motion.div
              key="categories"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategorySelector onSelect={handleCategorySelect} />
            </motion.div>
          )}

          {view === 'themes' && (
            <motion.div
              key="themes"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ThemeSelector questions={questions} onSelect={handleThemeSelect} />
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="active-theme-banner">
                <h2>{selectedTheme}</h2>
              </div>
              <Quiz
                questions={currentQuestions}
                themeName={selectedTheme}
                isExamMode={examMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
