import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import './QuestionCard.css'

function QuestionCard({
    question,
    // Controlled props
    selectedOptions = [],
    textAnswer = "",
    isChecked = false,
    // Callbacks
    onOptionSelect,
    onTextChange,
    onNext,
    onPrevious,
    onAnswerSubmit,
    hasPrevious
}) {

    const correctLetters = question.correct_answers.map(ans => ans.letter)
    const hasOptions = question.options && question.options.length > 0

    const handleOptionToggle = (letter) => {
        if (isChecked) return

        if (selectedOptions.includes(letter)) {
            onOptionSelect(selectedOptions.filter(l => l !== letter))
        } else {
            onOptionSelect([...selectedOptions, letter])
        }
    }

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b']
        });
    }

    const handleCheck = () => {
        let isCorrect = false

        if (hasOptions) {
            isCorrect = selectedOptions.length === correctLetters.length &&
                selectedOptions.every(l => correctLetters.includes(l))
        } else {
            // Text/Number answer check (case insensitive, trimmed)
            const correctAnswer = question.correct_answers[0]?.letter
            isCorrect = textAnswer.trim().toLowerCase() === correctAnswer.toString().toLowerCase()
        }

        if (isCorrect) triggerConfetti()
        onAnswerSubmit(isCorrect, hasOptions ? selectedOptions : [textAnswer])
    }

    const handleNextClick = () => {
        onNext()
    }

    const hasAnswer = hasOptions ? selectedOptions.length > 0 : textAnswer.trim().length > 0

    return (
        <div className="card">
            <div className="card-header">
                <h3>{question.question_number} ({question.points})</h3>
                <p>{question.question_text}</p>
            </div>

            {question.image_urls && question.image_urls.length > 0 && (
                <div className="media-container">
                    {/* Assuming local paths are preferred if available, else urls */}
                    {question.local_image_paths && question.local_image_paths.length > 0 ? (
                        question.local_image_paths.map((path, idx) => (
                            <img key={idx} src={`/${path}`} alt="Question visual" className="question-image" />
                        ))
                    ) : (
                        question.image_urls.map((url, idx) => (
                            <img key={idx} src={url} alt="Question visual" className="question-image" />
                        ))
                    )}
                </div>
            )}

            {question.video_urls && question.video_urls.length > 0 && (
                <div className="media-container">
                    {question.local_video_paths && question.local_video_paths.length > 0 ? (
                        question.local_video_paths.map((path, idx) => (
                            <video key={idx} controls className="question-video">
                                <source src={`/${path}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ))
                    ) : (
                        question.video_urls.map((url, idx) => (
                            <video key={idx} controls src={url} className="question-video" />
                        ))
                    )}
                </div>
            )}

            <div className="options-list">
                {hasOptions ? (
                    question.options.map(opt => {
                        const isSelected = selectedOptions.includes(opt.letter)
                        const isCorrect = correctLetters.includes(opt.letter)

                        let optionClass = "option-item"
                        if (isChecked) {
                            if (isCorrect) optionClass += " correct"
                            if (isSelected && !isCorrect) optionClass += " incorrect"
                            // Missed logic: It was correct, but NOT selected
                            if (!isSelected && isCorrect) optionClass += " missed"
                        } else if (isSelected) {
                            optionClass += " selected"
                        }

                        return (
                            <div
                                key={opt.letter}
                                className={optionClass}
                                onClick={() => handleOptionToggle(opt.letter)}
                            >
                                <span className="option-letter">{opt.letter}</span>
                                <span className="option-text">{opt.text}</span>
                                {isChecked && isCorrect && <span className="icon">✓</span>}
                                {isChecked && isSelected && !isCorrect && <span className="icon">✗</span>}
                            </div>
                        )
                    })
                ) : (
                    <div className="text-answer-container">
                        <input
                            type="text"
                            value={textAnswer}
                            onChange={(e) => onTextChange(e.target.value)}
                            disabled={isChecked}
                            placeholder="Cevabınızı buraya yazın..."
                            className={`answer-input ${isChecked ? (
                                textAnswer.trim().toLowerCase() === question.correct_answers[0]?.letter.toString().toLowerCase()
                                    ? 'correct'
                                    : 'incorrect'
                            ) : ''}`}
                        />
                        {isChecked && (
                            <div className="correct-answer-display">
                                Doğru Cevap: <strong>{question.correct_answers[0]?.letter}</strong>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="actions">
                {/* Previous Button inside Card Actions */}
                {hasPrevious && (
                    <button
                        className="prev-btn"
                        onClick={onPrevious}
                    >
                        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Önceki Soru
                    </button>
                )}

                {!isChecked ? (
                    <button
                        className="check-btn"
                        onClick={handleCheck}
                        disabled={!hasAnswer}
                    >
                        Cevabı Kontrol Et
                    </button>
                ) : (
                    <div className="feedback-section">
                        <div className="explanation">
                            <h4>Açıklama:</h4>
                            <p>{question.comment}</p>
                        </div>
                        <button className="next-btn" onClick={handleNextClick}>Sonraki Soru</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuestionCard
