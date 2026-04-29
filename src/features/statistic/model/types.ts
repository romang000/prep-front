export type TopicStatisticsResponse = {
    topic: string
    totalAnswered: number
    correctCount: number
    incorrectCount: number
    accuracy: number
}

export type SubtopicStatisticsResponse = {
    topic: string
    subtopic: string
    totalAnswered: number
    correctCount: number
    incorrectCount: number
    accuracy: number
}

export type UserTopicStatsGetBySubtopicRequest = {
    userId: number
    topic: string
}