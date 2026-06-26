export type ReadinessStatus = "NOT_ENOUGH_DATA" | "NOT_READY" | "READY"

export type ProgressStatus =
    | "NOT_ENOUGH_DATA"
    | "POSITIVE"
    | "STABLE"
    | "NEGATIVE"

export interface ReadinessResponse {
    readinessIndex: number
    previousReadinessIndex: number | null
    readinessDelta: number | null
    readinessStatus: ReadinessStatus
    progressStatus: ProgressStatus
    evaluatedTopicCount: number
    masteredTopicCount: number
    weakTopicCount: number
    coverage: number
    calculatedAt: string
}

export interface ReadinessHistoryItem {
    readinessIndex: number
    calculatedAt: string
}
