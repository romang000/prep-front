export type Grade = "JUNIOR" | "MIDDLE" | "SENIOR"

export type TestType = "REGULAR" | "DIAGNOSTIC"

export type TestCreateRequest = {
    title: string
    description?: string
    type?: TestType
    grade?: Grade
    topicId?: number
    learningTrackId?: number
}

export type QuestionCreateRequest = {
    testId: number
    topicId: number
    subtopic?: string
    grade?: Grade
    wordingQuestion: string
    serialNumber: number
}

export type AnswerCreateRequest = {
    questionId: number
    text: string
    isCorrect: boolean
    explanation?: string
}

export type MaterialCreateResponse = {
    materialId: number
    fileId: number
}

export type TopicCreateRequest = {
    title: string
    description?: string
}

export type TopicUpdateRequest = TopicCreateRequest

export type LearningTrackCreateRequest = {
    code: string
    title: string
    description?: string
    topics?: number[]
}

export type LearningTrackUpdateRequest = LearningTrackCreateRequest

export type TitlesByIdsResponse = {
    title: string[]
}
