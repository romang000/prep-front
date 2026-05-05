import { authFetch } from "./authFetch"

export function logout(token: string) {
    return authFetch<void>("/logout", {
        method: "POST",
        body: JSON.stringify({ token }),
    })
}
