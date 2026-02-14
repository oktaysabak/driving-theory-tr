export const createQuizSimulation = (allQuestions) => {
    // B Class Exam Structure (Standard German Driving License Exam)
    // Total 30 questions
    // Max 10 error points allowed (but 2 x 5-point errors = fail)

    // Weights based on typical exam distribution (approximate)
    const distribution = {
        base: 20, // Basic material
        specific: 10 // Class B specific
    };

    // Randomly select 30 unique questions
    // Since we don't have explicit labels for Base/Specific in the JSON, 
    // we will select 30 random questions from the pool for now to simulate the experience.
    // In a real app, you'd filter by 'isBasic' and 'isBClass' fields if available.

    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 30);
};

export const calculateExamResult = (history, questions) => {
    let totalErrorPoints = 0;
    let fivePointErrors = 0;

    history.forEach(result => {
        if (!result.isCorrect) {
            const question = questions.find(q => q.question_id === result.questionId);
            const points = parseInt(question.points) || 0;
            totalErrorPoints += points;
            if (points === 5) fivePointErrors++;
        }
    });

    const passed = totalErrorPoints <= 10 && fivePointErrors < 2;

    return {
        passed,
        totalErrorPoints,
        fivePointErrors
    };
};
