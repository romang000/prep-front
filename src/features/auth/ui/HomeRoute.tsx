import { Navigate } from "react-router-dom"
import { MainPage } from "@/pages/MainPage"
import { LandingPage } from "@/pages/LandingPage"
import { useAuth } from "../model/useAuth"

export function HomeRoute() {
    const { isAuthenticated, isAdmin } = useAuth()

    if (!isAuthenticated) {
        return <LandingPage />
    }

    if (isAdmin) {
        return <Navigate to="/admin" replace />
    }

    return <MainPage />
}
