import { apiFetch } from '@/shared/api/client'
import type { QuestionResponse } from '../model/types'

export async function getQuestions(
  testId: number,
): Promise<QuestionResponse[]> {
  return apiFetch<QuestionResponse[]>(`/questions/tests/${testId}`, {
    service: 'tests',
    method: 'GET',
  })
}