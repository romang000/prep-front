import { useEffect, useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getLearningTracks } from "@/features/learningTracks/api/getLearningTracks"
import type { LearningTrack } from "@/features/learningTracks/model/types"
import { getProfile } from "@/features/profile/api/getProfile"
import { getDiagnosticTestByLearningTrack } from "@/features/tests/api/getDiagnosticTestByLearningTrack"
import type { TestResponse } from "@/features/tests/model/types"
import { createUserTestSession } from "@/features/userTestSession/api/userTestSession"
import { AuthFetchError } from "../api/authFetch"
import { useAuth } from "../model/useAuth"

type AuthMode = "login" | "register"
type AuthField = "email" | "learningTrackId" | "login" | "password"
type AuthFieldErrors = Partial<Record<AuthField, string>>

export function AuthPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, userId, login, register, logout } = useAuth()
    const [mode, setMode] = useState<AuthMode>("login")
    const [email, setEmail] = useState("")
    const [loginValue, setLoginValue] = useState("")
    const [password, setPassword] = useState("")
    const [learningTrackId, setLearningTrackId] = useState("")
    const [learningTracks, setLearningTracks] = useState<LearningTrack[]>([])
    const [isLearningTracksLoading, setIsLearningTracksLoading] = useState(false)
    const [learningTracksError, setLearningTracksError] = useState<string | null>(null)
    const [diagnosticTest, setDiagnosticTest] = useState<TestResponse | null>(null)
    const [redirectPath, setRedirectPath] = useState("/")
    const [isStartingDiagnosticTest, setIsStartingDiagnosticTest] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({})
    const [error, setError] = useState<string | null>(null)

    const isRegisterMode = mode === "register"
    const fromPath = getRedirectPath(location.state)

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)

        if (searchParams.get("mode") === "register") {
            setMode("register")
            setError(null)
            setFieldErrors({})
        }
    }, [location.search])

    useEffect(() => {
        if (!isRegisterMode) {
            return
        }

        let isActive = true

        async function loadLearningTracks() {
            try {
                setIsLearningTracksLoading(true)
                setLearningTracksError(null)

                const tracks = await getLearningTracks()

                if (isActive) {
                    setLearningTracks(tracks)
                }
            } catch {
                if (isActive) {
                    setLearningTracksError("Не удалось загрузить направления подготовки.")
                }
            } finally {
                if (isActive) {
                    setIsLearningTracksLoading(false)
                }
            }
        }

        loadLearningTracks()

        return () => {
            isActive = false
        }
    }, [isRegisterMode])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const nextFieldErrors = validateAuthForm({
            email,
            loginValue,
            password,
            learningTrackId,
            isRegisterMode,
        })

        if (Object.keys(nextFieldErrors).length > 0) {
            setFieldErrors(nextFieldErrors)
            setError(null)
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)
            setFieldErrors({})

            const authResult = isRegisterMode
                ? await register({
                    email,
                    login: loginValue,
                    password,
                    learningTrackId: Number(learningTrackId),
                })
                : await login({
                    login: loginValue,
                    password,
                })

            const nextRedirectPath = authResult.role === "ROLE_ADMIN" ? "/admin" : fromPath

            if (authResult.role !== "ROLE_ADMIN") {
                try {
                    const profile = await getProfile()

                    if (profile.grade === null && profile.learningTrackId !== null) {
                        const test = await getDiagnosticTestByLearningTrack(profile.learningTrackId)

                        setDiagnosticTest(test)
                        setRedirectPath(nextRedirectPath)
                        return
                    }
                } catch (e) {
                    console.error("Не удалось проверить диагностический тест", e)
                }
            }

            navigate(nextRedirectPath, {
                replace: true,
            })
        } catch (error) {
            if (isRegisterMode && error instanceof AuthFetchError && error.status === 409) {
                setError("Пользователь с такой почтой или логином уже существует.")
                return
            }

            setError(
                isRegisterMode
                    ? "Не удалось зарегистрироваться. Проверьте данные и попробуйте снова."
                    : "Не удалось войти. Проверьте логин и пароль.",
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    function clearFieldError(field: AuthField) {
        setFieldErrors((currentErrors) => {
            if (!currentErrors[field]) {
                return currentErrors
            }

            const nextErrors = { ...currentErrors }
            delete nextErrors[field]

            return nextErrors
        })
    }

    async function handleStartDiagnosticTest() {
        if (!diagnosticTest || userId === null) {
            setError("Не удалось начать тест. Попробуйте войти ещё раз.")
            return
        }

        try {
            setIsStartingDiagnosticTest(true)
            setError(null)

            const session = await createUserTestSession({
                userId,
                testId: diagnosticTest.id,
            })

            navigate(`/tests/${diagnosticTest.id}?sessionId=${session.id}`, {
                replace: true,
            })
        } catch {
            setError("Не удалось начать тест. Попробуйте позже.")
        } finally {
            setIsStartingDiagnosticTest(false)
        }
    }

    function handleSkipDiagnosticTest() {
        navigate(redirectPath, {
            replace: true,
        })
    }

    async function handleLogout() {
        try {
            setIsSubmitting(true)
            await logout()
            navigate("/auth")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isAuthenticated && diagnosticTest) {
        return (
            <AuthLayout title="Определите уровень" subtitle={null}>
                <div className="space-y-5">
                    <p className="text-sm leading-6 text-slate-600">
                        Пройдите диагностический тест,
                        чтобы мы подобрали материалы и задания точнее.
                    </p>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-950">
                            {diagnosticTest.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {diagnosticTest.description || "Тест на определение уровня подготовки."}
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleStartDiagnosticTest}
                            disabled={isStartingDiagnosticTest}
                            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isStartingDiagnosticTest ? "Запускаем..." : "Пройти тест"}
                        </button>

                        <button
                            type="button"
                            onClick={handleSkipDiagnosticTest}
                            disabled={isStartingDiagnosticTest}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Позже
                        </button>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    if (isAuthenticated) {
        return (
            <AuthLayout title="Вы авторизованы">
                <div className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">
                        Активная сессия сохранена. Можно продолжить работу или выйти из аккаунта.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/"
                            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            На главную
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isSubmitting}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Выходим..." : "Выйти"}
                        </button>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout title={isRegisterMode ? "Регистрация" : "Вход"}>
            <div className="mb-6 grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button
                    type="button"
                    onClick={() => {
                        setMode("login")
                        setError(null)
                        setFieldErrors({})
                    }}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                        !isRegisterMode
                            ? "bg-white text-emerald-950 shadow-sm shadow-slate-950/5"
                            : "text-slate-500 hover:text-emerald-900"
                    }`}
                >
                    Вход
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setMode("register")
                        setError(null)
                        setFieldErrors({})
                    }}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                        isRegisterMode
                            ? "bg-white text-emerald-950 shadow-sm shadow-slate-950/5"
                            : "text-slate-500 hover:text-emerald-900"
                    }`}
                >
                    Регистрация
                </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                {isRegisterMode && (
                    <>
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-700">
                                Почта
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                    clearFieldError("email")
                                }}
                                required
                                maxLength={255}
                                aria-invalid={Boolean(fieldErrors.email)}
                                className={getFieldClassName(fieldErrors.email)}
                                placeholder="name@example.com"
                            />
                            <FieldError message={fieldErrors.email} />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-700">
                                Направление подготовки
                            </span>
                            <select
                                value={learningTrackId}
                                onChange={(event) => {
                                    setLearningTrackId(event.target.value)
                                    clearFieldError("learningTrackId")
                                }}
                                required
                                disabled={isLearningTracksLoading || learningTracks.length === 0}
                                aria-invalid={Boolean(fieldErrors.learningTrackId)}
                                className={getFieldClassName(fieldErrors.learningTrackId)}
                            >
                                <option value="">
                                    {isLearningTracksLoading
                                        ? "Загружаем направления..."
                                        : "Выберите направление"}
                                </option>
                                {learningTracks.map((track) => (
                                    <option key={track.id} value={track.id}>
                                        {track.title}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={fieldErrors.learningTrackId} />
                        </label>
                    </>
                )}

                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                        Логин
                    </span>
                    <input
                        type="text"
                        value={loginValue}
                        onChange={(event) => {
                            setLoginValue(event.target.value)
                            clearFieldError("login")
                        }}
                        required
                        maxLength={255}
                        aria-invalid={Boolean(fieldErrors.login)}
                        className={getFieldClassName(fieldErrors.login)}
                        placeholder="Введите логин"
                    />
                    <FieldError message={fieldErrors.login} />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                        Пароль
                    </span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value)
                            clearFieldError("password")
                        }}
                        required
                        minLength={isRegisterMode ? 8 : undefined}
                        maxLength={255}
                        aria-invalid={Boolean(fieldErrors.password)}
                        className={getFieldClassName(fieldErrors.password)}
                        placeholder="Введите пароль"
                    />
                    <FieldError message={fieldErrors.password} />
                </label>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {learningTracksError && isRegisterMode && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {learningTracksError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        (isRegisterMode &&
                            (isLearningTracksLoading || learningTracks.length === 0))
                    }
                    className="w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Отправляем..."
                        : isRegisterMode
                            ? "Зарегистрироваться"
                            : "Войти"}
                </button>
            </form>
        </AuthLayout>
    )
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null
    }

    return (
        <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {message}
        </p>
    )
}

