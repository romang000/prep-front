import { apiFetch } from "@/shared/api/client"
import type { TestResponse } from "../model/types"

export function getDiagnosticTestByLearningTrack(learningTrackId: number) {
    return apiFetch<TestResponse>(`/tests/test/learning-track/${learningTrackId}`, {
        service: "tests",
        method: "GET",
    })
}
