import { Header } from "@/shared/ui/Header"
import { Sidebar, type MenuItem } from "@/shared/ui/Sidebar"
import { useState } from "react"
import { Link } from "react-router-dom"

const menuItems: MenuItem[] = [
    { label: "Главная", to: "/" },
    { label: "Тесты", to: "/tests" },
    { label: "Материалы", to: "/materials" },
    { label: "Результаты", to: "/results" },
    { label: "Профиль", to: "/profile" },
]

export function MainPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                items={menuItems}
            />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                        ☰ Меню
                    </button>
                </div>

                <Header
                    title="Добро пожаловать в приложение для подготовки к собеседованиям"
                    description="Здесь вы можете проходить тесты, изучать полезные материалы, отслеживать результаты и системно готовиться к техническим собеседованиям."
                />

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
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
                            className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Перейти к тестам
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Изучайте материалы
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Повторяйте теорию, разбирайте сложные темы и используйте
                            дополнительные материалы для более глубокой подготовки.
                        </p>
                        <Link
                            to="/materials"
                            className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Открыть материалы
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2 xl:col-span-1">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Анализируйте прогресс
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Смотрите результаты, находите слабые места и понимайте,
                            какие темы нужно повторить в первую очередь.
                        </p>
                        <Link
                            to="/results"
                            className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Посмотреть результаты
                        </Link>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Что есть в приложении
                        </h2>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-xl border border-slate-200 p-4">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Тестирование по темам
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Практика по разным направлениям и вопросам, которые
                                    часто встречаются на собеседованиях.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Учебные материалы
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Теория, пояснения и полезная информация для повторения
                                    и закрепления знаний.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
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

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            С чего начать
                        </h2>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="text-lg font-bold text-blue-600">1</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Откройте список тестов и выберите нужную тему.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="text-lg font-bold text-blue-600">2</div>
                                <p className="mt-2 text-sm text-slate-600">
                                    Пройдите тест и посмотрите, где были ошибки.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="text-lg font-bold text-blue-600">3</div>
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