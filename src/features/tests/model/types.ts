export type TestResponse = {
    id: number
    title: string
    description: string
}

export type TestGetRequest = {
    pageNumber: number
    pageSize: number
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