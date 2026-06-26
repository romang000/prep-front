import { useEffect, useState } from "react"
import { Sidebar } from "@/shared/ui/Sidebar"
import { TopBar } from "@/shared/ui/TopBar"
import { Header } from "@/shared/ui/Header"
import { Loader } from "@/shared/ui/Loader"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { getLearningTracks } from "@/features/learningTracks/api/getLearningTracks"
import { getProfile } from "../api/getProfile"
import type { UserProfile } from "../model/types"
import { useAuth } from "@/features/auth/model/useAuth"
import { getMainMenuItems } from "@/shared/navigation/menuItems"

export function ProfilePage() {
    const { userId } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [learningTrackTitle, setLearningTrackTitle] = useState("Не указано")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const menuItems = getMainMenuItems(userId)

    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true)
                setError(null)

                const [data, learningTracks] = await Promise.all([
                    getProfile(),
                    getLearningTracks(),
                ])
                const learningTrack = learningTracks.find(
                    (track) => track.id === data.learningTrackId,
                )

                setProfile(data)
                setLearningTrackTitle(learningTrack?.title ?? "Не указано")
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
                            <ProfileField label="Логин" value={profile.login} />
                            <ProfileField label="Почта" value={profile.email} />
                            <ProfileField
                                label="Направление подготовки"
                                value={learningTrackTitle}
                            />
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
