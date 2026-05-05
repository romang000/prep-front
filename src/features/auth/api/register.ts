import { authFetch } from "./authFetch"
import type { AuthDto, RegisterRequest } from "../model/types"

export function register(request: RegisterRequest) {
    return authFetch<AuthDto>("/register", {
        method: "POST",
        body: JSON.stringify(request),
    })
}
