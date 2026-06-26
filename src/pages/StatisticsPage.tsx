import { useEffect, useState } from "react"
import { Loader } from "@/shared/ui/Loader"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { Header } from "@/shared/ui/Header"
import { Sidebar } from "@/shared/ui/Sidebar"
import type {
    SubtopicStatisticsResponse,
    TopicStatisticsResponse,
} from "@/features/statistic/model/types"
import { getAllUserTopicStats } from "@/features/statistic/api/getUserTopicStats"
import { getUserTopicStatsByTopic } from "@/features/statistic/api/getUserTopicStatsByTopic"
import { UserTopicStatsList } from "@/features/statistic/ui/UserTopicStatsList"
import { UserSubtopicStatsList } from "@/features/statistic/ui/UserSubtopicStatsList"
import { RecommendationPanel } from "@/features/recommendation/ui/RecommendationPanel"
import { useAuth } from "@/features/auth/model/useAuth"
import { TopBar } from "@/shared/ui/TopBar"
import { getMainMenuItems } from "@/shared/navigation/menuItems"

export function StatisticsPage() {
    const { userId } = useAuth()

    const menuItems = getMainMenuItems(userId)

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false)

    const [topicStats, setTopicStats] = useState<TopicStatisticsResponse[]>([])
    const [subtopicStats, setSubtopicStats] = useState<SubtopicStatisticsResponse[]>([])

    const [selectedTopicTitle, setSelectedTopicTitle] = useState<string | null>(null)

    const [isLoadingTopics, setIsLoadingTopics] = useState(false)
    const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (userId === null) {
            setError("Не удалось определить пользователя из JWT токена.")
            return
        }

        const currentUserId = userId

        async function loadTopicStats() {
            try {
                setIsLoadingTopics(true)
                setError(null)

                const data = await getAllUserTopicStats(currentUserId)
                setTopicStats(data)
            } catch {
                setError("Не удалось загрузить статистику по темам")
            } finally {
                setIsLoadingTopics(false)
            }
        }

        loadTopicStats()
    }, [userId])

    async function handleTopicClick(topicId: number, topicTitle: string) {
        if (userId === null) {
            setError("Не удалось определить пользователя из JWT токена.")
            return
        }

        try {
            setSelectedTopicTitle(topicTitle)
            setIsLoadingSubtopics(true)
            setError(null)

            const data = await getUserTopicStatsByTopic({
                userId,
                topicId,
            })

            setSubtopicStats(data)
        } catch {
            setError("Не удалось загрузить статистику по подтемам")
        } finally {
            setIsLoadingSubtopics(false)
        }
    }

    function handleBackToTopics() {
        setSelectedTopicTitle(null)
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
                <TopBar
                    onMenuClick={() => setIsMenuOpen(true)}
                    rightContent={
                        <button
                            type="button"
                            onClick={() => setIsRecommendationsOpen((current) => !current)}
                            disabled={userId === null}
                            className="rounded-lg bg-slate-950 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {isRecommendationsOpen
                                ? "Скрыть рекомендации"
                                : "Показать рекомендации"}
                        </button>
                    }
                />

                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
                    {!selectedTopicTitle ? (
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
                                    title={`Подтемы: ${selectedTopicTitle}`}
                                    description="Детальная статистика пользователя по подтемам."
                                />

                                <button
                                    type="button"
                                    onClick={handleBackToTopics}
                                    className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
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

                    {isRecommendationsOpen && userId !== null && (
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
