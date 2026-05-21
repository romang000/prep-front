import { Link } from "react-router-dom"

const features = [
    {
        title: "Диагностика уровня",
        description:
            "Платформа помогает начать с проверки текущих знаний и подобрать дальнейший маршрут подготовки.",
    },
    {
        title: "Тесты по темам",
        description:
            "Вопросы сгруппированы по направлениям, чтобы тренироваться точечно и видеть результат после каждой попытки.",
    },
    {
        title: "Материалы для повторения",
        description:
            "Теория и полезные материалы собраны рядом с практикой, чтобы быстрее закрывать слабые места.",
    },
]

const stats = [
    { value: "01", label: "Определите стартовый уровень" },
    { value: "02", label: "Проходите тематические тесты" },
    { value: "03", label: "Отслеживайте прогресс" },
]

export function LandingPage() {
    return (
        <main className="min-h-screen bg-[#f6f7f2] text-slate-950">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.08),_transparent_45%)]" />
                <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
                    <header className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                Prep Platform
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                Подготовка к техническим собеседованиям
                            </p>
                        </div>

                        <Link
                            to="/auth"
                            className="rounded-lg border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 hover:bg-white"
                        >
                            Войти
                        </Link>
                    </header>

                    <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
                        <div className="max-w-3xl">
                            <div className="mb-6 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                                Персональный маршрут подготовки
                            </div>

                            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                                Сервис для спокойной и системной подготовки к собеседованиям
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                                Проходите диагностические и тематические тесты, повторяйте
                                материалы по слабым темам и смотрите, как растет ваша
                                готовность к техническому интервью.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800"
                                >
                                    Войти или зарегистрироваться
                                </Link>
                                <a
                                    href="#about"
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/75 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-white"
                                >
                                    Узнать подробнее
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur">
                                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                                        <div>
                                            <p className="text-sm text-emerald-200">Сегодня</p>
                                            <p className="mt-1 text-2xl font-semibold">
                                                Рекомендация
                                            </p>
                                        </div>
                                        <div className="rounded-full bg-emerald-400 px-3 py-1 text-sm font-semibold text-slate-950">
                                            Старт
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl bg-white/10 p-5">
                                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
                                            План на сегодня
                                        </p>
                                        <h2 className="mt-3 text-3xl font-semibold leading-tight">
                                            Изучить материал и закрепить его тестом на Prep Platform
                                        </h2>
                                        <p className="mt-4 text-sm leading-6 text-slate-300">
                                            Короткий цикл подготовки помогает сразу проверить,
                                            насколько хорошо тема осталась в памяти.
                                        </p>
                                    </div>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl bg-white/10 p-4">
                                            <p className="text-lg font-semibold">1 материал</p>
                                            <p className="mt-1 text-sm text-slate-300">
                                                для спокойного повторения
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-white/10 p-4">
                                            <p className="text-lg font-semibold">1 тест</p>
                                            <p className="mt-1 text-sm text-slate-300">
                                                чтобы закрепить результат
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            to="/auth?mode=register"
                                            className="inline-flex w-full justify-center rounded-lg bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
                                        >
                                            Начать учиться
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="about" className="grid gap-4 pb-8 md:grid-cols-3">
                        {features.map((feature) => (
                            <article
                                key={feature.title}
                                className="rounded-xl border border-slate-200 bg-white/85 p-5 shadow-sm shadow-slate-950/5"
                            >
                                <h2 className="text-lg font-semibold text-slate-950">
                                    {feature.title}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
                    {stats.map((item) => (
                        <div key={item.value} className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800">
                                {item.value}
                            </div>
                            <p className="text-base font-medium text-slate-800">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
