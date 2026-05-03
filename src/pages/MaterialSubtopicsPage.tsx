import { Header } from "@/shared/ui/Header"
import { Sidebar, type MenuItem } from "@/shared/ui/Sidebar"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Loader } from "@/shared/ui/Loader"
import { Pagination } from "@/shared/ui/Pagination"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { getMaterials } from "@/features/materials/api/getMaterials"
import type { MaterialGetResponse, PageDto } from "@/features/materials/model/types"
import { MaterialSubtopicsList } from "@/features/materials/ui/MaterialSubtopicsList"

export function MaterialSubtopicsPage() {
    const CURRENT_USER_ID = 1 // TODO: заменить на реальный ID текущего пользователя из контекста аутентификации

    const navigate = useNavigate()
    const { topic } = useParams()

    const selectedTopic = topic ? decodeURIComponent(topic) : ""

    const menuItems: MenuItem[] = [
        { label: "Главная", to: "/" },
        { label: "Тесты", to: "/tests" },
        { label: "Материалы", to: "/materials" },
        { label: "Статистика по темам", to: `/statistics/users/${CURRENT_USER_ID}` },
        { label: "Профиль", to: "/profile" },
    ]

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize] = useState(10)

    const [data, setData] = useState<PageDto<MaterialGetResponse> | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!selectedTopic) {
            setError("Тема материала не указана.")
            setIsLoading(false)
            return
        }

        const loadSubtopics = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await getMaterials({
                    userId: CURRENT_USER_ID,
                    topic: selectedTopic,
                    level: "JUNIOR",
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
    }, [selectedTopic, pageNumber, pageSize])

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

    const handleSubtopicClick = (material: MaterialGetResponse) => {
        navigate(`/materials/${material.id}/files/${material.fileId}`)
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
                        onClick={handleBackToTopics}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        ← К темам
                    </button>
                </div>

                <div className="rounded-[28px] bg-slate-50 p-8 shadow-sm">
                    <Header
                        title={selectedTopic}
                        description="Выберите подтему, чтобы перейти к учебному материалу."
                    />

                    <div className="mt-8">
                        {isLoading && <Loader />}

                        {!isLoading && error && (
                            <ErrorLoad message={error} />
                        )}

                        {!isLoading && !error && (
                            <MaterialSubtopicsList
                                materials={subtopicMaterials}
                                userId={CURRENT_USER_ID}
                                onSubtopicClick={handleSubtopicClick}
                            />
                        )}
                    </div>
                </div>

                {!isLoading && !error && data && (
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