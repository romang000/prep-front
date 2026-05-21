import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/model/useAuth"

type TopBarProps = {
    onMenuClick?: () => void
    backLabel?: string
    onBackClick?: () => void
    rightContent?: React.ReactNode
}

export function TopBar({
    onMenuClick,
    backLabel,
    onBackClick,
    rightContent,
}: TopBarProps) {
    const navigate = useNavigate()
    const { logout } = useAuth()

    async function handleLogout() {
        await logout()
        navigate("/auth", { replace: true })
    }

    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
                {onMenuClick && (
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                        ☰ Меню
                    </button>
                )}

                {backLabel && onBackClick && (
                    <button
                        type="button"
                        onClick={onBackClick}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                        {backLabel}
                    </button>
                )}
            </div>

            <div className="flex items-center gap-3">
                {rightContent}

                <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Выйти"
                    title="Выйти"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg text-emerald-900 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 hover:bg-slate-50 hover:text-emerald-950"
                >
                    ↪
                </button>
            </div>
        </div>
    )
}
