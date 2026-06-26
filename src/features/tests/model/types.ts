export type TestGrade = "JUNIOR" | "MIDDLE" | "SENIOR"

export type TestResponse = {
    id: number
    title: string
    description: string
    type?: "REGULAR" | "DIAGNOSTIC"
    grade?: TestGrade | null
    topicTitle?: string | null
}

export type TestGetRequest = {
    pageNumber: number
    pageSize: number
    topicId?: number
    grade?: TestGrade
}

export type PageDto<T> = {
    content: T[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
}

export type TestResult = {
    correctCount: number
    wrongCount: number
    totalQuestions: number
    percent: number
    message: string
}
