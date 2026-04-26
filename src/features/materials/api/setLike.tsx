import { apiFetch } from '@/shared/api/client'
import type { MaterialSetLikeRequest, MaterialSetLikeResponse } from '../model/types'

export async function setLikeRequest(
  request: MaterialSetLikeRequest,
): Promise<MaterialSetLikeResponse> {
  return apiFetch<MaterialSetLikeResponse>(`/materials/setLike`, {
    service: 'materials',
    method: 'POST',
    body: JSON.stringify(request),
  })
}