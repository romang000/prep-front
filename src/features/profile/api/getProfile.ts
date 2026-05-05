import { apiFetch } from "@/shared/api/client"
import type { UserProfile } from "../model/types"

export function getProfile() {
    return apiFetch<UserProfile>("/users/me", {
        service: "auth",
        method: "GET",
    })
}
