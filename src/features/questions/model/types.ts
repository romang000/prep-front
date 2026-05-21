export type QuestionResponse = {
    id: number
    testId: number
    topic?: string
    topicId: number
    subtopic?: string | null
    grade?: "JUNIOR" | "MIDDLE" | "SENIOR" | null
    wordingQuestion: string
    serialNumber: number
}
