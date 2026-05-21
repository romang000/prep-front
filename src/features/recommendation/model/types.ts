export type RecommendationCreateResponse = {
    userId: number
    recommendationType: string
    targetId: number | null
    sourceService: string
    topicId: number
    topicTitle: string
    subtopic: string
    reason: string
    priority: number
    status: string
}

export type RecommendationCreateRequest = {
    userId: number
}
