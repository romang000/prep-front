import type { AuthDto } from "./types"

const ACCESS_TOKEN_KEY = "prep_access_token"
const REFRESH_TOKEN_KEY = "prep_refresh_token"
export const AUTH_TOKENS_CHANGE_EVENT = "prep-auth-tokens-change"

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(tokens: AuthDto) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    window.dispatchEvent(new Event(AUTH_TOKENS_CHANGE_EVENT))
}

export function clearAuthTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    window.dispatchEvent(new Event(AUTH_TOKENS_CHANGE_EVENT))
}
