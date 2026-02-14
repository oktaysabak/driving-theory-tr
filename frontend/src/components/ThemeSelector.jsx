import { useState } from 'react'
import './ThemeSelector.css'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Layers, ArrowLeft, Play } from 'lucide-react'

function ThemeSelector({ questions = [], onSelect }) {
    const [selectedTheme, setSelectedTheme] = useState(null)

    // Derive themes (unique theme_name)
    const themes = [...new Set(questions.map(q => q.theme_name))].sort((a, b) => {
        const getNum = (s) => {
            const match = s.match(/(\d+\.)+/);
            return match ? parseFloat(match[0]) : 999;
        }
        return getNum(a) - getNum(b);
    })

    // If a theme is selected, derive chapters for that theme
    // If a theme is selected, derive chapters for that theme
    // We utilize chapter_number as a unique identifier because chapter_name might not be unique (e.g. 1.5.01 and 2.5.01).
    const chapters = selectedTheme
        ? [...new Set(questions
            .filter(q => q.theme_name === selectedTheme)
            .map(q => JSON.stringify({ number: q.chapter_number, name: q.chapter_name })))]
            .map(s => JSON.parse(s))
            .sort((a, b) => {
                const getNum = (s) => {
                    const match = s.match(/(\d+\.\d+\.\d+)/);
                    if (match) {
                        const parts = match[0].split('.').map(Number);
                        return parts[0] * 10000 + parts[1] * 100 + parts[2];
                    }
                    return 999999;
                }
                return getNum(a.number) - getNum(b.number);
            })
        : []

    const handleThemeClick = (theme) => {
        setSelectedTheme(theme)
    }

    const handleChapterClick = (chapter) => {
        onSelect(selectedTheme, chapter.number)
    }

    const handlePlayAllInTheme = () => {
        onSelect(selectedTheme, null) // Null chapter means play all in theme
    }

    const handleBack = () => {
        setSelectedTheme(null)
    }

    if (questions.length === 0) {
        return <div className="no-themes">Konu bulunamadı.</div>
    }

    return (
        <div className="theme-selector">
            <AnimatePresence mode="wait">
                {!selectedTheme ? (
                    <motion.div
                        key="themes"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <h2>Bir Konu Seçin</h2>
                        <div className="themes-grid">
                            {themes.map((theme, index) => (
                                <motion.div
                                    key={theme}
                                    className="theme-button"
                                    onClick={() => handleThemeClick(theme)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <BookOpen className="theme-icon" size={24} />
                                    <span>{theme}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chapters"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', position: 'relative' }}>
                            <button onClick={handleBack} className="back-button" style={{ position: 'relative', transform: 'none', top: 'auto', left: 'auto', marginRight: '20px' }}>
                                <ArrowLeft size={20} /> Geri
                            </button>
                            <h2 style={{ margin: 0 }}>{selectedTheme}</h2>
                        </div>

                        <div className="themes-grid">
                            {/* Option to play all questions in this theme */}
                            <motion.div
                                key="all"
                                className="theme-button play-all"
                                onClick={handlePlayAllInTheme}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ borderColor: 'var(--primary-color)', background: 'rgba(99, 102, 241, 0.1)' }}
                            >
                                <Play className="theme-icon" size={32} />
                                <span>Tümünü Çalış ({questions.filter(q => q.theme_name === selectedTheme).length} Soru)</span>
                            </motion.div>

                            {chapters.map((chapter, index) => (
                                <motion.div
                                    key={chapter.number}
                                    className="theme-button"
                                    onClick={() => handleChapterClick(chapter)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Layers className="theme-icon" size={24} />
                                    <span>{chapter.number.replace(' Bölüm', '')}</span>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{chapter.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7, marginTop: '4px' }}>
                                        ({questions.filter(q => q.theme_name === selectedTheme && q.chapter_number === chapter.number).length} Soru)
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ThemeSelector
