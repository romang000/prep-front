import type { TestResult } from "../model/types"

type TestResultCardProps = {
    result: TestResult
    elapsedSeconds: number
    onGoToTests: () => void
    onRetry: () => void
}

export function TestResultCard(props: TestResultCardProps) {
    const { result, elapsedSeconds, onGoToTests, onRetry } = props

    const radius = 38
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset =
        circumference * (1 - result.percent / 100)
    const progressColor = getProgressStrokeColor(result.percent)

    function getProgressStrokeColor(percent: number) {
        if (percent >= 80) {
            return "#22C55E"
        }

        if (percent >= 50) {
            return "#F59E0B"
        }

        return "#EF4444"
    }

    function formatTime(totalSeconds: number) {
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Тест завершён
                </h1>

                <div className="flex justify-center">
                    <div className="relative flex items-center justify-center w-44 h-44">
                        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke="#E5E7EB"
                                strokeWidth="10"
                                fill="none"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke={progressColor}
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>

                        <div className="absolute text-3xl font-bold text-gray-900">
                            {result.percent}%
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-lg">
                    Время прохождения: {formatTime(elapsedSeconds)}
                </p>

                <div className="rounded-xl bg-orange-100 px-4 py-3 text-center">
                    <p className="font-semibold text-orange-500">
                        {result.message}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-100 p-5 text-center">
                        <div className="text-4xl font-bold text-gray-900">
                            {result.correctCount}
                        </div>
                        <div className="text-gray-500 mt-1">Правильных</div>
                    </div>

                    <div className="rounded-xl bg-gray-100 p-5 text-center">
                        <div className="text-4xl font-bold text-gray-900">
                            {result.wrongCount}
                        </div>
                        <div className="text-gray-500 mt-1">Ошибок</div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <button
                        type="button"
                        onClick={onGoToTests}
                        className="w-full rounded-xl bg-gray-200 py-3 text-lg font-medium text-blue-600"
                    >
                        Продолжить
                    </button>

                    <button
                        type="button"
                        onClick={onRetry}
                        className="w-full rounded-xl bg-blue-600 py-3 text-lg font-medium text-white"
                    >
                        Пройти ещё раз
                    </button>
                </div>
            </div>
        </div>
    )
}