function getFieldClassName(error?: string) {
    const baseClassName =
        "h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"

    if (error) {
        return `${baseClassName} border-red-300 hover:border-red-400 focus:border-red-500`
    }

    return `${baseClassName} border-slate-300 hover:border-slate-400 focus:border-slate-500`
}

function validateAuthForm({
    email,
    loginValue,
    password,
    learningTrackId,
    isRegisterMode,
}: {
    email: string
    loginValue: string
    password: string
    learningTrackId: string
    isRegisterMode: boolean
}) {
    const errors: AuthFieldErrors = {}
    const trimmedEmail = email.trim()
    const trimmedLogin = loginValue.trim()

    if (isRegisterMode) {
        if (!trimmedEmail) {
            errors.email = "Введите почту."
        } else if (!isValidEmail(trimmedEmail)) {
            errors.email = "Введите корректную почту."
        }

        if (!learningTrackId) {
            errors.learningTrackId = "Выберите направление подготовки."
        }
    }

    if (!trimmedLogin) {
        errors.login = "Введите логин."
    }

    if (!password) {
        errors.password = "Введите пароль."
    } else if (isRegisterMode && password.length < 8) {
        errors.password = "Пароль должен быть не короче 8 символов."
    }

    return errors
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function AuthLayout({
    title,
    subtitle = "Войдите в аккаунт или зарегистрируйтесь, чтобы получить доступ ко всем функциям платформы.",
    children,
}: {
    title: string
    subtitle?: string | null
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Prep Platform
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {subtitle}
                    </p>
                )}

                <div className="mt-8">{children}</div>
            </div>
        </div>
    )
}

function getRedirectPath(state: unknown) {
    if (
        state &&
        typeof state === "object" &&
        "from" in state &&
        state.from &&
        typeof state.from === "object" &&
        "pathname" in state.from &&
        typeof state.from.pathname === "string"
    ) {
        return state.from.pathname
    }

    return "/"
}
