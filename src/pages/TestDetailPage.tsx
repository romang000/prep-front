import { getQuestions } from "@/features/questions/api/getQuestions"
import type { QuestionResponse } from "@/features/questions/model/types"
import { QuestionCard } from "@/features/questions/ui/QuestionCard"
import { getAnswers } from "@/features/answers/api/getAnswers"
import type { AnswerGetResponse } from "@/features/answers/model/types"
import { AnswerCard } from "@/features/answers/ui/AnswerCard"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { Loader } from "@/shared/ui/Loader"
import { NotFound } from "@/shared/ui/NotFound"
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { createUserQuestion } from "@/features/usersQuestions/api/createUserQuestion"
import { setUserTestSessionComplete } from "@/features/userTestSession/api/userTestSessionComplete"
import { createUserTestSession } from "@/features/userTestSession/api/userTestSession"
import type { TestResult } from "@/features/tests/model/types"
import { TestResultCard } from "@/features/tests/ui/TestResultCard"
import { createRecommendations } from "@/features/recommendation/api/createRecommendations"
import { useAuth } from "@/features/auth/model/useAuth"
import { changeGrade } from "@/features/profile/api/changeGrade"

export function TestDetailPage() {
    const { userId } = useAuth()
    const { id } = useParams<{ id: string }>()
    const testId = Number(id)

    const [questions, setQuestions] = useState<QuestionResponse[]>([])
    const [answers, setAnswers] = useState<AnswerGetResponse[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)

    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
    const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isEmpty, setIsEmpty] = useState(false)

    const [isSubmittingFinish, setIsSubmittingFinish] = useState(false)
    const [testResult, setTestResult] = useState<TestResult | null>(null)

    const [searchParams] = useSearchParams()
    const sessionId = Number(searchParams.get("sessionId"))

    const navigate = useNavigate()

    const [elapsedSeconds, setElapsedSeconds] = useState(0)

    function formatTime(totalSeconds: number) {
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }

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

    useEffect(() => {
        if (!sessionId) return

        setSelectedAnswers({})
        setCurrentIndex(0)
        setTestResult(null)
        setIsFinishModalOpen(false)
        setElapsedSeconds(0)
        setError(null)
    }, [sessionId])

    useEffect(() => {
        async function loadQuestions() {
            try {
                setIsLoadingQuestions(true)
                setError(null)
                setIsEmpty(false)

                const response = await getQuestions(testId)
                const normalizedData = Array.isArray(response) ? response : [response]
                const sortedQuestions = [...normalizedData].sort(
                    (a, b) => a.serialNumber - b.serialNumber
                )

                setQuestions(sortedQuestions)
                setCurrentIndex(0)

                if (sortedQuestions.length === 0) {
                    setIsEmpty(true)
                }
            } catch (e) {
                console.error("unknow error", e)
                setError(e instanceof Error ? e.message : "Неизвестная ошибка")
            } finally {
                setIsLoadingQuestions(false)
            }
        }

        if (!Number.isNaN(testId)) {
            loadQuestions()
        }
    }, [testId])

    const currentQuestion = questions[currentIndex]

    useEffect(() => {
        async function loadAnswers() {
            if (!currentQuestion) {
                setAnswers([])
                return
            }

            try {
                setIsLoadingAnswers(true)
                setError(null)

                const response = await getAnswers(currentQuestion.id)
                setAnswers(Array.isArray(response) ? response : [response])
            } catch (e) {
                 console.error("Ошибка загрузки ответов", e)
                setError(e instanceof Error ? e.message : "Ошибка загрузки ответов")
            } finally {
                setIsLoadingAnswers(false)
            }
        }

        loadAnswers()
    }, [currentQuestion])

    const selectedAnswerId = currentQuestion
        ? selectedAnswers[currentQuestion.id]
        : undefined

    const handleSelectAnswer = async (answerId: number) => {
        const question = questions[currentIndex]

        if (!question) return
        if (userId === null) {
            setError("Не удалось определить пользователя из JWT токена.")
            return
        }

        setSelectedAnswers((prev) => ({
            ...prev,
            [question.id]: answerId,
        }))

        try {
            await createUserQuestion({
                userId,
                questionId: question.id,
                answerId: answerId,
            })
        } catch (e) {
            console.error("Ошибка при сохранении ответа", e)
        }
    }

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 1)
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => prev - 1)
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

    const handleExit = async (isComplete: boolean) => {
        if (!sessionId) {
            console.error("sessionId не найден")
            navigate("/tests")
            return
        }

        if (userId === null) {
            setError("Не удалось определить пользователя из JWT токена.")
            return
        }

        try {
            setIsSubmittingFinish(true)

            const completeResponse = await setUserTestSessionComplete({
                id: sessionId,
                isComplete: isComplete,
            })

            await Promise.all([
                completeResponse.userLevel
                    ? changeGrade({ userId, grade: completeResponse.userLevel })
                    : Promise.resolve(),
                createRecommendations({ userId }),
            ])

            const result = await calculateTestResult()
            setTestResult(result)
        } catch (e) {
            console.error("Ошибка при завершении тестовой сессии", e)
        } finally {
            setIsSubmittingFinish(false)
            setIsFinishModalOpen(false)
        }
    }

    const handleFinishClick = (isComplete: boolean) => {
        const unanswered = questions.filter(
            (question) => selectedAnswers[question.id] === undefined
        )

        if (unanswered.length > 0) {
            setIsFinishModalOpen(true)
            return
        }

        handleExit(isComplete)
    }

    const handleGoToTests = () => {
        navigate("/tests")
    }

    // const handleRetry = () => {
    //     navigate(`/tests/${testId}`)
    // }

    const handleRetry = async () => {
        if (userId === null) {
            setError("Не удалось определить пользователя из JWT токена.")
            return
        }

        try {
            const response = await createUserTestSession({
                userId,
                testId: testId,
            })

            navigate(`/tests/${testId}?sessionId=${response.id}`)
        } catch (e) {
            console.error("Ошибка при создании тестовой сессии", e)
        }
    }

    if (isLoadingQuestions) {
        return <Loader />
    }

    if (userId === null) {
        return <ErrorLoad message="Не удалось определить пользователя из JWT токена." />
    }

    if (error) {
        return <ErrorLoad />
    }

    if (isEmpty) {
        return <NotFound message="Вопросы не найдены... Попробуйте позже" />
    }

    if (!currentQuestion && !testResult) {
        return <NotFound message="Вопрос не найден" />
    }

    const answeredCount = questions.filter(
        (question) => selectedAnswers[question.id] !== undefined
    ).length

    const progressPercent =
        questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0

    if (testResult) {
        return (
            <TestResultCard 
                result={testResult}
                elapsedSeconds={elapsedSeconds}
                onGoToTests={handleGoToTests}
                onRetry={handleRetry}
            />
        )
    }

    return (
        <>
            <div className="mx-auto max-w-3xl space-y-4 p-4 sm:py-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Прохождение теста
                    </h1>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600">
                        {currentIndex + 1} / {questions.length}
                    </span>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Время прохождения</p>
                            <p className="text-xl font-semibold text-slate-950">
                                {formatTime(elapsedSeconds)}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-slate-500">Прогресс</p>
                            <p className="text-xl font-semibold text-slate-950">
                                {progressPercent}%
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="mb-1 flex justify-between text-sm text-slate-500">
                            <span>Отвечено: {answeredCount} из {questions.length}</span>
                            <span>{progressPercent}%</span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full rounded-full bg-slate-950 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <QuestionCard question={currentQuestion} />

                <div className="space-y-3">
                    {isLoadingAnswers ? (
                        <Loader />
                    ) : answers.length > 0 ? (
                        answers.map((answer) => (
                            <AnswerCard
                                key={answer.id}
                                answer={answer}
                                selectedAnswerId={selectedAnswerId}
                                isAnswered={!!selectedAnswers[currentQuestion.id]}
                                onSelect={handleSelectAnswer}
                            />
                        ))
                    ) : (
                        <NotFound message="Ответы не найдены" />
                    )}
                </div>

                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Назад
                    </button>

                    <button
                        type="button"
                        onClick={() => handleFinishClick(true)}
                        disabled={isSubmittingFinish}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmittingFinish ? "Завершение..." : "Завершить тест"}
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentIndex === questions.length - 1}
                        className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Далее
                    </button>
                </div>
            </div>

            {isFinishModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-[1px]">
                    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20">
                        <h2 className="mb-3 text-xl font-semibold text-slate-950">
                            Вы ответили не на все вопросы
                        </h2>

                        <p className="mb-4 text-sm leading-6 text-slate-600">
                            Вы уверены, что хотите завершить тест?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsFinishModalOpen(false)}
                                disabled={isSubmittingFinish}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Отмена
                            </button>

                            <button
                                type="button"
                                onClick={() => handleExit(false)}
                                disabled={isSubmittingFinish}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {isSubmittingFinish ? "Завершение..." : "Всё равно завершить"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
