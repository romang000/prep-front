import { getAnswers } from "@/features/answers/api/getAnswers";
import type { QuestionResponse } from "@/features/questions/model/types";
import { useEffect, useState } from "react";

type TestResult = {
    correctCount: number
    wrongCount: number
    totalQuestions: number
    percent: number
    message: string
}

export function AnalyticsAfterTest() {
    const [testResult, setTestResult] = useState<TestResult | null>(null)
    const [questions, setQuestions] = useState<QuestionResponse[]>([])
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
    const [elapsedSeconds, setElapsedSeconds] = useState(0)

    function getResultMessage(percent: number) {
        if (percent >= 90) {
            return "Отличный результат!"
        }

        if (percent >= 70) {
            return "Хороший результат!"
        }

        if (percent >= 50) {
            return "Не помешает ещё немного практики!"
        }

        return "Есть над чем поработать"
    }

    function getProgressStrokeColor(percent: number) {
        if (percent >= 80) {
            return "#22C55E"
        }

        if (percent >= 50) {
            return "#F59E0B"
        }

        return "#EF4444"
    }


    const calculateTestResult = async (): Promise<TestResult> => {
        let correctCount = 0

        for (const question of questions) {
            const response = await getAnswers(question.id)
            const questionAnswers = Array.isArray(response) ? response : [response]

            const chosenAnswerId = selectedAnswers[question.id]

            const selectedAnswer = questionAnswers.find(
                (answer) => answer.id === chosenAnswerId
            )

            if (selectedAnswer?.isCorrect) {
                correctCount += 1
            }
        }

        const totalQuestions = questions.length
        const wrongCount = totalQuestions - correctCount
        const percent =
            totalQuestions > 0
                ? Number(((correctCount / totalQuestions) * 100).toFixed(1))
                : 0

        return {
            correctCount,
            wrongCount,
            totalQuestions,
            percent,
            message: getResultMessage(percent),
        }
    }

    useEffect(() => {
            if (testResult) {
                return
            }
    
            const intervalId = window.setInterval(() => {
                setElapsedSeconds((prev) => prev + 1)
            }, 1000)
    
            return () => {
                window.clearInterval(intervalId)
            }
        }, [testResult])
}