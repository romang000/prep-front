import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react"
import { login as loginRequest } from "../api/login"
import { logout as logoutRequest } from "../api/logout"
import { register as registerRequest } from "../api/register"
import {
    AUTH_TOKENS_CHANGE_EVENT,
    clearAuthTokens,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
} from "./tokenStorage"
import { AuthContext } from "./authContextValue"
import { getUserIdFromToken, getUserRoleFromToken } from "./jwt"
import type { LoginRequest, RegisterRequest } from "./types"

export function AuthProvider({ children }: PropsWithChildren) {
    const [accessToken, setAccessToken] = useState(getAccessToken())
    const [userId, setUserId] = useState(getUserIdFromToken(accessToken))
    const [role, setRole] = useState(getUserRoleFromToken(accessToken))
    const isAuthenticated = Boolean(accessToken)
    const isAdmin = role === "ROLE_ADMIN"

    useEffect(() => {
        function syncAuthState() {
            const nextAccessToken = getAccessToken()

            setAccessToken(nextAccessToken)
            setUserId(getUserIdFromToken(nextAccessToken))
            setRole(getUserRoleFromToken(nextAccessToken))
        }

        window.addEventListener(AUTH_TOKENS_CHANGE_EVENT, syncAuthState)
        window.addEventListener("storage", syncAuthState)

        return () => {
            window.removeEventListener(AUTH_TOKENS_CHANGE_EVENT, syncAuthState)
            window.removeEventListener("storage", syncAuthState)
        }
    }, [])

    const login = useCallback(async (request: LoginRequest) => {
        const tokens = await loginRequest(request)

        setAuthTokens(tokens)
        setAccessToken(tokens.accessToken)
        setUserId(getUserIdFromToken(tokens.accessToken))
        setRole(getUserRoleFromToken(tokens.accessToken))

        return { role: getUserRoleFromToken(tokens.accessToken) }
    }, [])

    const register = useCallback(async (request: RegisterRequest) => {
        const tokens = await registerRequest(request)

        setAuthTokens(tokens)
        setAccessToken(tokens.accessToken)
        setUserId(getUserIdFromToken(tokens.accessToken))
        setRole(getUserRoleFromToken(tokens.accessToken))

        return { role: getUserRoleFromToken(tokens.accessToken) }
    }, [])

    const logout = useCallback(async () => {
        const token = getRefreshToken() ?? getAccessToken()

        try {
            if (token) {
                await logoutRequest(token)
            }
        } finally {
            clearAuthTokens()
            setAccessToken(null)
            setUserId(null)
            setRole(null)
        }
    }, [])

    const value = useMemo(
        () => ({
            isAuthenticated,
            userId,
            role,
            isAdmin,
            login,
            register,
            logout,
        }),
        [isAdmin, isAuthenticated, login, logout, register, role, userId],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
