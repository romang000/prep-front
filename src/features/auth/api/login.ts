import { authFetch } from "./authFetch"
import type { AuthDto, LoginRequest } from "../model/types"

export function login(request: LoginRequest) {
    return authFetch<AuthDto>("/login", {
        method: "POST",
        body: JSON.stringify(request),
    })
}
