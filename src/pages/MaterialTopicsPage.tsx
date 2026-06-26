import { Header } from "@/shared/ui/Header"
import { Sidebar } from "@/shared/ui/Sidebar"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader } from "@/shared/ui/Loader"
import { Pagination } from "@/shared/ui/Pagination"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import type { MaterialTopicGetResponse, PageDto } from "@/features/materials/model/types"
import { MaterialTopicsList } from "@/features/materials/ui/MaterialTopicsList"
import { getMaterialsTopics } from "@/features/materials/api/getMaterialTopics"
import { useAuth } from "@/features/auth/model/useAuth"
import { TopBar } from "@/shared/ui/TopBar"
import { getProfile } from "@/features/profile/api/getProfile"
import { getLearningTracks } from "@/features/learningTracks/api/getLearningTracks"
import type { LearningTrack } from "@/features/learningTracks/model/types"
import { getMainMenuItems } from "@/shared/navigation/menuItems"

const LEVEL_OPTIONS = [
    { label: "Все уровни", value: "" },
    { label: "Junior", value: "JUNIOR" },
    { label: "Middle", value: "MIDDLE" },
    { label: "Senior", value: "SENIOR" },
]

export function MaterialTopicsPage() {
    const navigate = useNavigate()
    const { userId } = useAuth()

    const menuItems = getMainMenuItems(userId)

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize] = useState(10)
    const [selectedLevel, setSelectedLevel] = useState("")
    const [selectedLearningTrackId, setSelectedLearningTrackId] = useState("")
    const [learningTracks, setLearningTracks] = useState<LearningTrack[]>([])
    const [isFiltersLoading, setIsFiltersLoading] = useState(true)
    const [topicSearch, setTopicSearch] = useState("")

    const [data, setData] = useState<PageDto<MaterialTopicGetResponse> | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const normalizedTopicSearch = topicSearch.trim().toLowerCase()
    const isTopicSearchActive = normalizedTopicSearch.length > 0

    const filteredTopics = useMemo(() => {
        const topics = data?.content ?? []

        if (!normalizedTopicSearch) {
            return topics
        }

        return topics.filter((topic) =>
            topic.topicTitle.toLowerCase().includes(normalizedTopicSearch),
        )
    }, [data, normalizedTopicSearch])

    useEffect(() => {
        const loadFilters = async () => {
            try {
                setIsFiltersLoading(true)

                const [profile, learningTracks] = await Promise.all([
                    getProfile(),
                    getLearningTracks(),
                ])

                setLearningTracks(learningTracks)
                setSelectedLevel(profile.grade ?? "")
                setSelectedLearningTrackId(
                    profile.learningTrackId ? String(profile.learningTrackId) : "",
                )
            } catch (e) {
                console.error("Ошибка при загрузке фильтров материалов", e)
                setLearningTracks([])
                setSelectedLevel("")
                setSelectedLearningTrackId("")
            } finally {
                setIsFiltersLoading(false)
            }
        }

        loadFilters()
    }, [])

    useEffect(() => {
        const loadMaterialTopics = async () => {
            if (isFiltersLoading) {
                return
            }

            if (userId === null) {
                setError("Не удалось определить пользователя из JWT токена.")
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setError(null)

                const response = await getMaterialsTopics({
                    userId,
                    level: selectedLevel || undefined,
                    learningTrackId: selectedLearningTrackId
                        ? Number(selectedLearningTrackId)
                        : undefined,
                    pageNumber: isTopicSearchActive ? 0 : pageNumber,
                    pageSize: isTopicSearchActive ? 1000 : pageSize,
                })

                setData(response)
            } catch (e) {
                console.error("Ошибка при загрузке тем материалов", e)
                setError("Не удалось загрузить темы материалов. Пожалуйста, попробуйте позже.")
            } finally {
                setIsLoading(false)
            }
        }

        loadMaterialTopics()
    }, [
        pageNumber,
        pageSize,
        selectedLevel,
        selectedLearningTrackId,
        topicSearch,
        isTopicSearchActive,
        isFiltersLoading,
        userId,
    ])

    function handleLevelChange(level: string) {
        setSelectedLevel(level)
        setPageNumber(0)
    }

    function handleLearningTrackChange(learningTrackId: string) {
        setSelectedLearningTrackId(learningTrackId)
        setPageNumber(0)
    }

    function handleTopicSearchChange(value: string) {
        setTopicSearch(value)
        setPageNumber(0)
    }

    const handleTopicClick = (topic: MaterialTopicGetResponse) => {
        const searchParams = new URLSearchParams()

        if (selectedLevel) {
            searchParams.set("level", selectedLevel)
        }

        searchParams.set("title", topic.topicTitle)

        const queryString = searchParams.toString()

        navigate(
            `/materials/topics/${topic.id}${queryString ? `?${queryString}` : ""}`,
        )
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
                    <Header
                        title="Материалы"
                        description="Выберите тему, чтобы перейти к подтемам и учебным материалам."
                    />

                    <div className="mb-8 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[220px_260px_1fr]">
                        <label className="block">
                            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                                Уровень сложности
                            </span>
                            <select
                                value={selectedLevel}
                                onChange={(event) => handleLevelChange(event.target.value)}
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                            >
                                {LEVEL_OPTIONS.map((option) => (
                                    <option key={option.value || "all"} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                                Направление
                            </span>
                            <select
                                value={selectedLearningTrackId}
                                onChange={(event) => handleLearningTrackChange(event.target.value)}
                                disabled={isFiltersLoading}
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                            >
                                <option value="">
                                    {isFiltersLoading
                                        ? "Загружаем направления..."
                                        : "Все направления"}
                                </option>
                                {learningTracks.map((track) => (
                                    <option key={track.id} value={track.id}>
                                        {track.title}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                                Поиск по теме
                            </span>
                            <input
                                type="search"
                                value={topicSearch}
                                onChange={(event) => handleTopicSearchChange(event.target.value)}
                                placeholder="Например: React, JavaScript, SQL"
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm shadow-slate-950/5 transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                            />
                        </label>
                    </div>

                    <div className="mt-8">
                        {(isFiltersLoading || isLoading) && <Loader />}

                        {!isFiltersLoading && !isLoading && error && (
                            <ErrorLoad message={error} />
                        )}

                        {!isFiltersLoading && !isLoading && !error && (
                            <MaterialTopicsList
                                topics={filteredTopics}
                                onTopicClick={handleTopicClick}
                            />
                        )}
                    </div>
                </div>

                {!isFiltersLoading && !isLoading && !error && data && !isTopicSearchActive && (
                    <Pagination
                        pageNumber={data.pageNumber}
                        totalPages={data.totalPages}
                        onPrevious={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
                        onNext={() =>
                            setPageNumber((prev) =>
                                prev < data.totalPages - 1 ? prev + 1 : prev,
                            )
                        }
                        isPreviousDisabled={data.pageNumber === 0}
                        isNextDisabled={data.pageNumber >= data.totalPages - 1}
                    />
                )}
            </div>
        </div>
    )
}
