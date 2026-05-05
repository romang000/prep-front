import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/model/useAuth"

export function AdminPage() {
    const navigate = useNavigate()
    const { logout, role } = useAuth()

    async function handleLogout() {
        await logout()
        navigate("/auth", { replace: true })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/10">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
                        {role ?? "ROLE_ADMIN"}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Выйти"
                        title="Выйти"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg text-slate-700 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
                    >
                        ↪
                    </button>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                    Панель администратора
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Это временная заглушка для пользователя с ролью администратора.
                    Основные функции администрирования будут добавлены позже.
                </p>
            </div>
        </div>
    )
}
