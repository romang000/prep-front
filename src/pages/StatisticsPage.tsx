import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "@/shared/ui/Loader"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { Header } from "@/shared/ui/Header"
import { Sidebar, type MenuItem } from "@/shared/ui/Sidebar"
import type {
    SubtopicStatisticsResponse,
    TopicStatisticsResponse,
} from "@/features/statistic/model/types"
import { getAllUserTopicStats } from "@/features/statistic/api/getUserTopicStats"
import { getUserTopicStatsByTopic } from "@/features/statistic/api/getUserTopicStatsByTopic"
import { UserTopicStatsList } from "@/features/statistic/ui/UserTopicStatsList"
import { UserSubtopicStatsList } from "@/features/statistic/ui/UserSubtopicStatsList"
import { RecommendationPanel } from "@/features/recommendation/ui/RecommendationPanel"

export function StatisticsPage() {
    const { id } = useParams()
    const userId = Number(id)

    const menuItems: MenuItem[] = [
        { label: "Главная", to: "/" },
        { label: "Тесты", to: "/tests" },
        { label: "Материалы", to: "/materials" },
        { label: "Статистика по темам", to: `/statistics/users/${userId}` },
        { label: "Профиль", to: "/profile" },
    ]

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false)

    const [topicStats, setTopicStats] = useState<TopicStatisticsResponse[]>([])
    const [subtopicStats, setSubtopicStats] = useState<SubtopicStatisticsResponse[]>([])

    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

    const [isLoadingTopics, setIsLoadingTopics] = useState(false)
    const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadTopicStats() {
            try {
                setIsLoadingTopics(true)
                setError(null)

                const data = await getAllUserTopicStats(userId)
                setTopicStats(data)
            } catch {
                setError("Не удалось загрузить статистику по темам")
            } finally {
                setIsLoadingTopics(false)
            }
        }

        if (!Number.isNaN(userId)) {
            loadTopicStats()
        } else {
            setError("Некорректный идентификатор пользователя")
        }
    }, [userId])

    async function handleTopicClick(topic: string) {
        try {
            setSelectedTopic(topic)
            setIsLoadingSubtopics(true)
            setError(null)

            const data = await getUserTopicStatsByTopic({
                userId,
                topic,
            })

            setSubtopicStats(data)
        } catch {
            setError("Не удалось загрузить статистику по подтемам")
        } finally {
            setIsLoadingSubtopics(false)
        }
    }

    function handleBackToTopics() {
        setSelectedTopic(null)
        setSubtopicStats([])
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                items={menuItems}
            />

            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        ☰ Меню
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsRecommendationsOpen((current) => !current)}
                        disabled={Number.isNaN(userId)}
                        className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        {isRecommendationsOpen
                            ? "Скрыть рекомендации"
                            : "Показать рекомендации"}
                    </button>
                </div>

                <div className="rounded-[28px] bg-slate-50 p-8 shadow-sm">
                    {!selectedTopic ? (
                        <>
                            <Header
                                title="Статистика по темам"
                                description="Выберите тему, чтобы посмотреть детальную статистику по подтемам."
                            />

                            <div className="mt-8">
                                {isLoadingTopics && <Loader />}

                                {!isLoadingTopics && error && (
                                    <ErrorLoad message={error} />
                                )}

                                {!isLoadingTopics && !error && (
                                    <UserTopicStatsList
                                        statistics={topicStats}
                                        onTopicClick={handleTopicClick}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <Header
                                    title={`Подтемы: ${selectedTopic}`}
                                    description="Детальная статистика пользователя по подтемам."
                                />

                                <button
                                    type="button"
                                    onClick={handleBackToTopics}
                                    className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Назад к темам
                                </button>
                            </div>

                            {isLoadingSubtopics && <Loader />}

                            {!isLoadingSubtopics && error && (
                                <ErrorLoad message={error} />
                            )}

                            {!isLoadingSubtopics && !error && (
                                <UserSubtopicStatsList statistics={subtopicStats} />
                            )}
                        </>
                    )}

                    {isRecommendationsOpen && !Number.isNaN(userId) && (
                        <RecommendationPanel
                            userId={userId}
                            onClose={() => setIsRecommendationsOpen(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}