import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './CategorySelector.css'
import { BookOpen, AlertTriangle } from 'lucide-react'

function CategorySelector({ onSelect }) {
    const categories = [
        {
            id: 'themes',
            title: 'Tüm Konular',
            description: 'Sırayla tüm konuları çalışın.',
            icon: <BookOpen size={40} />
        },
        {
            id: 'exam',
            title: 'Sınav Simülasyonu',
            description: 'Gerçek sınav formatında kendinizi deneyin (30 Soru).',
            icon: <AlertTriangle size={40} />
        }
    ]

    return (
        <div className="category-selector">
            <h2>Çalışma Modunu Seçin</h2>
            <div className="categories-grid">
                {categories.map((category) => (
                    <motion.div
                        key={category.id}
                        className="category-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(category.id)}
                    >
                        <div className="category-icon">{category.icon}</div>
                        <h3>{category.title}</h3>
                        <p>{category.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default CategorySelector
