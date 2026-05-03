import { Header } from "@/shared/ui/Header"
import { Sidebar, type MenuItem } from "@/shared/ui/Sidebar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader } from "@/shared/ui/Loader"
import { Pagination } from "@/shared/ui/Pagination"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import type { MaterialTopicGetResponse } from "@/features/materials/model/types"
import type { PageDto } from "@/features/tests/model/types"
import { MaterialTopicsList } from "@/features/materials/ui/MaterialTopicsList"
import { getMaterialsTopics } from "@/features/materials/api/getMaterialTopics"

export function MaterialTopicsPage() {
    const CURRENT_USER_ID = 1 // TODO: заменить на реальный ID текущего пользователя из контекста аутентификации

    const navigate = useNavigate()

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

    const [data, setData] = useState<PageDto<MaterialTopicGetResponse> | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadMaterialTopics = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await getMaterialsTopics({
                    userId: CURRENT_USER_ID,
                    level: "JUNIOR",
                    pageNumber,
                    pageSize,
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
    }, [pageNumber, pageSize])

    const handleTopicClick = (topic: string) => {
        navigate(`/materials/topics/${encodeURIComponent(topic)}`)
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
                </div>

                <div className="rounded-[28px] bg-slate-50 p-8 shadow-sm">
                    <Header
                        title="Материалы"
                        description="Выберите тему, чтобы перейти к подтемам и учебным материалам."
                    />

                    <div className="mt-8">
                        {isLoading && <Loader />}

                        {!isLoading && error && (
                            <ErrorLoad message={error} />
                        )}

                        {!isLoading && !error && (
                            <MaterialTopicsList
                                topics={data?.content ?? []}
                                onTopicClick={handleTopicClick}
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