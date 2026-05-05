import { useEffect, useState } from "react"
import { Loader } from "@/shared/ui/Loader"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import type { RecommendationCreateResponse } from "@/features/recommendation/model/types"
import { getRecommendations } from "../api/getRecommendations"

type RecommendationPanelProps = {
    userId: number
    onClose: () => void
}

export function RecommendationPanel({
    userId,
    onClose,
}: RecommendationPanelProps) {
    const [recommendations, setRecommendations] = useState<RecommendationCreateResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadRecommendations() {
            try {
                setIsLoading(true)
                setError(null)

                const data = await getRecommendations(userId)
                setRecommendations(data)
            } catch {
                setError("Не удалось загрузить рекомендации")
            } finally {
                setIsLoading(false)
            }
        }

        loadRecommendations()
    }, [userId])

    return (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Рекомендации для подготовки
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Список тем и подтем, на которые пользователю стоит обратить внимание.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                    Скрыть
                </button>
            </div>

            {isLoading && <Loader />}

            {!isLoading && error && <ErrorLoad message={error} />}

            {!isLoading && !error && recommendations.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                    Рекомендации пока отсутствуют.
                </div>
            )}

            {!isLoading && !error && recommendations.length > 0 && (
                <div className="space-y-4">
                    {recommendations.map((recommendation) => (
                        <article
                            key={`${recommendation.targetId}-${recommendation.topic}-${recommendation.subtopic}`}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                        >
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        {recommendation.topic}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Подтема: {recommendation.subtopic}
                                    </p>
                                </div>

                                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                                    Приоритет: {recommendation.priority}
                                </span>
                            </div>

                            <p className="text-sm leading-6 text-slate-700">
                                {recommendation.reason}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                                <span className="rounded-full bg-white px-3 py-1">
                                    Тип: {recommendation.recommendationType}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}