export type PageDto<T> = {
    content: T[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
}

export type MaterialGetResponse = {
    id: number
    title: string
    description: string
    fileId: number
    topic: string
    subtopic: string
    level: string
    isLiked: boolean
}

export type MaterialGetRequest = {
    userId: number
    level?: string
    pageNumber: number
    topic: string
    pageSize: number
}

export type MaterialSetLikeRequest = {
    userId: number
    materialId: number
    isLiked: boolean
}

export type MaterialSetLikeResponse = {
    userId: number
    materialId: number
    isLiked: boolean
}

export type MaterialGetTopicsRequest = {
    userId: number
    level?: string
    pageNumber: number
    pageSize: number
}

export type MaterialTopicGetResponse = {
    id: number
    topic: string
}