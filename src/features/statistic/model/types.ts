export type TopicStatisticsResponse = {
    topicId: number
    topicTitle: string
    totalAnswered: number
    correctCount: number
    incorrectCount: number
    accuracy: number
}

export type SubtopicStatisticsResponse = {
    topicTitle: string
    subtopic: string
    totalAnswered: number
    correctCount: number
    incorrectCount: number
    accuracy: number
}

export type UserTopicStatsGetBySubtopicRequest = {
    userId: number
    topicId: number
}
