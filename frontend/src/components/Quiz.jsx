import { useState } from 'react'
import { calculateExamResult } from '../utils/examLogic'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import QuestionCard from './QuestionCard'
import './Quiz.css'

function Quiz({ questions, themeName, isExamMode }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    // Store state for each question: { [index]: { selectedOptions: [], textAnswer: '', isChecked: boolean, isCorrect: boolean } }
    const [questionStates, setQuestionStates] = useState({})
    const [showSummary, setShowSummary] = useState(false)

    // Calculate max possible points
    const maxPoints = questions.reduce((acc, q) => acc + (parseInt(q.points) || 0), 0)

    const currentQuestion = questions[currentIndex]
    const totalQuestions = questions.length
    const currentState = questionStates[currentIndex] || {
        selectedOptions: [],
        textAnswer: '',
        isChecked: false
    }

    const handleStateUpdate = (updates) => {
        setQuestionStates(prev => ({
            ...prev,
            [currentIndex]: { ...prev[currentIndex], ...updates }
        }))
    }

    const handleAnswerSubmit = (isCorrect, answerData) => {
        // answerData contains selectedOptions or textAnswer array
        // We update the state to mark it as checked
        handleStateUpdate({
            isChecked: true,
            isCorrect: isCorrect
        })
    }

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setShowSummary(true)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setQuestionStates({})
        setShowSummary(false)
    }

    // Calculate score based on stored states
    const calculateScore = () => {
        return Object.keys(questionStates).reduce((acc, key) => {
            const state = questionStates[key]
            if (state.isCorrect) {
                const points = parseInt(questions[key].points) || 0
                return acc + points
            }
            return acc
        }, 0)
    }

    const score = calculateScore()

    if (showSummary) {
        // Prepare history array for exam result calculation
        const history = Object.keys(questionStates).map(key => {
            const idx = parseInt(key)
            return {
                questionId: questions[idx].question_id,
                isCorrect: questionStates[idx].isCorrect,
                // We might need to store selectedOptions explicitly if needed for detailed review later
            }
        })

        let examResult = null
        if (isExamMode) {
            examResult = calculateExamResult(history, questions)
        }

        return (
            <div className="quiz-summary card">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="summary-content"
                >
                    {isExamMode ? (
                        <div className={`exam-result ${examResult.passed ? 'passed' : 'failed'}`}>
                            <div className="result-icon">
                                {examResult.passed ? <CheckCircle size={80} /> : <XCircle size={80} />}
                            </div>
                            <h2>{examResult.passed ? 'TEBRİKLER! SINAVI GEÇTİNİZ' : 'MAALESEF KALDINIZ'}</h2>
                            <div className="exam-stats">
                                <div className="stat-item">
                                    <span className="label">Hata Puanı:</span>
                                    <span className={`value ${examResult.totalErrorPoints > 10 ? 'bad' : 'good'}`}>
                                        {examResult.totalErrorPoints}
                                    </span>
                                    <span className="sub-text">(Maks. 10)</span>
                                </div>
                                {examResult.fivePointErrors > 0 && (
                                    <div className="stat-item warning">
                                        <AlertTriangle size={20} />
                                        <span>{examResult.fivePointErrors} adet 5 puanlık hata</span>
                                    </div>
                                )}
                            </div>
                            <p className="result-message">
                                {examResult.passed
                                    ? "Harika bir iş çıkardınız! Trafik kurallarına hakimsiniz."
                                    : examResult.fivePointErrors >= 2
                                        ? "İki adet 5 puanlık soru yanlış yapıldığı için sınav başarısız."
                                        : "Toplam hata puanınız 10'u geçtiği için sınav başarısız."
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2>Konu Tamamlandı!</h2>
                            <p className="theme-name">{themeName}</p>
                            <div className="score-circle">
                                <span className="score-value">{Math.round((score / maxPoints) * 100)}%</span>
                                <span className="score-label">Başarı</span>
                            </div>
                        </>
                    )}

                    <div className="summary-details">
                        <div className="detail-row">
                            <span>Toplam Puan:</span>
                            <span>{score} / {maxPoints}</span>
                        </div>
                        <div className="detail-row">
                            <span>Cevaplanan:</span>
                            <span>{Object.keys(questionStates).length} / {totalQuestions}</span>
                        </div>
                    </div>

                    <button onClick={handleRestart} className="restart-button check-btn">
                        {isExamMode ? 'Yeni Sınav Başlat' : 'Tekrar Çalış'}
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                {currentIndex > 0 ? (
                    <button onClick={handlePrevious} className="prev-header-btn">
                        <ArrowLeft size={20} /> Önceki
                    </button>
                ) : <div></div>}

                <span>Soru {currentIndex + 1} / {totalQuestions}</span>
                <span>Puan: {score}</span>
            </div>

            <QuestionCard
                key={currentQuestion.question_id}
                question={currentQuestion}

                // Controlled props
                selectedOptions={currentState.selectedOptions}
                textAnswer={currentState.textAnswer}
                isChecked={currentState.isChecked}

                // State updaters
                onOptionSelect={(opts) => handleStateUpdate({ selectedOptions: opts })}
                onTextChange={(text) => handleStateUpdate({ textAnswer: text })}

                onNext={handleNext}
                onPrevious={handlePrevious}
                onAnswerSubmit={handleAnswerSubmit}

                hasPrevious={currentIndex > 0}
            />
        </div>
    )
}

export default Quiz
