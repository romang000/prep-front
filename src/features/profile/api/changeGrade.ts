import { apiFetch } from "@/shared/api/client"
import type { UserProfile } from "../model/types"

export type ChangeGradeRequest = {
    userId: number
    grade: "JUNIOR" | "MIDDLE" | "SENIOR"
}

export function changeGrade(request: ChangeGradeRequest) {
    return apiFetch<UserProfile>("/users/grade", {
        service: "auth",
        method: "PATCH",
        body: JSON.stringify(request),
    })
}
