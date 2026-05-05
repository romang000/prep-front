import { authFetch } from "./authFetch"
import type { AuthDto } from "../model/types"

export function refreshTokens(token: string) {
    return authFetch<AuthDto>("/refresh", {
        method: "POST",
        body: JSON.stringify({ token }),
    })
}
