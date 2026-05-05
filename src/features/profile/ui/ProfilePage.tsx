import { useEffect, useState } from "react"
import { Sidebar, type MenuItem } from "@/shared/ui/Sidebar"
import { TopBar } from "@/shared/ui/TopBar"
import { Header } from "@/shared/ui/Header"
import { Loader } from "@/shared/ui/Loader"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { getProfile } from "../api/getProfile"
import type { UserProfile } from "../model/types"
import { useAuth } from "@/features/auth/model/useAuth"

export function ProfilePage() {
    const { userId } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const menuItems: MenuItem[] = [
        { label: "Главная", to: "/" },
        { label: "Тесты", to: "/tests" },
        { label: "Материалы", to: "/materials" },
        { label: "Статистика по темам", to: `/statistics/users/${userId ?? ""}` },
        { label: "Профиль", to: "/profile" },
    ]

    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true)
                setError(null)

                const data = await getProfile()

                setProfile(data)
            } catch {
                setError("Не удалось загрузить профиль")
            } finally {
                setIsLoading(false)
            }
        }

        loadProfile()
    }, [])

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
                        title="Профиль"
                        description="Основная информация об аккаунте пользователя."
                    />

                    {isLoading && <Loader />}

                    {!isLoading && error && <ErrorLoad message={error} />}

                    {!isLoading && !error && profile && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <ProfileField label="ID" value={profile.id} />
                            <ProfileField label="Логин" value={profile.login} />
                            <ProfileField label="Почта" value={profile.email} />
                            <ProfileField label="Уровень" value={profile.grade ?? "Не указан"} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ProfileField({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
        </div>
    )
}
