import { apiFetch } from '@/shared/api/client'
import type { UserQuestionCreateRequest, UserQuestionCreateResponse } from '../model/types'

export async function createUserQuestion(
  request: UserQuestionCreateRequest,
): Promise<UserQuestionCreateResponse> {
  return apiFetch<UserQuestionCreateResponse>(`/user-questions`, {
    service: 'tests',
    method: 'POST',
    body: JSON.stringify(request),
  })
}