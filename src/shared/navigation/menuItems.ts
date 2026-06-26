import type { MenuItem } from "@/shared/ui/Sidebar"

export function getMainMenuItems(userId: number | null): MenuItem[] {
    return [
        { label: "Главная", to: "/" },
        { label: "Тесты", to: "/tests" },
        { label: "Материалы", to: "/materials" },
        { label: "Статистика по темам", to: `/statistics/users/${userId ?? ""}` },
        { label: "Готовность", to: "/readiness" },
        { label: "Профиль", to: "/profile" },
    ]
}
