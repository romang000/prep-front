import { Navigate } from "react-router-dom"
import { MainPage } from "@/pages/MainPage"
import { useAuth } from "../model/useAuth"

export function HomeRoute() {
    const { isAdmin } = useAuth()

    if (isAdmin) {
        return <Navigate to="/admin" replace />
    }

    return <MainPage />
}
