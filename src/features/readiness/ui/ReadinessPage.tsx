import { useEffect, useMemo, useState } from "react"
import { getMyReadiness, recalculateReadiness } from "@/features/readiness/api/readinessApi"
import type {
    ProgressStatus,
    ReadinessResponse,
    ReadinessStatus,
} from "@/features/readiness/model/types"
import { useAuth } from "@/features/auth/model/useAuth"
import { getMainMenuItems } from "@/shared/navigation/menuItems"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { Header } from "@/shared/ui/Header"
import { Loader } from "@/shared/ui/Loader"
import { Sidebar } from "@/shared/ui/Sidebar"
import { TopBar } from "@/shared/ui/TopBar"

const READINESS_THRESHOLD = 70

const readinessLabels: Record<ReadinessStatus, string> = {
    NOT_ENOUGH_DATA: "Недостаточно данных",
    NOT_READY: "Пока не готов",
    READY: "Готов к собеседованию",
}

const readinessDescriptions: Record<ReadinessStatus, string> = {
    NOT_ENOUGH_DATA:
        "Пройдите больше тестов, чтобы система могла объективно оценить подготовку.",
    NOT_READY: "Продолжайте подготовку и повторите слабые темы.",
    READY: "Текущий уровень подготовки соответствует заданному критерию готовности.",
}

const progressLabels: Record<ProgressStatus, string> = {
    NOT_ENOUGH_DATA: "Недостаточно данных для анализа динамики",
    POSITIVE: "Положительная динамика",
    STABLE: "Стабильная динамика",
    NEGATIVE: "Отрицательная динамика",
}

const readinessStyles: Record<ReadinessStatus, string> = {
    NOT_ENOUGH_DATA: "border-slate-200 bg-slate-50 text-slate-700",
    NOT_READY: "border-amber-200 bg-amber-50 text-amber-800",
    READY: "border-emerald-200 bg-emerald-50 text-emerald-800",
}

const progressStyles: Record<ProgressStatus, string> = {
    NOT_ENOUGH_DATA: "border-slate-200 bg-slate-50 text-slate-700",
    POSITIVE: "border-emerald-200 bg-emerald-50 text-emerald-800",
    STABLE: "border-sky-200 bg-sky-50 text-sky-800",
    NEGATIVE: "border-red-200 bg-red-50 text-red-700",
}

type ChartPoint = {
    label: string
    value: number
}

