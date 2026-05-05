import { createContext } from "react"
import type { LoginRequest, RegisterRequest } from "./types"

export type AuthContextValue = {
    isAuthenticated: boolean
    userId: number | null
    role: string | null
    isAdmin: boolean
    login: (request: LoginRequest) => Promise<{ role: string | null }>
    register: (request: RegisterRequest) => Promise<{ role: string | null }>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
