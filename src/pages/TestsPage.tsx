import { getTests } from "@/features/tests/api/getTests";
import type { PageDto, TestResponse } from "@/features/tests/model/types";
import { TestsList } from "@/features/tests/ui/TestsList";
import { ErrorLoad } from "@/shared/ui/ErrorLoad";
import { Header } from "@/shared/ui/Header";
import { Loader } from "@/shared/ui/Loader";
import { Pagination } from "@/shared/ui/Pagination";
import { Sidebar, type MenuItem } from "@/shared/ui/Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/model/useAuth";
import { TopBar } from "@/shared/ui/TopBar";

export function TestsPage() {
    const { userId } = useAuth()

    const menuItems: MenuItem[] = [
        { label: "Главная", to: "/" },
        { label: "Тесты", to: "/tests" },
        { label: "Материалы", to: "/materials" },
        { label: "Статистика по темам", to: `/statistics/users/${userId ?? ""}` },
        { label: "Профиль", to: "/profile" },
    ]

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(6);

    const [data, setData] = useState<PageDto<TestResponse> | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        async function loadTests() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getTests({ pageNumber, pageSize });
                setData(response);
            } catch (e) {
                console.error("Ошибка при загрузке тестов", e);
                setError("Не удалось загрузить тесты. Пожалуйста, попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        }

        loadTests();
    }, [pageNumber, pageSize]);

    const tests = data?.content ?? [];

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
                <TopBar onMenuClick={() => setIsMenuOpen(true)} />

                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
                    <Header
                        title="Список тестов"
                        description="Все доступные тесты для подготовки к собеседованиям. Выбирайте и начинайте практиковаться прямо сейчас!"
                    />

                    <div className="mt-8">
                        {isLoading && <Loader />}

                        {!isLoading && error && (
                            <ErrorLoad message={error} />
                        )}

                        {!isLoading && !error && (
                            <TestsList tests={tests} userId={userId} />
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
                                prev < data.totalPages - 1 ? prev + 1 : prev
                            )
                        }
                        isPreviousDisabled={data.pageNumber === 0}
                        isNextDisabled={data.pageNumber >= data.totalPages - 1}
                    />
                )}
            </div>
        </div>
    );
}
