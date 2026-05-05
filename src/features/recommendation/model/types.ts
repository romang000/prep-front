export type RecommendationCreateResponse = {
    userId: number
    recommendationType: string
    targetId: number
    sourceService: string
    topic: string
    subtopic: string
    reason: string
    priority: number
    status: string
}

export type RecommendationCreateRequest = {
    userId: number
}