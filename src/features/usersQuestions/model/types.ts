export type UserQuestionCreateResponse = {
    id: number
    userId: number
    questionId: number
    answerId: number
    isCorrect: boolean
}

export type UserQuestionCreateRequest = {
    userId: number
    questionId: number
    answerId: number
}