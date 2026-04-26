import { apiFetch } from '@/shared/api/client'
import type { UserTestSessionCreateRequest, UserTestSessionCreateResponse } from '../model/types'

export async function createUserTestSession(
  request: UserTestSessionCreateRequest,
): Promise<UserTestSessionCreateResponse> {
  return apiFetch<UserTestSessionCreateResponse>(`/user-test-sessions`, {
    service: 'tests',
    method: 'POST',
    body: JSON.stringify(request),
  })
}