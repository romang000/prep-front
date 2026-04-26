import { apiFetch } from '@/shared/api/client'
import type { UserTestSessionCompleteRequest, UserTestSessionCompleteResponse } from '../model/types'

export async function setUserTestSessionComplete(
    request: UserTestSessionCompleteRequest,
): Promise<UserTestSessionCompleteResponse> {
    return apiFetch<UserTestSessionCompleteResponse>(`/user-test-sessions/complete`, {
        service: 'tests',
        method: 'POST',
        body: JSON.stringify(request),
    })
}