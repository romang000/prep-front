import { Header } from "@/shared/ui/Header"
import { Sidebar } from "@/shared/ui/Sidebar"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Loader } from "@/shared/ui/Loader"
import { Pagination } from "@/shared/ui/Pagination"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { getMaterials } from "@/features/materials/api/getMaterials"
import type { MaterialGetResponse, PageDto } from "@/features/materials/model/types"
import { MaterialSubtopicsList } from "@/features/materials/ui/MaterialSubtopicsList"
import { useAuth } from "@/features/auth/model/useAuth"
import { TopBar } from "@/shared/ui/TopBar"
import { getMainMenuItems } from "@/shared/navigation/menuItems"
import { getProfile } from "@/features/profile/api/getProfile"

const LEVEL_OPTIONS = [
    { label: "Все уровни", value: "" },
    { label: "Junior", value: "JUNIOR" },
    { label: "Middle", value: "MIDDLE" },
    { label: "Senior", value: "SENIOR" },
]

export function MaterialSubtopicsPage() {
    const navigate = useNavigate()
    const { topicId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const { userId } = useAuth()

    const selectedTopicId = topicId ? Number(topicId) : NaN
    const levelFromSearch = searchParams.get("level")
    const selectedTopicTitle = searchParams.get("title") ?? "Материалы"

    const menuItems = getMainMenuItems(userId)

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize] = useState(10)
    const [selectedLevel, setSelectedLevel] = useState(levelFromSearch ?? "")
    const [isFiltersLoading, setIsFiltersLoading] = useState(true)
    const hasInitializedLevel = useRef(false)

    const [data, setData] = useState<PageDto<MaterialGetResponse> | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (hasInitializedLevel.current) {
            return
        }

        hasInitializedLevel.current = true

        if (levelFromSearch !== null) {
            setSelectedLevel(levelFromSearch)
            setIsFiltersLoading(false)
            return
        }

        const loadProfileLevel = async () => {
            try {
                setIsFiltersLoading(true)

                const profile = await getProfile()

                setSelectedLevel(profile.grade ?? "")
            } catch (e) {
                console.error("Ошибка при загрузке уровня пользователя", e)
                setSelectedLevel("")
            } finally {
                setIsFiltersLoading(false)
            }
        }

        loadProfileLevel()
    }, [levelFromSearch])

    useEffect(() => {
        if (isFiltersLoading) {
            return
        }

        if (Number.isNaN(selectedTopicId)) {
            setError("Тема материала не указана.")
            setIsLoading(false)
            return
        }

        if (userId === null) {
            setError("Не удалось определить пользователя из JWT токена.")
            setIsLoading(false)
            return
        }

        const loadSubtopics = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await getMaterials({
                    userId,
                    topicId: selectedTopicId,
                    level: selectedLevel || undefined,
                    pageNumber,
                    pageSize,
                })

                setData(response)
            } catch (e) {
                console.error("Ошибка при загрузке подтем материалов", e)
                setError("Не удалось загрузить подтемы материалов. Пожалуйста, попробуйте позже.")
            } finally {
                setIsLoading(false)
            }
        }

        loadSubtopics()
    }, [selectedTopicId, pageNumber, pageSize, selectedLevel, userId, isFiltersLoading])

    const subtopicMaterials = useMemo(() => {
        const materials = data?.content ?? []

        const uniqueBySubtopic = new Map<string, MaterialGetResponse>()

        materials.forEach((material) => {
            if (!material.subtopic) return

            if (!uniqueBySubtopic.has(material.subtopic)) {
                uniqueBySubtopic.set(material.subtopic, material)
            }
        })

        return Array.from(uniqueBySubtopic.values())
    }, [data])

    const handleBackToTopics = () => {
        navigate("/materials")
    }

    function handleLevelChange(level: string) {
        setSelectedLevel(level)
        setPageNumber(0)

        const nextSearchParams = new URLSearchParams(searchParams)

        if (level) {
            nextSearchParams.set("level", level)
        } else {
            nextSearchParams.delete("level")
        }

        if (selectedTopicTitle) {
            nextSearchParams.set("title", selectedTopicTitle)
        }

        setSearchParams(nextSearchParams)
    }

    const handleSubtopicClick = (material: MaterialGetResponse) => {
        navigate(`/materials/${material.id}/files/${material.fileId}`)
    }

    if (userId === null) {
        return <ErrorLoad message="Не удалось определить пользователя из JWT токена." />
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
                    backLabel="← К темам"
                    onBackClick={handleBackToTopics}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
                    <Header
                        title={selectedTopicTitle}
                        description="Выберите подтему, чтобы перейти к учебному материалу."
                    />

                    <div className="mb-8 max-w-xs rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                    </div>

                    <div className="mt-8">
                        {(isFiltersLoading || isLoading) && <Loader />}

                        {!isFiltersLoading && !isLoading && error && (
                            <ErrorLoad message={error} />
                        )}

                        {!isFiltersLoading && !isLoading && !error && (
                            <MaterialSubtopicsList
                                materials={subtopicMaterials}
                                userId={userId}
                                onSubtopicClick={handleSubtopicClick}
                            />
                        )}
                    </div>
                </div>

                {!isFiltersLoading && !isLoading && !error && data && (
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
