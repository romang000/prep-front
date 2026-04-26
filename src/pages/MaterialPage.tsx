import { Header } from "@/shared/ui/Header";
import { Sidebar, type MenuItem } from "@/shared/ui/Sidebar";
import { useEffect, useState } from "react";
import { getMaterials } from "@/features/materials/api/getMaterials";
import type { MaterialGetResponse, PageDto } from "@/features/materials/model/types";
import { Loader } from "@/shared/ui/Loader";
import { MaterialsList } from "@/features/materials/ui/MaterialList";
import { Pagination } from "@/shared/ui/Pagination";

export function MaterialPage() {
    const menuItems: MenuItem[] = [
        { label: "Главная", to: "/" },
        { label: "Тесты", to: "/tests" },
        { label: "Материалы", to: "/materials" },
        { label: "Результаты", to: "/results" },
        { label: "Профиль", to: "/profile" },
    ];

    const CURRENT_USER_ID = 1; // TODO: заменить на реальный ID текущего пользователя из контекста аутентификации

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize] = useState(10);

    const [data, setData] = useState<PageDto<MaterialGetResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getMaterials({
                    userId: CURRENT_USER_ID, // TEMPORARY
                    level: "JUNIOR",
                    pageNumber,
                    pageSize,
                });

                setData(response);
            } catch (e) {
                console.error("Ошибка при загрузке материалов", e);
                setError("Не удалось загрузить материалы");
            } finally {
                setIsLoading(false);
            }
        };

        loadMaterials();
    }, [pageNumber, pageSize]);

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
                        description="Все доступные материалы для подготовки к собеседованиям."
                    />

                    <div className="mt-8">
                        {isLoading && <Loader />}

                        {!isLoading && error && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {!isLoading && !error && (
                            <MaterialsList materials={data?.content ?? []} />
                        )}
                    </div>
                </div>
                {!isLoading && !error && data && (
                    <Pagination
                        pageNumber={data.pageNumber}
                        totalPages={data.totalPages}
                        onPrevious={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
                        onNext={() => setPageNumber((prev) => prev < data.totalPages - 1 ? prev + 1 : prev)}
                        isPreviousDisabled={data.pageNumber === 0}
                        isNextDisabled={data.pageNumber >= data.totalPages - 1}
                    />
                )}
            </div>
        </div>
    );
}