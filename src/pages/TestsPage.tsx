import { getTests } from "@/features/tests/api/getTests";
import type { PageDto, TestGrade, TestResponse } from "@/features/tests/model/types";
import { TestsList } from "@/features/tests/ui/TestsList";
import { ErrorLoad } from "@/shared/ui/ErrorLoad";
import { Header } from "@/shared/ui/Header";
import { Loader } from "@/shared/ui/Loader";
import { Pagination } from "@/shared/ui/Pagination";
import { Sidebar } from "@/shared/ui/Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/model/useAuth";
import { TopBar } from "@/shared/ui/TopBar";
import { getProfile } from "@/features/profile/api/getProfile";
import { getLearningTracks } from "@/features/learningTracks/api/getLearningTracks";
import { getTopics } from "@/features/topics/api/getTopics";
import type { Topic } from "@/features/topics/model/types";
import { getMainMenuItems } from "@/shared/navigation/menuItems";

const GRADE_OPTIONS: { label: string; value: "" | TestGrade }[] = [
    { label: "Все уровни", value: "" },
    { label: "Junior", value: "JUNIOR" },
    { label: "Middle", value: "MIDDLE" },
    { label: "Senior", value: "SENIOR" },
];

export function TestsPage() {
    const { userId } = useAuth()

    const menuItems = getMainMenuItems(userId)

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(6);
    const [selectedTopicId, setSelectedTopicId] = useState("");
    const [selectedGrade, setSelectedGrade] = useState<"" | TestGrade>("");
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isFiltersLoading, setIsFiltersLoading] = useState(true);

    const [data, setData] = useState<PageDto<TestResponse> | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        async function loadFilters() {
            try {
                setIsFiltersLoading(true);

                const [profile, learningTracks, topicsPage] = await Promise.all([
                    getProfile(),
                    getLearningTracks(),
                    getTopics(),
                ]);
                const learningTrack = learningTracks.find(
                    (track) => track.id === profile.learningTrackId,
                );
                const defaultTopicId = learningTrack?.topicIds.find((topicId) =>
                    topicsPage.content.some((topic) => topic.id === topicId),
                );

                setTopics(topicsPage.content);
                setSelectedTopicId(defaultTopicId ? String(defaultTopicId) : "");
                setSelectedGrade(profile.grade ?? "");
            } catch (e) {
                console.error("Ошибка при загрузке фильтров тестов", e);
                setTopics([]);
                setSelectedTopicId("");
                setSelectedGrade("");
            } finally {
                setIsFiltersLoading(false);
            }
        }

        loadFilters();
    }, []);

    useEffect(() => {
        if (isFiltersLoading) {
            return;
        }

        async function loadTests() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getTests({
                    pageNumber,
                    pageSize,
                    topicId: selectedTopicId ? Number(selectedTopicId) : undefined,
                    grade: selectedGrade || undefined,
                });
                setData(response);
            } catch (e) {
                console.error("Ошибка при загрузке тестов", e);
                setError("Не удалось загрузить тесты. Пожалуйста, попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        }

        loadTests();
    }, [pageNumber, pageSize, selectedTopicId, selectedGrade, isFiltersLoading]);

    function handleTopicChange(topicId: string) {
        setSelectedTopicId(topicId);
        setPageNumber(0);
    }

    function handleGradeChange(grade: "" | TestGrade) {
        setSelectedGrade(grade);
        setPageNumber(0);
    }

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

                    <div className="mb-8 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                                Тема
                            </span>
                            <select
                                value={selectedTopicId}
                                onChange={(event) => handleTopicChange(event.target.value)}
                                disabled={isFiltersLoading}
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                            >
                                <option value="">
                                    {isFiltersLoading ? "Загружаем темы..." : "Все темы"}
                                </option>
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.title}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                                Уровень сложности
                            </span>
                            <select
                                value={selectedGrade}
                                onChange={(event) =>
                                    handleGradeChange(event.target.value as "" | TestGrade)
                                }
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                            >
                                {GRADE_OPTIONS.map((option) => (
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
                            <TestsList tests={tests} userId={userId} />
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