export function ReadinessPage() {
    const { userId } = useAuth()
    const menuItems = getMainMenuItems(userId)

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [readiness, setReadiness] = useState<ReadinessResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRecalculating, setIsRecalculating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const chartPoints = useMemo(() => {
        if (!readiness || readiness.previousReadinessIndex === null) {
            return []
        }

        return [
            {
                label: "Предыдущее значение",
                value: readiness.previousReadinessIndex,
            },
            {
                label: "Текущее значение",
                value: readiness.readinessIndex,
            },
        ]
    }, [readiness])

    useEffect(() => {
        void loadReadiness()
    }, [])

    async function loadReadiness() {
        try {
            setIsLoading(true)
            setError(null)

            const data = await getMyReadiness()
            setReadiness(data)
        } catch (e) {
            console.error("Ошибка при загрузке показателя готовности", e)
            setError("Не удалось загрузить показатель готовности.")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleRecalculate() {
        try {
            setIsRecalculating(true)
            setError(null)

            const data = await recalculateReadiness()
            setReadiness(data)
        } catch (e) {
            console.error("Ошибка при пересчете показателя готовности", e)
            setError("Не удалось обновить показатель готовности.")
        } finally {
            setIsRecalculating(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                items={menuItems}
            />

            <div className="mx-auto max-w-6xl px-6 py-8">
                <TopBar onMenuClick={() => setIsMenuOpen(true)} />

                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
                    <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
                        <Header
                            title="Готовность к собеседованию"
                            description="Показатель отражает текущий уровень подготовки пользователя на основе статистики прохождения тестов."
                        />

                    </div>

                    {isLoading && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-center text-sm font-medium text-slate-600">
                                Загрузка показателя готовности...
                            </p>
                            <Loader />
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="space-y-4">
                            <ErrorLoad message={error} />
                            <button
                                type="button"
                                onClick={loadReadiness}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                Повторить
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && readiness && (
                        <div className="space-y-6">
                            <ReadinessOverview readiness={readiness} />

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <StatusCard
                                    title="Статус динамики"
                                    value={progressLabels[readiness.progressStatus]}
                                    description="Изменение уровня подготовки относительно прошлого расчета."
                                    className={progressStyles[readiness.progressStatus]}
                                />
                                <MetricCard
                                    title="Изменение показателя"
                                    value={formatDelta(readiness.readinessDelta)}
                                />
                                <MetricCard
                                    title="Оцененные темы"
                                    value={formatNumber(readiness.evaluatedTopicCount)}
                                />
                                <MetricCard
                                    title="Освоенные темы"
                                    value={formatNumber(readiness.masteredTopicCount)}
                                />
                                <MetricCard
                                    title="Слабые темы"
                                    value={formatNumber(readiness.weakTopicCount)}
                                    tone={readiness.weakTopicCount > 0 ? "danger" : "default"}
                                />
                                <MetricCard
                                    title="Покрытие подготовки"
                                    value={formatPercent(readiness.coverage)}
                                />
                            </div>

                            <ProgressChart points={chartPoints} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ReadinessOverview({ readiness }: { readiness: ReadinessResponse }) {
    const safeReadiness = clampPercent(readiness.readinessIndex)
    const isEnoughData = readiness.readinessStatus !== "NOT_ENOUGH_DATA"

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Текущий уровень
                            </p>
                            <p className="mt-1 text-4xl font-semibold text-slate-950">
                                {formatNumber(safeReadiness)}%
                            </p>
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                            Порог готовности: {READINESS_THRESHOLD}%
                        </p>
                    </div>

                    <div className="mt-7">
                        <ReadinessScale
                            value={safeReadiness}
                            status={readiness.readinessStatus}
                        />

                        {!isEnoughData && (
                            <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                                Данных пока недостаточно. Пройдите больше тестов, чтобы
                                система рассчитала показатель увереннее.
                            </p>
                        )}
                    </div>
                </div>

                <StatusCard
                    title="Статус готовности"
                    value={readinessLabels[readiness.readinessStatus]}
                    description={readinessDescriptions[readiness.readinessStatus]}
                    className={readinessStyles[readiness.readinessStatus]}
                />
            </div>
        </div>
    )
}

function ReadinessScale({
    value,
    status,
}: {
    value: number
    status: ReadinessStatus
}) {
    const fillColor =
        status === "READY"
            ? "#10b981"
            : status === "NOT_READY"
              ? "#f59e0b"
              : "#94a3b8"
    const textClass =
        status === "READY"
            ? "text-emerald-700"
            : status === "NOT_READY"
              ? "text-amber-700"
              : "text-slate-600"

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-700">Шкала готовности</p>
                <p className={`text-sm font-semibold ${textClass}`}>
                    Ваш уровень: {formatNumber(value)}%
                </p>
            </div>

            <div
                className="h-6 overflow-hidden rounded-full"
                style={{ backgroundColor: "#e2e8f0" }}
            >
                <div
                    className="h-full rounded-full"
                    style={{ width: `${value}%`, backgroundColor: fillColor }}
                    aria-label={`Готовность заполнена на ${formatNumber(value)}%`}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={value}
                />
            </div>

            <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>0%</span>
                <span>100%</span>
            </div>
        </div>
    )
}

function StatusCard({
    title,
    value,
    description,
    className,
}: {
    title: string
    value: string
    description: string
    className: string
}) {
    return (
        <div className={`rounded-xl border p-5 ${className}`}>
            <p className="text-xs font-semibold uppercase text-current opacity-75">
                {title}
            </p>
            <p className="mt-2 text-xl font-semibold text-current">{value}</p>
            <p className="mt-3 text-sm leading-6 text-current opacity-85">{description}</p>
        </div>
    )
}

function MetricCard({
    title,
    value,
    tone = "default",
}: {
    title: string
    value: string
    tone?: "default" | "danger"
}) {
    const toneClass =
        tone === "danger"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-slate-200 bg-white text-slate-950"

    return (
        <div className={`rounded-xl border p-5 shadow-sm shadow-slate-950/5 ${toneClass}`}>
            <p className="text-xs font-semibold uppercase text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
    )
}

function ProgressChart({ points }: { points: ChartPoint[] }) {
    if (points.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                <h2 className="text-xl font-semibold text-slate-950">
                    Динамика прогресса
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Динамика появится после повторного расчета показателя готовности.
                </p>
            </div>
        )
    }

    const previousValue = clampPercent(points[0]?.value ?? 0)
    const currentValue = clampPercent(points[points.length - 1]?.value ?? 0)
    const delta = currentValue - previousValue
    const deltaTone =
        delta > 0 ? "text-emerald-700" : delta < 0 ? "text-red-700" : "text-slate-600"
    const deltaLabel = delta > 0 ? `+${formatNumber(delta)}%` : `${formatNumber(delta)}%`

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-950">
                    Динамика прогресса
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Изменение показателя готовности между последними расчетами.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <ProgressValueCard label="Предыдущее значение" value={previousValue} />

                <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-500 md:flex-col">
                    <span className={`text-base ${deltaTone}`}>{deltaLabel}</span>
                    <span className="h-px w-16 bg-slate-300 md:h-12 md:w-px" />
                    <span>изменение</span>
                </div>

                <ProgressValueCard label="Текущее значение" value={currentValue} />
            </div>
        </div>
    )
}

function ProgressValueCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
                {formatNumber(value)}%
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    )
}

function clampPercent(value: number) {
    if (!Number.isFinite(value)) {
        return 0
    }

    return Math.min(Math.max(value, 0), 100)
}

function formatNumber(value: number | null | undefined) {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return "Нет данных"
    }

    return value.toFixed(2)
}

function formatDelta(value: number | null) {
    if (value === null || !Number.isFinite(value)) {
        return "Нет данных"
    }

    if (value > 0) {
        return `+${value.toFixed(2)}%`
    }

    return `${value.toFixed(2)}%`
}

function formatPercent(value: number | null | undefined) {
    const formattedValue = formatNumber(value)

    return formattedValue === "Нет данных" ? formattedValue : `${formattedValue}%`
}
