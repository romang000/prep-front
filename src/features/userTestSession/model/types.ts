export type UserTestSessionCreateRequest = {
    userId: number
    testId: number
}

export type UserTestSessionCreateResponse = {
    id: number
    userId: number
    testId: number
    startAt: string
}

export type UserTestSessionCompleteRequest = {
    id: number
    isComplete: boolean
}

export type UserTestSessionCompleteResponse = {
    id: number
    userId: number
    testId: number
    startAt: string
    endAt: string
    totalSecond: number
    isCompleted: boolean
    userLevel?: "JUNIOR" | "MIDDLE" | "SENIOR" | null
}
