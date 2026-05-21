import { apiFetch } from "@/shared/api/client"
import type { LearningTrack } from "../model/types"

export function getLearningTracks() {
    return apiFetch<LearningTrack[]>("/learning-tracks", {
        service: "tests",
        method: "GET",
    })
}
