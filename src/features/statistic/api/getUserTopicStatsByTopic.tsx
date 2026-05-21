import { apiFetch } from '@/shared/api/client'
import type { SubtopicStatisticsResponse, UserTopicStatsGetBySubtopicRequest } from '../model/types'

export async function getUserTopicStatsByTopic(
    params: UserTopicStatsGetBySubtopicRequest
): Promise<SubtopicStatisticsResponse[]> {

    const searchParams = new URLSearchParams({
        userId: String(params.userId),
        topicId: String(params.topicId),
    });

    return apiFetch<SubtopicStatisticsResponse[]>(
        `/user-topic-stats?${searchParams.toString()}`,
        {
            service: 'tests',
            method: 'GET',
        },
    );
}
