import { apiFetch } from '@/shared/api/client'
import type { RecommendationCreateRequest, RecommendationCreateResponse } from '../model/types'

export async function createRecommendations(
    request: RecommendationCreateRequest,
): Promise<RecommendationCreateResponse> {
    return apiFetch<RecommendationCreateResponse>(`/recommendations`, {
        service: 'recommendations',
        method: 'POST',
        body: JSON.stringify(request),
    })
}