export type LearningTrack = {
    id: number
    code: string
    title: string
    description?: string | null
    topicIds: number[]
}
