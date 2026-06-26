import { apiFetch } from "@/shared/api/client"
import type { ReadinessResponse } from "@/features/readiness/model/types"

export function getMyReadiness(): Promise<ReadinessResponse> {
    return apiFetch<ReadinessResponse>("/readiness/me", {
        service: "readiness",
        method: "GET",
    })
}

export function recalculateReadiness(): Promise<ReadinessResponse> {
    return apiFetch<ReadinessResponse>("/readiness/recalculate", {
        service: "readiness",
        method: "POST",
    })
}
