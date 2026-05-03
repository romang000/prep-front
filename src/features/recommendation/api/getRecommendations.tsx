import { apiFetch } from '@/shared/api/client'
import type { RecommendationCreateResponse } from '../model/types'

export async function getRecommendations(
  userId: number,
): Promise<RecommendationCreateResponse[]> {
  return apiFetch<RecommendationCreateResponse[]>(`/recommendations/users/${userId}`, {
    service: 'recommendations',
    method: 'GET',
  })
}