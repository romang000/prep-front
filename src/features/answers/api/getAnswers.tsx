import { apiFetch } from '@/shared/api/client'
import type { AnswerGetResponse } from '../model/types'

export async function getAnswers(
  questionId: number,
): Promise<AnswerGetResponse[]> {
  return apiFetch<AnswerGetResponse[]>(`/answers/questions/${questionId}`, {
    service: 'tests',
    method: 'GET',
  })
}