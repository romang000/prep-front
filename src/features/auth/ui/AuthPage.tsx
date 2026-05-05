import { useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../model/useAuth"

type AuthMode = "login" | "register"

export function AuthPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, login, register, logout } = useAuth()
    const [mode, setMode] = useState<AuthMode>("login")
    const [email, setEmail] = useState("")
    const [loginValue, setLoginValue] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isRegisterMode = mode === "register"
    const fromPath = getRedirectPath(location.state)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        try {
            setIsSubmitting(true)
            setError(null)

            const authResult = isRegisterMode
                ? await register({
                    email,
                    login: loginValue,
                    password,
                })
                : await login({
                    login: loginValue,
                    password,
                })

            navigate(authResult.role === "ROLE_ADMIN" ? "/admin" : fromPath, {
                replace: true,
            })
        } catch {
            setError(
                isRegisterMode
                    ? "Не удалось зарегистрироваться. Проверьте данные и попробуйте снова."
                    : "Не удалось войти. Проверьте логин и пароль.",
            )
        } finally {
            setIsSubmitting(false)
        }
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
            <div className="mb-6 grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                    type="button"
                    onClick={() => {
                        setMode("login")
                        setError(null)
                    }}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                        !isRegisterMode
                            ? "bg-white text-slate-950 shadow-sm shadow-slate-950/5"
                            : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                    Вход
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setMode("register")
                        setError(null)
                    }}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                        isRegisterMode
                            ? "bg-white text-slate-950 shadow-sm shadow-slate-950/5"
                            : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                    Регистрация
                </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {isRegisterMode && (
                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                            Почта
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            maxLength={255}
                            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                            placeholder="name@example.com"
                        />
                    </label>
                )}

                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                        Логин
                    </span>
                    <input
                        type="text"
                        value={loginValue}
                        onChange={(event) => setLoginValue(event.target.value)}
                        required
                        maxLength={255}
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                        placeholder="Введите логин"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                        Пароль
                    </span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={isRegisterMode ? 8 : undefined}
                        maxLength={255}
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                        placeholder="Введите пароль"
                    />
                </label>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
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

function AuthLayout({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/10">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Используйте аккаунт, чтобы сохранять сессию и работать с защищёнными
                    запросами.
                </p>

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
