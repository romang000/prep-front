import { useEffect, useState } from "react"
import { Loader } from "@/shared/ui/Loader"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import type { RecommendationCreateResponse } from "@/features/recommendation/model/types"
import { getRecommendations } from "../api/getRecommendations"
import { Link } from "react-router-dom"

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
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
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
                    className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                    Скрыть
                </button>
            </div>

            {isLoading && <Loader />}

            {!isLoading && error && <ErrorLoad message={error} />}

            {!isLoading && !error && recommendations.length === 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">
                    Рекомендации пока отсутствуют.
                </div>
            )}

            {!isLoading && !error && recommendations.length > 0 && (
                <div className="space-y-4">
                    {recommendations.map((recommendation) => (
                        <article
                            key={`${recommendation.targetId}-${recommendation.topicTitle}-${recommendation.subtopic}`}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
                        >
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        {recommendation.topicTitle}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Подтема: {recommendation.subtopic}
                                    </p>
                                </div>

                                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                    Приоритет: {recommendation.priority}
                                </span>
                            </div>

                            <p className="text-sm leading-6 text-slate-700">
                                {recommendation.reason}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                                    Тип: {recommendation.recommendationType}
                                </span>
                            </div>

                            <div className="mt-5">
                                {recommendation.topicId === null ? (
                                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                                        На данный момент в системе материала по этой теме нет.
                                    </p>
                                ) : (
                                    <Link
                                        to={`/materials/${recommendation.topicId}`}
                                        className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                                    >
                                        Перейти к материалу
                                    </Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
