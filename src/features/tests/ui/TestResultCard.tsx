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
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/10">
                <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-950">
                    Тест завершён
                </h1>

                <div className="flex justify-center">
                    <div className="relative flex items-center justify-center w-44 h-44">
                        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke="#E2E8F0"
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

                        <div className="absolute text-3xl font-semibold text-slate-950">
                            {result.percent}%
                        </div>
                    </div>
                </div>

                <p className="text-center text-lg text-slate-500">
                    Время прохождения: {formatTime(elapsedSeconds)}
                </p>

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center">
                    <p className="font-semibold text-amber-700">
                        {result.message}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
                        <div className="text-4xl font-semibold text-slate-950">
                            {result.correctCount}
                        </div>
                        <div className="mt-1 text-slate-500">Правильных</div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
                        <div className="text-4xl font-semibold text-slate-950">
                            {result.wrongCount}
                        </div>
                        <div className="mt-1 text-slate-500">Ошибок</div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <button
                        type="button"
                        onClick={onGoToTests}
                        className="w-full rounded-lg border border-slate-300 bg-white py-3 text-lg font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                        Продолжить
                    </button>

                    <button
                        type="button"
                        onClick={onRetry}
                        className="w-full rounded-lg bg-slate-950 py-3 text-lg font-medium text-white transition hover:bg-slate-800"
                    >
                        Пройти ещё раз
                    </button>
                </div>
            </div>
        </div>
    )
}
