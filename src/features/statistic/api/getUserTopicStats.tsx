import { apiFetch } from '@/shared/api/client'
import type { TopicStatisticsResponse } from '../model/types'

export async function getAllUserTopicStats(
  userId: number,
): Promise<TopicStatisticsResponse[]> {
  return apiFetch<TopicStatisticsResponse[]>(`/user-topic-stats/users/${userId}`, {
    service: 'tests',
    method: 'GET',
  })
}