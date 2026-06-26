import { Header } from "@/shared/ui/Header"
import { Sidebar } from "@/shared/ui/Sidebar"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/features/auth/model/useAuth"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { TopBar } from "@/shared/ui/TopBar"
import { getMainMenuItems } from "@/shared/navigation/menuItems"

export function MainPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { userId } = useAuth()

    const menuItems = getMainMenuItems(userId)

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

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <TopBar onMenuClick={() => setIsMenuOpen(true)} />

                <Header
                    title="Добро пожаловать в приложение для подготовки к собеседованиям"
                    description="Здесь вы можете проходить тесты, изучать полезные материалы, отслеживать результаты и системно готовиться к техническим собеседованиям."
                />

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                        <div className="mb-4 h-10 w-10 rounded-lg bg-emerald-100 text-center text-2xl leading-10 text-emerald-800">
                            ✓
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Проходите тесты
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Выбирайте доступные тесты, проверяйте свои знания и
                            тренируйтесь в формате, приближенном к реальному
                            собеседованию.
                        </p>
                        <Link
                            to="/tests"
                            className="mt-4 inline-block rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            Перейти к тестам
                        </Link>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                        <div className="mb-4 h-10 w-10 rounded-lg bg-emerald-100 text-center text-2xl leading-10 text-emerald-800">
                            ◇
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Изучайте материалы
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Повторяйте теорию, разбирайте сложные темы и используйте
                            дополнительные материалы для более глубокой подготовки.
                        </p>
                        <Link
                            to="/materials"
                            className="mt-4 inline-block rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            Открыть материалы
                        </Link>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 md:col-span-2 xl:col-span-1">
                        <div className="mb-4 h-10 w-10 rounded-lg bg-emerald-100 text-center text-2xl leading-10 text-emerald-800">
                            ↗
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Анализируйте прогресс
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Смотрите результаты, находите слабые места и понимайте,
                            какие темы нужно повторить в первую очередь.
                        </p>
                        <Link
                            to={`/statistics/users/${userId}`}
                            className="mt-4 inline-block rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            Посмотреть статистику по темам
                        </Link>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Что есть в приложении
                        </h2>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Тестирование по темам
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Практика по разным направлениям и вопросам, которые
                                    часто встречаются на собеседованиях.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Учебные материалы
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Теория, пояснения и полезная информация для повторения
                                    и закрепления знаний.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Отслеживание результатов
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Возможность оценивать свой прогресс и понимать,
                                    насколько улучшается подготовка.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            С чего начать
                        </h2>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div className="text-lg font-semibold text-slate-950">1</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Откройте список тестов и выберите нужную тему.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div className="text-lg font-semibold text-slate-950">2</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Пройдите тест и посмотрите, где были ошибки.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div className="text-lg font-semibold text-slate-950">3</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Повторите материалы и улучшите результат.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
